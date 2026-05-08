require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();

app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
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

                return {
                    message: line,
                    category,
                    severity
                };
            }
        }
    }

    return null;
}

// Home
app.get("/", (req, res) => {
    res.json({
        message: "Failure Intelligence API",
        status: "running"
    });
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
    res.status(201).json(result.rows[0]);
});

app.get("/api/failures", async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM failures ORDER BY id DESC"
    );

    res.json(result.rows);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});