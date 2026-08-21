# Database Schema — MVP

Use PostgreSQL (recommended) or MongoDB only if the team deliberately chooses it on Day 2. This relational model is our integration blueprint.

```text
users 1 --- * interviews              (interviewer_id)
users * --- * interviews              (via interview_participants)
interviews 1 --- * questions
interviews 1 --- * submissions
submissions 1 --- * test_case_results
interviews 1 --- * violation_logs
interviews 1 --- * ai_feedback
```

## Tables and minimum fields

| Table | Minimum fields |
| --- | --- |
| users | id, name, email, password_hash, role, created_at |
| interviews | id, title, interviewer_id, scheduled_at, duration_minutes, status, created_at |
| interview_participants | id, interview_id, candidate_id, joined_at |
| questions | id, interview_id, text, type, difficulty, starter_code |
| submissions | id, interview_id, candidate_id, question_id, language, source_code, status, submitted_at |
| test_case_results | id, submission_id, input, expected_output, actual_output, passed |
| violation_logs | id, interview_id, candidate_id, type, occurred_at, metadata |
| ai_feedback | id, interview_id, candidate_id, summary, strengths, improvements, created_at |

`password_hash` stores a hash, never the original password.
