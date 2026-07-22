# Event Management Portal — Backend

A simple REST API built with Node.js and Express.js for managing events.  
This is a college mini project — no database is used. All data is stored in-memory.

## Tech Stack

- Node.js
- Express.js
- In-memory data storage (JavaScript arrays)

## Getting Started

```bash
npm install
npm start
```

Server runs on **http://localhost:5000**

## Sample Credentials

| Role  | Email              | Password |
|-------|--------------------|----------|
| Admin | admin@gmail.com    | admin123 |
| User  | john@example.com   | john123  |

## API Endpoints

### Auth
| Method | Endpoint            | Description       | Auth Required |
|--------|---------------------|-------------------|---------------|
| POST   | /api/auth/register  | Register new user | No            |
| POST   | /api/auth/login     | Login             | No            |
| GET    | /api/auth/profile   | Get profile       | Yes           |
| PUT    | /api/auth/profile   | Update profile    | Yes           |

### Events
| Method | Endpoint           | Description        | Auth Required |
|--------|--------------------|--------------------|---------------|
| GET    | /api/events        | List all events    | No            |
| GET    | /api/events/:id    | Get event details  | No            |
| POST   | /api/events        | Create event       | Yes           |
| PUT    | /api/events/:id    | Update event       | Yes           |
| DELETE | /api/events/:id    | Delete event       | Yes           |

> **Note:** Data resets when the server restarts since everything is stored in memory.
