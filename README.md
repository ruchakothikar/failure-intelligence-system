# Express CRUD API

A simple Node.js + Express REST API demonstrating CRUD operations using in-memory data storage.

## Features
- REST API using Express
- Create, read, update, delete users
- JSON-based responses
- Simple in-memory data store (no database)

## API Endpoints

### Health Check
GET /

### Status
GET /api/status

### Get all users
GET /api/users

### Create user
POST /api/users
Content-Type: application/json

{
  "name": "Sam"
}

### Update user
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Updated Name"
}

### Delete user
DELETE /api/users/:id

## Run Project

npm install  
node index.js

Server runs at:
http://localhost:3000

## Tech Stack
- Node.js
- Express.js