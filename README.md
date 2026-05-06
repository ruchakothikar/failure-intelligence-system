# Express CRUD API

A Node.js + Express REST API implementing CRUD operations with a modular MVC-style structure.

## Features
- Create, read, update, delete users
- Organized with routes and controllers (MVC-style)
- JSON-based API
- Easily testable via REST Client

## API

### Get all users
GET /api/users

### Create user
POST /api/users

{
  "name": "Sam"
}

### Update user
PUT /api/users/:id

{
  "name": "Updated Name"
}

### Delete user
DELETE /api/users/:id

## Run Locally

npm install  
node index.js  

Server runs at:  
http://localhost:3000

## Project Structure

routes/ → API endpoints  
controllers/ → business logic  
index.js → app setup  

## Author
Rucha Kothikar