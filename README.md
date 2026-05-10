# Failure Intelligence System

Backend log intelligence system that converts application logs into structured failure events for classification, time-based metrics, and operational monitoring via REST APIs and a lightweight dashboard.


---

## 🔗 Live Demo

Access the deployed application here:  
https://2ef7883a-f88d-427f-9329-de287f341e53-00-278t7a6zwjpso.riker.replit.dev/


---


## Problem

Modern distributed systems generate high-volume logs that are difficult to interpret manually. This system reduces log noise by transforming raw logs into structured, queryable failure data for faster debugging and operational visibility.

---

## Architecture

Logs → Ingestion → Failure Extraction → PostgreSQL → Metrics & Analytics → Dashboard

---

## Key Features

- Log ingestion via REST API
- Rule-based failure detection and classification
- Time-windowed metrics for operational analysis
- Repeated failure detection using threshold-based grouping
- Service-level aggregation using SQL (PostgreSQL)
- Human-readable failure summaries
- Lightweight dashboard for visual monitoring

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- HTML/CSS (dashboard UI)

---

## API Reference

### Ingest Logs
`POST /api/failures`

```json
{
  "service": "payments",
  "logs": [
    "INFO Request started",
    "ERROR Timeout after 30s"
  ]
}
```

---

### Failure Metrics
`GET /api/failures/metrics?hours=24`

Returns aggregated failure counts grouped by service and category over a time window.

---

### Repeated Failures
`GET /api/failures/repeated?hours=24`

Returns failures that exceed repetition thresholds within a time window.

---

## Run Locally

```bash
npm install
node index.js
```

Requires PostgreSQL connection configured in environment variables.

---

## Project Structure

```
index.js        Express server + API routes
index.html      Dashboard UI
test.http       API testing requests
package.json    Dependencies
```

---