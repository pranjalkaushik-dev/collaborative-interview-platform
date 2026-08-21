# Architecture — Day 1

## Simple picture

```text
React client (Sharat)
        |
        | HTTPS API + Socket.IO
        v
Node/Express server (Pranjal)
   |       |        |       |
 Database  Coding    AI   Monitoring
 (Pranjal) (Nitesh) (Rishav) (Rishav)
```

## Rules

- The client never reads the database directly; it calls backend APIs.
- The backend owns authentication, authorization, validation, and database writes.
- Coding, AI, and monitoring remain separate backend modules so their owners can work independently.
- Socket.IO is only for live room/collaboration events; normal data uses REST APIs.
- Never commit passwords, API keys, or `.env` files.

## MVP boundaries

In scope: candidate/interviewer roles, a scheduled interview room, shared editor, basic test cases, AI text feedback, and browser-event logging.

Out of scope for MVP: production-grade cheating detection, secure sandbox infrastructure, payment, email/SMS, advanced analytics, and fully automated hiring decisions.
