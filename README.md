# Failure Intelligence System

Backend system that ingests application logs, extracts structured failure signals, classifies operational issues, generates human-readable failure summaries, and exposes aggregated failure metrics for analysis.

---

## Problem

Modern distributed applications generate massive volumes of logs, making it difficult for engineers to quickly identify meaningful operational failures. This system reduces log noise by extracting failure-related signals and transforming them into structured, queryable events.

---

## Features

- Log ingestion via REST API  
- Rule-based failure extraction from log batches  
- Failure categorization and severity classification  
- Human-readable failure summaries  
- Structured storage using PostgreSQL  
- Service-level failure aggregation using SQL `GROUP BY` metrics queries  

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

### Get Aggregated Failure Metrics

**Endpoint:** `GET /api/failures/metrics`

Returns aggregated failure counts grouped by service and failure category.

---

## Example Response

```json
{
  "payments": {
    "TIMEOUT": 4,
    "DATABASE": 1
  },
  "auth-service": {
    "AUTH": 2
  }
}
```

---

## Project Structure

```text
index.js           Main server, extraction logic, and API routes
test.http          API test requests
package.json       Dependencies and scripts
package-lock.json  Dependency lock file
.env               Environment variables (not committed)
.gitignore         Git ignore rules
```