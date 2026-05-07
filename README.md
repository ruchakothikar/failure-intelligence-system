# Failure Intelligence System

Backend system that ingests application logs, extracts failure signals, and stores structured failure events for analysis and pattern detection.

---

## Problem

Modern applications generate large volumes of logs, making it difficult to quickly identify meaningful failures. This system reduces log noise by extracting only failure-related signals and storing structured events for downstream analysis.

---

## Features

- Log ingestion via REST API  
- Rule-based failure extraction from log batches  
- Structured storage using PostgreSQL  
- Separation of ingestion, processing, and persistence layers  

---

## Tech Stack

- Node.js  
- Express.js  
- PostgreSQL  
- pg (Node.js PostgreSQL client)  

---

## API Reference

### Ingest Failure Logs

**Endpoint:** `POST /api/failures`

**Request Body Example:**

```json
{
  "service": "payments",
  "logs": [
    "INFO Request started",
    "INFO Calling API",
    "ERROR Timeout after 30s"
  ]
}
```

---

## Project Structure

```
index.js        Main server + API routes  
db              PostgreSQL connection (pg Pool)  
test.http       API test requests  
package.json    Dependencies and scripts  
```