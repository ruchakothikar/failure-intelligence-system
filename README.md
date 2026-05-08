# Failure Intelligence System

Backend system that ingests application logs, extracts structured failure signals, classifies operational issues, generates human-readable failure summaries, and exposes aggregated failure metrics for analysis.

## Problem

Modern distributed applications generate large volumes of logs, making it difficult for engineers to quickly identify meaningful operational failures. This system filters log noise by extracting failure-related signals and transforming them into structured, queryable events for easier debugging and analysis.

## Features

- Log ingestion via REST API  
- Rule-based failure extraction from log batches  
- Failure categorization and severity classification  
- Human-readable failure summaries  
- Time-based failure metrics (configurable time windows)  
- Repeated failure detection using threshold-based grouping  
- Structured storage using PostgreSQL  
- Service-level failure aggregation using SQL GROUP BY 

## Tech Stack

- Node.js  
- Express.js  
- PostgreSQL  
- pg (PostgreSQL client)  

## API Overview

### POST /api/failures
Ingest logs and extract failure signals.

Request:
{
  "service": "payments",
  "logs": [
    "INFO Request started",
    "ERROR Timeout after 30s"
  ]
}

---

### GET /api/failures/metrics?hours=24
Returns failure counts grouped by service and category.

---

### GET /api/failures/repeated?hours=24
Returns failures that occur repeatedly within a time window.

---

## Project Structure

index.js        Main server + API routes  
test.http       API tests  
package.json    Dependencies  
.env            Environment variables (not committed)  
.gitignore      Git ignore rules  