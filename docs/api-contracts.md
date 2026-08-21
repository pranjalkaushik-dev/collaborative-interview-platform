# API and Module Contracts — MVP

## REST API owned by backend

| Area | Initial endpoints | Consumer/owner |
| --- | --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` | Sharat ↔ Pranjal |
| Interviews | `POST /api/interviews`, `GET /api/interviews`, `GET /api/interviews/:id`, `POST /api/interviews/:id/join` | Sharat ↔ Pranjal |
| Questions | `GET /api/interviews/:id/questions` | Sharat ↔ Pranjal/Rishav |
| Coding | `POST /api/coding/run`, `POST /api/coding/submit` | Sharat ↔ Nitesh/Pranjal |
| AI | `POST /api/ai/questions`, `POST /api/ai/feedback` | Sharat ↔ Rishav/Pranjal |
| Monitoring | `POST /api/monitoring/violations` | Sharat ↔ Rishav/Pranjal |
| Results | `GET /api/interviews/:id/results` | Sharat ↔ Pranjal |

## Socket.IO events owned by Nitesh

| Event | Purpose |
| --- | --- |
| `room:join` | participant enters a live interview room |
| `code:change` | editor change is broadcast to room members |
| `code:sync` | server sends current code to a joining participant |
| `room:leave` | participant leaves the room |

Before changing any shared request/response field, update this document and inform the affected owner.
