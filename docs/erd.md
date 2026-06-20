# Entity Relationship Diagram (ERD)

# Bureaucracy Copilot (MVP: Scholarship Copilot)

---

# High-Level ERD

```text
┌──────────────┐
│    USERS     │
└──────┬───────┘
       │ 1
       │
       │ N
┌──────▼────────┐
│ USER_PROFILE  │
└───────────────┘

       │
       │
       ▼

┌───────────────┐
│ SAVED_SCHOLAR │
└──────┬────────┘
       │
       │
       ▼

┌───────────────┐
│ SCHOLARSHIPS  │
└──────┬────────┘
       │
 ┌─────┼─────┐
 │     │     │
 ▼     ▼     ▼

ELIGIBILITY_RULES
DOCUMENTS
APPLICATIONS

       │
       ▼

REMINDERS

```

---

# Complete ERD

```text
USERS
│
├── USER_PROFILE
│
├── SAVED_SCHOLARSHIPS
│
├── APPLICATIONS
│
└── NOTIFICATIONS


SCHOLARSHIPS
│
├── ELIGIBILITY_RULES
│
├── REQUIRED_DOCUMENTS
│
├── APPLICATIONS
│
├── SAVED_SCHOLARSHIPS
│
└── REMINDERS


ADMIN_USERS
│
└── SCHOLARSHIPS
```

---

# Table Definitions

---

## USERS

```sql
users
```

| Field         | Type           |
| ------------- | -------------- |
| id            | UUID PK        |
| name          | VARCHAR        |
| email         | VARCHAR UNIQUE |
| password_hash | TEXT           |
| role          | ENUM           |
| created_at    | TIMESTAMP      |
| updated_at    | TIMESTAMP      |

Relationship:

```text
USER
  │
  └── 1:1 USER_PROFILE

USER
  │
  └── 1:N SAVED_SCHOLARSHIPS

USER
  │
  └── 1:N APPLICATIONS

USER
  │
  └── 1:N NOTIFICATIONS
```

---

## USER_PROFILE

```sql
user_profiles
```

| Field            | Type      |
| ---------------- | --------- |
| id               | UUID PK   |
| user_id          | UUID FK   |
| age              | INTEGER   |
| gender           | VARCHAR   |
| state            | VARCHAR   |
| education_level  | VARCHAR   |
| institution_type | VARCHAR   |
| annual_income    | DECIMAL   |
| category         | VARCHAR   |
| disability       | BOOLEAN   |
| created_at       | TIMESTAMP |

Relationship:

```text
USER_PROFILE
      │
      └── BELONGS TO USER
```

---

## SCHOLARSHIPS

```sql
scholarships
```

| Field           | Type      |
| --------------- | --------- |
| id              | UUID PK   |
| title           | VARCHAR   |
| description     | TEXT      |
| provider        | VARCHAR   |
| amount          | DECIMAL   |
| application_url | TEXT      |
| deadline        | DATE      |
| status          | ENUM      |
| created_at      | TIMESTAMP |
| updated_at      | TIMESTAMP |

Relationship:

```text
SCHOLARSHIP
    │
    ├── 1:N ELIGIBILITY_RULES

    ├── 1:N DOCUMENTS

    ├── 1:N APPLICATIONS

    ├── 1:N SAVED_SCHOLARSHIPS

    └── 1:N REMINDERS
```

---

## ELIGIBILITY_RULES

```sql
eligibility_rules
```

| Field          | Type      |
| -------------- | --------- |
| id             | UUID PK   |
| scholarship_id | UUID FK   |
| rule_json      | JSONB     |
| created_at     | TIMESTAMP |

Example:

```json
{
  "income": {
    "max": 800000
  },
  "state": [
    "Maharashtra"
  ],
  "category": [
    "OBC"
  ],
  "education": [
    "Engineering"
  ]
}
```

Relationship:

```text
SCHOLARSHIP
    │
    └── MANY RULES
```

---

## REQUIRED_DOCUMENTS

```sql
required_documents
```

| Field          | Type    |
| -------------- | ------- |
| id             | UUID PK |
| scholarship_id | UUID FK |
| document_name  | VARCHAR |
| mandatory      | BOOLEAN |

Examples:

```text
Income Certificate

Aadhaar Card

Marksheet

Bank Passbook
```

Relationship:

```text
SCHOLARSHIP
      │
      └── MANY DOCUMENTS
```

---

## SAVED_SCHOLARSHIPS

Join Table

```sql
saved_scholarships
```

| Field          | Type      |
| -------------- | --------- |
| id             | UUID PK   |
| user_id        | UUID FK   |
| scholarship_id | UUID FK   |
| saved_at       | TIMESTAMP |

Relationship:

```text
USER
   │
   └── M:N SCHOLARSHIPS
```

---

## APPLICATIONS

Tracks user progress.

```sql
applications
```

| Field          | Type      |
| -------------- | --------- |
| id             | UUID PK   |
| user_id        | UUID FK   |
| scholarship_id | UUID FK   |
| status         | ENUM      |
| notes          | TEXT      |
| applied_at     | TIMESTAMP |

Status Values:

```text
INTERESTED

PREPARING_DOCUMENTS

APPLIED

UNDER_REVIEW

APPROVED

REJECTED
```

Relationship:

```text
USER
   │
   └── M:N SCHOLARSHIPS
```

---

## REMINDERS

```sql
reminders
```

| Field          | Type      |
| -------------- | --------- |
| id             | UUID PK   |
| user_id        | UUID FK   |
| scholarship_id | UUID FK   |
| reminder_type  | VARCHAR   |
| scheduled_at   | TIMESTAMP |
| sent           | BOOLEAN   |

Examples:

```text
30_DAY

14_DAY

7_DAY

1_DAY
```

---

## NOTIFICATIONS

```sql
notifications
```

| Field      | Type      |
| ---------- | --------- |
| id         | UUID PK   |
| user_id    | UUID FK   |
| title      | VARCHAR   |
| message    | TEXT      |
| read       | BOOLEAN   |
| created_at | TIMESTAMP |

Relationship:

```text
USER
   │
   └── MANY NOTIFICATIONS
```

---

## ADMIN_USERS

```sql
admin_users
```

| Field      | Type      |
| ---------- | --------- |
| id         | UUID PK   |
| email      | VARCHAR   |
| role       | VARCHAR   |
| created_at | TIMESTAMP |

Relationship:

```text
ADMIN

  │

  └── MANAGES SCHOLARSHIPS
```

---

# Recommended Production ERD

```text
USERS
 │
 ├── USER_PROFILE
 │
 ├── SAVED_SCHOLARSHIPS
 │
 ├── APPLICATIONS
 │
 └── NOTIFICATIONS

SCHOLARSHIPS
 │
 ├── ELIGIBILITY_RULES (JSONB)
 │
 ├── REQUIRED_DOCUMENTS
 │
 ├── APPLICATIONS
 │
 ├── SAVED_SCHOLARSHIPS
 │
 ├── REMINDERS
 │
 └── SCHOLARSHIP_EMBEDDINGS

AI
 │
 └── SCHOLARSHIP_EMBEDDINGS
```

---

# Additional Table for AI (Recommended)

## SCHOLARSHIP_EMBEDDINGS

```sql
scholarship_embeddings
```

| Field          | Type      |
| -------------- | --------- |
| id             | UUID PK   |
| scholarship_id | UUID FK   |
| chunk_text     | TEXT      |
| embedding      | VECTOR    |
| created_at     | TIMESTAMP |

Purpose:

* RAG Search
* Semantic Search
* AI Context Retrieval

This table will be used by NVIDIA NIM + pgvector to provide accurate answers from scholarship data.
