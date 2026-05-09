require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


// Extracts failure line by keyword
function extractFailures(logs) {
    const failureKeywords = ["ERROR", "FAIL", "EXCEPTION", "TIMEOUT"];

    for (let i = 0; i<logs.length; i++) {
        const line = logs[i];

        for (let j = 0; j<failureKeywords.length; j++) {
            if (line.includes(failureKeywords[j])) {

                let category = "GENERAL_FAILURE";
                let severity = "LOW";

                const lower = line.toLowerCase();

                if (lower.includes("timeout")) {
                    category = "TIMEOUT";
                    severity = "HIGH";
                }
                else if (lower.includes("auth") || lower.includes("unauthorized")) {
                    category = "AUTH";
                    severity = "HIGH";
                }
                else if (lower.includes("db") || lower.includes("connection")) {
                    category = "DATABASE";
                    severity = "HIGH";
                }
                else if (lower.includes("error")) {
                    category = "ERROR";
                    severity = "MEDIUM";
                }

                let humanSummary = "Failure detected in application logs";

                if (category === "TIMEOUT") {
                    humanSummary = "A request exceeded the allowed response time.";
                }
                else if (category === "AUTH") {
                    humanSummary = "Authentication or authorization failure detected.";
                }
                else if (category === "DATABASE") {
                    humanSummary = "Database operation or connection failure detected.";
                }
                else if (category === "ERROR") {
                    humanSummary = "Application error detected during request processing.";
                }

                return {
                    message: line,
                    category,
                    severity,
                    humanSummary
                };
            }
        }
    }

    return null;
}

// Serve dashboard
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Create failure (ingest a failure event)
app.post("/api/failures", async (req, res) => {
    const { logs, service } = req.body;

    //Extract failure from logs
    const extracted = extractFailures(logs);

    //Reject request if nothing is found
    if (!extracted) {
        return res.status(400).json({
            error: "No failure detected in logs"
        });
    }

    //Store only extracted failure in DB
    const result = await pool.query(
        "INSERT INTO failures (raw_message, service, category, severity) VALUES ($1, $2, $3, $4) RETURNING *",
        [
            extracted.message,
            service,
            extracted.category,
            extracted.severity
        ]
    );

    //Return stored record
    res.status(201).json({
        ...result.rows[0],
        humanSummary: extracted.humanSummary
    });
});

app.get("/api/failures", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM failures ORDER BY id DESC"
    );

    res.json(result.rows);
});

app.get("/api/failures/metrics", async (req, res) => {
    const hours = parseInt(req.query.hours || "24", 10);

    //validating hours
    if (isNaN(hours) || hours <= 0 || hours > 168) {
        return res.status(400).json({
            error: "Invalid 'hours' parameter. Must be a number between 1 and 168."
        });
    }

    const result = await pool.query(`
        SELECT service, category, COUNT(*) AS count
        FROM failures
        WHERE created_at >= NOW() - INTERVAL '${hours} hours'
        GROUP BY service, category
        ORDER BY service;
        `);

    const rows = result.rows;

    const metrics = {};

    for (let i=0; i<rows.length; i++) {
        const { service, category, count } = rows[i];

        if(!metrics[service]) {
            metrics[service] = {};
        }

        metrics[service][category] = parseInt(count);
    }

    res.json(metrics);
});

app.get("/api/failures/repeated", async (req, res) => {
    const hours = parseInt(req.query.hours || "24", 10);

    if (isNaN(hours) || hours <= 0 || hours > 168) {
        return res.status(400).json({
            error: "Invalid 'hours' parameter. Must be between 1 and 168."
        });
    }

    const result = await pool.query(`
        SELECT raw_message, service, COUNT(*) AS count
        FROM failures
        WHERE created_at >= NOW() - INTERVAL '${hours} hours'
        GROUP BY raw_message, service
        HAVING COUNT(*) >= 3
        ORDER BY count DESC;
        `);

        res.json(result.rows);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
