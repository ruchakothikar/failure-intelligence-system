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
            const keyword = failureKeywords[j];

            if (line.includes(keyword)) {
                return line;
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
    const extractedMessage = extractFailures(logs);

    //Reject request if nothing is found
    if (!extractedMessage) {
        return res.status(400).json({
            error: "No failure detected in logs"
        });
    }

    //Store only extracted failure in DB
    const result = await pool.query(
        "INSERT INTO failures (raw_message, service) VALUES ($1, $2) RETURNING *",
        [extractedMessage, service]
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