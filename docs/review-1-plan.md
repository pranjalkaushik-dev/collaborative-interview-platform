# Review 1 Target — 16–18 September 2026

## Review 1 definition of done

We will demonstrate one **working end-to-end MVP slice**, not every advanced feature:

1. Register/login as interviewer or candidate.
2. Interviewer creates a scheduled coding interview.
3. Candidate can open/join the interview room.
4. Room shows one coding question and a usable code editor.
5. Candidate can save code; a basic browser tab-switch event is logged.
6. AI question/feedback is shown through a mock or working API response.
7. Data is saved in MongoDB and can be shown through the dashboard/results view.

Out of scope for Review 1: real multi-user Socket.IO syncing, secure multi-language code execution, advanced proctoring, dual-camera analysis, and production deployment.

## Team targets

| Owner | Must finish by Review 1 | Explicitly not required yet |
| --- | --- | --- |
| Pranjal | Express API, MongoDB Atlas connection, User + Interview Mongoose models, register/login, create/list/get interview APIs, basic authorization, API documentation | Full deployment, every collection/model, production security |
| Sharat | React/Vite setup, login/register screens, interviewer dashboard, create-interview form, candidate interview-room screen, API integration for auth/interviews | Final design polish, complete results dashboard |
| Nitesh | Editor renders in interview room, language selector, code input/save API integration or local fallback, one sample coding question/test-case UI | Socket.IO collaboration, real execution sandbox, complete test runner |
| Rishav | One AI question or feedback response (mock first, real integration if ready), tab-hidden/fullscreen-exit monitoring event sent to API, basic violation indicator | Dual camera, webcam recording, advanced proctoring model |

## Dates and checkpoints

| Date | Checkpoint | Evidence required |
| --- | --- | --- |
| 4–6 Sep | Every member runs their local project/branch; backend and frontend foundations exist | Screenshot or short screen recording + latest branch push |
| 7–10 Sep | Auth flow and create-interview flow work against MongoDB | Interviewer can register, login, and create an interview |
| 11–13 Sep | Interview room vertical slice is integrated | Candidate joins room, sees question/editor, and saves code |
| 14 Sep | AI/mock feedback and monitoring log connected | Tab switch event and AI result visible in UI or API response |
| 15 Sep | Freeze new features; fix bugs, seed demo data, rehearse | One full demo run from login to interview room |
| 16–18 Sep | Review 1 | Running demo + architecture/schema explanation |

## Daily team rule

Work locally on your own branch. Before reporting progress, run the feature yourself. Push each working milestone with a clear commit message; do not wait until the whole module ends.

## Review 1 demo flow

```text
Register/Login → Interviewer Dashboard → Create Interview
→ Candidate joins room → Coding question + editor
→ Save code + tab-switch violation → AI feedback/mock result
```

## What each person must report on 6, 10, and 14 September

- What runs locally?
- What branch/commit contains it?
- Screenshot or 30–60 second screen recording.
- What dependency/blocker needs help?
