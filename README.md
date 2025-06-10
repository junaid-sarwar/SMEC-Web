## Overview
This is a REST API for an event pass management system. It allows for management of users, passes, user-pass registrations, and events associated with passes.

## Features
- User registration and management
- Pass creation and management
- Event creation and management
- User-pass registration
- Admin authentication and authorization

## Tech Stack
- Node.js with Express
- SQL Server (MSSQL)
- Raw SQL queries (no ORM)
- bcrypt for password hashing
- JWT for authentication

## API Endpoints

### Users
- `POST /users` - Register a new user
- `GET /users/:id` - Get user details by ID
- `GET /users/:id/passes` - Get all passes registered by a user

### Passes
- `POST /passes` - Create a new pass (admin only)
- `GET /passes/:id` - Get pass details by ID
- `GET /passes/:id/events` - Get all events related to a pass

### User Passes
- `POST /user-passes` - Register a user to a pass

### Events
- `POST /events` - Create a new event (admin only)
- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID

### Admins
- `POST /admins` - Register a new admin (admin only)
- `POST /admin-login` - Admin login

## Setup Instructions

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/event-pass-api.git
   cd event-pass-api
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory based on the provided `.env.example`
   - Fill in your SQL Server details and JWT secret

4. **Set up the database**
   - Run the SQL script provided in `setup-database.sql` to create tables and initial data
   - You can use SQL Server Management Studio or the command line

5. **Start the server**
   - For development: `npm run dev`
   - For production: `npm start`

## Default Admin Credentials
- Email: admin@example.com
- Password: admin123

## Authentication
Most endpoints require authentication. You need to:
1. Login as admin using `/admin-login`
2. Use the returned JWT token in the Authorization header for subsequent requests:
   ```
   Authorization: Bearer your_token_here
   ```

## License
MIT