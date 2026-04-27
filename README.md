# ResolvIt - Hostel Complaint Management System

**Team Members:**
- Abhishek Jaiswal
- Priyanshu Kumar

## Overview
ResolvIt is a robust, full-stack, role-based Hostel Complaint Management System designed to intelligently route and track maintenance issues. It features a custom, pure Vanilla CSS dark-mode glassmorphism architecture.

## Technology Stack
- **Frontend:** Next.js, React, Pure Vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** SQLite (Normalized 3NF/BCNF Schema)

## Local Setup Instructions

### 1. Database Initialization
Ensure you have Node.js installed. Navigate to the backend directory and run the initialization script to structurally generate the SQLite database and seed the demo data:
```bash
cd backend
npm install
node setup-db.js
```

### 2. Start the Backend Server
From the `backend` directory, start the server:
```bash
npm start
```
*The backend REST API will run actively on `http://localhost:5000`*

### 3. Start the Frontend Application
Open a new terminal session, navigate to the frontend directory, install the required packages, and launch the dev server:
```bash
cd frontend
npm install
npm run dev
```
*The User Interface will run actively on `http://localhost:3001`*

## Demo Credentials
All preset demo accounts default to the password: `password123`
- **Warden / Admin:** `admin1@college.edu`
- **Student:** `student1@college.edu`
- **Maintenance Staff:** `staff1@college.edu`
