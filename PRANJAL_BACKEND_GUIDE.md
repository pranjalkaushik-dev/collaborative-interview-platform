# Pranjal's Personal Backend & Review 1 Survival Guide 🚀
**Project:** Collaborative Coding & AI-Assisted Technical Interview Platform  
**Owner:** Pranjal Kaushik (Team Lead) — Batch B-2  
**Target:** Project Review 1 (16–18 Sept 2026)  

---

## 1. What Has Been Built For You (Your Review 1 Deliverables)

As the Team Lead owning **Backend Architecture, Database, Authentication & Interview Rooms**, your entire backend system is now built and ready in `server/`:

### 📁 Directory Structure Created:
```text
collaborative-interview-platform/server/
├── package.json               # Backend dependencies (express, mongoose, bcrypt, jwt, socket.io)
├── .env                       # Environment variables (PORT=5000, MONGODB_URI, JWT_SECRET)
└── src/
    ├── index.js               # Express + Socket.IO server initialization
    ├── config/
    │   └── db.js              # MongoDB Atlas / Mongoose connection handler
    ├── shared/
    │   ├── middlewares/
    │   │   ├── auth.middleware.js   # JWT Bearer token authentication
    │   │   ├── role.middleware.js   # Role-based authorization (INTERVIEWER vs CANDIDATE)
    │   │   └── error.middleware.js  # Global error handler
    │   └── utils/
    │       ├── jwt.utils.js         # Token generation & verification helper
    │       └── response.utils.js    # Standardized JSON response formatting
    └── modules/
        ├── auth/
        │   ├── auth.model.js        # User Mongoose Schema (fullName, email, passwordHash, accountRole)
        │   ├── auth.controller.js   # Register, Login & Profile handlers
        │   └── auth.routes.js       # /api/auth endpoints
        └── interviews/
            ├── interview.model.js   # Interview Room Mongoose Schema (roomCode, participants, settings)
            ├── interview.controller.js # Create Room, Get Rooms, Join by Room Code
            └── interview.routes.js  # /api/interviews endpoints
```

---

## 2. How To Run & Test Your Backend (Step-by-Step)

### Step 1: Install Dependencies
Open your terminal inside the `server/` directory:
```bash
cd collaborative-interview-platform/server
npm install
```

### Step 2: Start MongoDB & Server
To start the backend in development mode (with auto-reload):
```bash
npm run dev
```
You will see this output:
```text
=======================================================
🚀 Collaborative Interview Platform Backend Server Live
📡 Listening on Port: http://localhost:5000
🔗 Health Check: http://localhost:5000/api/health
=======================================================
[Database] MongoDB Connected Successfully: 127.0.0.1
```

---

## 3. Postman / API Testing Cheat Sheet (For Live Demo)

During Review 1, your guide/evaluator will ask to see your backend APIs. Use these exact Postman requests:

### 🔹 1. Health Check
* **Method:** `GET`
* **URL:** `http://localhost:5000/api/health`

### 🔹 2. Register Interviewer (Pranjal)
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/auth/register`
* **Body (JSON):**
  ```json
  {
    "fullName": "Pranjal Kaushik",
    "email": "pranjal@nie.ac.in",
    "password": "Password123",
    "accountRole": "INTERVIEWER"
  }
  ```

### 🔹 3. Login & Get JWT Token
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/auth/login`
* **Body (JSON):**
  ```json
  {
    "email": "pranjal@nie.ac.in",
    "password": "Password123"
  }
  ```
  *(Copy the `token` from response for next steps)*

### 🔹 4. Create Interview Room (Interviewer)
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/interviews`
* **Headers:** `Authorization: Bearer <your_jwt_token>`
* **Body (JSON):**
  ```json
  {
    "title": "Frontend React Senior Developer Interview",
    "description": "Technical coding round for React & Data Structures",
    "interviewType": "CODING",
    "durationMinutes": 60
  }
  ```
  *(Generates unique 6-char `roomCode` e.g., `INT-8A9F`)*

### 🔹 5. Join Room as Candidate
* **Method:** `POST`
* **URL:** `http://localhost:5000/api/interviews/join`
* **Headers:** `Authorization: Bearer <candidate_jwt_token>`
* **Body (JSON):**
  ```json
  {
    "roomCode": "INT-8A9F"
  }
  ```

---

## 4. Exactly What To Speak In Review 1 (Presentation Pitch 🗣️)

When the evaluator/guide asks: **"Pranjal, what is your role and what have you completed for Review 1?"**

Say this confidently:

> *"Good morning Ma'am/Sir. As the Team Lead, I am responsible for overall System Architecture, Database Design, Server Infrastructure, Authentication, and Interview Room Management.*
> 
> *For Review 1, I have successfully implemented:*
> 1. *A decoupled Node.js and Express RESTful API server with Socket.IO real-time event Gateway.*
> 2. *MongoDB Atlas integration with strict Mongoose Schemas for Users, Interview Sessions, Questions, and Violation Logs.*
> 3. *Role-Based JWT Authentication separating Candidate and Interviewer privileges with salted bcrypt password hashing.*
> 4. *Session & Room Management API allowing Interviewers to generate unique 6-character room codes (`INT-XXXX`) and candidates to securely join live sessions.*
> 5. *Standardized Middleware architecture for token validation, role authorization, and centralized error handling."*

---

## 5. Next Steps For Your Teammates

- **Rishav:** Give him `rishav_integration_contracts.md`. He will write `server/src/modules/ai/` and `server/src/modules/monitoring/`.
- **Nitesh:** He will connect his Monaco Editor to your `index.js` Socket.IO server (`code-change` events).
- **Sharat:** He will build the React Frontend pages calling your `/api/auth` and `/api/interviews` endpoints.
