# Failure Intelligence System

Backend system that ingests application logs, extracts failure signals, and stores structured failure events for analysis and pattern detection.

---

## Problem

Modern applications generate large volumes of logs, making it difficult to quickly identify meaningful failures. This system reduces log noise by extracting only failure-related signals and storing structured failure events for downstream analysis.

---

## Features

- Log ingestion via REST API  
- Rule-based failure extraction from log batches  
- Structured storage of extracted failure events in PostgreSQL  
- Separation between request handling, extraction logic, and database storage  

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

index.js        Main server + API routes  
test.http       API test requests  
package.json    Dependencies and scripts  
package-lock.json Dependency lock file  
.env            Environment variables (not committed)  
.gitignore      Git ignore rules  