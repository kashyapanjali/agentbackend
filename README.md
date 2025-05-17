# Agent Management System Backend

A MERN stack application for managing agents and distributing lists among them.

## Features

1. Admin User Login
2. Agent Creation & Management
3. Uploading and Distributing Lists

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd agent-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/agentDB
JWT_SECRET=your_jwt_secret_key_here
```

4. Create the uploads directory:
```bash
mkdir uploads
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - Admin login

### Agents
- POST `/api/agents` - Create new agent
- GET `/api/agents` - Get all agents
- PUT `/api/agents/:id` - Update agent
- DELETE `/api/agents/:id` - Delete agent

### Lists
- POST `/api/lists/upload` - Upload and distribute CSV file
- GET `/api/lists/agent/:agentId` - Get lists by agent
- PUT `/api/lists/:id/status` - Update list status

## File Upload Format

The system accepts CSV files with the following columns:
- FirstName
- Phone
- Notes

## Security

- All routes except login are protected with JWT authentication
- Passwords are hashed using bcrypt
- File uploads are validated for type and size

## Error Handling

The API includes comprehensive error handling for:
- Invalid credentials
- Missing required fields
- File upload errors
- Database errors
- Authentication errors 