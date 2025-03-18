# User Management CRUD Application

A simple CRUD (Create, Read, Update, Delete) application for managing users, built with Node.js and Express.

## Features

- Create new users
- View all users
- Update existing users
- Delete users
- Simple and responsive UI

## Prerequisites

- Node.js (v12.0.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

Start the server:
```
node index.js
```

The application will be available at http://localhost:3000.

## API Endpoints

- **GET /api/users** - Get all users
- **GET /api/users/:id** - Get a specific user by ID
- **POST /api/users** - Create a new user
- **PUT /api/users/:id** - Update a user
- **DELETE /api/users/:id** - Delete a user

## User Data Structure

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z"
}
```

## Technologies Used

- Node.js
- Express.js
- HTML/CSS/JavaScript (Frontend) 