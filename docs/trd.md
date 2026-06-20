# Technical Requirements Document (TRD)

# Project Name

Bureaucracy Copilot (MVP: Scholarship Copilot)

---

# 1. Technical Overview

Bureaucracy Copilot is an AI-powered scholarship discovery and eligibility platform that helps users find scholarships based on their profile.

The platform combines:

* Structured scholarship database
* Eligibility rules engine
* AI assistant (RAG-based)
* User dashboard
* Deadline tracking system

The AI layer is not the source of truth.

All scholarship information must come from the database.

---

# 2. System Architecture

```text
Client (Next.js)

        ↓

API Gateway (NestJS)

        ↓

Business Layer

├── Auth Module
├── User Module
├── Scholarship Module
├── Eligibility Module
├── AI Module
├── Reminder Module
└── Admin Module

        ↓

PostgreSQL (Supabase)

        ↓

Vector Database
(PgVector)

        ↓

NVIDIA NIM
```

---

# 3. Frontend Architecture

Framework:

* Next.js 15
* TypeScript
* TailwindCSS
* Shadcn UI

State Management:

* Zustand

API Communication:

* Axios

Authentication:

* Supabase Auth

Folder Structure

```text
src/

├── app/
├── components/
├── hooks/
├── services/
├── stores/
├── types/
├── utils/
└── lib/
```

---

# 4. Backend Architecture

Framework:

* NestJS

Pattern:

* Modular Architecture

Modules:

```text
src/

├── auth/
├── users/
├── scholarships/
├── eligibility/
├── ai/
├── reminders/
├── admin/
├── notifications/
└── common/
```

---

# 5. Database Design

## Users

```sql
users
```

Fields:

```text
id UUID PK
name VARCHAR
email VARCHAR UNIQUE
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

## User Profiles

```text
id UUID
user_id UUID

age INTEGER
gender VARCHAR
state VARCHAR
education_level VARCHAR
income DECIMAL
category VARCHAR
disability BOOLEAN

created_at TIMESTAMP
```

---

## Scholarships

```text
id UUID
title VARCHAR
description TEXT
provider VARCHAR

amount DECIMAL

application_url TEXT

deadline DATE

status ENUM

created_at TIMESTAMP
updated_at TIMESTAMP
```

---

## Eligibility Rules

```text
id UUID

scholarship_id UUID

min_income DECIMAL
max_income DECIMAL

state VARCHAR

category VARCHAR

education_level VARCHAR

gender VARCHAR

disability_required BOOLEAN
```

---

## Documents

```text
id UUID

scholarship_id UUID

document_name VARCHAR
mandatory BOOLEAN
```

---

## Saved Scholarships

```text
id UUID

user_id UUID
scholarship_id UUID

saved_at TIMESTAMP
```

---

## Reminders

```text
id UUID

user_id UUID
scholarship_id UUID

notification_type VARCHAR

scheduled_at TIMESTAMP
```

---

# 6. Eligibility Engine

Purpose:

Determine scholarships matching a user profile.

Input:

```json
{
  "state": "Maharashtra",
  "income": 250000,
  "category": "OBC",
  "educationLevel": "Engineering",
  "gender": "Male"
}
```

Processing:

1. Load active scholarships
2. Apply rule filters
3. Calculate eligibility score
4. Sort by score

Output:

```json
{
  "scholarshipId": "123",
  "matchScore": 92,
  "reason": [
    "Income eligible",
    "State eligible",
    "Education eligible"
  ]
}
```

---

# 7. AI Assistant Architecture

Goal:

AI explains scholarship data.

Never generates facts.

Architecture:

```text
User Query

↓

Embedding Search

↓

Relevant Scholarships

↓

Context Builder

↓

NVIDIA NIM

↓

Response
```

---

# 8. Vector Search

Database:

PgVector

Stored Embeddings:

* Scholarship title
* Description
* Eligibility criteria
* Required documents

Embedding Pipeline:

```text
Scholarship Data

↓

Chunking

↓

Embedding Model

↓

PgVector Storage
```

---

# 9. Authentication

Provider:

Supabase Auth

Supported:

* Email Login
* Google Login

JWT-based authentication.

Protected routes:

```text
/dashboard
/profile
/saved
/admin
```

---

# 10. Notification System

Types:

* Deadline Reminder
* New Scholarship
* Closing Soon

Methods:

* Email
* In-App

Queue:

BullMQ

Redis

---

# 11. Admin Panel

Admin Capabilities:

Create Scholarship

Update Scholarship

Delete Scholarship

Manage Deadlines

Manage Eligibility Rules

Manage Documents

Analytics Dashboard

---

# 12. API Endpoints

Authentication

```http
POST /auth/register
POST /auth/login
GET /auth/me
```

Users

```http
GET /users/profile
PATCH /users/profile
```

Scholarships

```http
GET /scholarships
GET /scholarships/:id
POST /scholarships/search
```

Eligibility

```http
POST /eligibility/check
```

Saved

```http
POST /saved
DELETE /saved/:id
GET /saved
```

AI

```http
POST /ai/chat
```

Admin

```http
POST /admin/scholarships
PATCH /admin/scholarships/:id
DELETE /admin/scholarships/:id
```

---

# 13. Security Requirements

Authentication:

* JWT
* Refresh Tokens

Rate Limiting:

* 100 requests/minute

Input Validation:

* Zod
* Class Validator

SQL Protection:

* Prisma ORM

Secrets:

* Environment Variables

---

# 14. Performance Targets

API Response:

< 500ms

Eligibility Engine:

< 300ms

Search:

< 1 second

AI Response:

< 5 seconds

---

# 15. Deployment Architecture

Frontend

Vercel

Backend

Render/Railway

Database

Supabase PostgreSQL

Redis

Upstash Redis

AI

NVIDIA NIM

Monitoring

Sentry

Logs

NestJS Logger
+
Supabase Logs

---

# 16. Future Technical Enhancements

Phase 2

* Government Scheme Support
* OCR Document Reading
* PDF Uploads
* Eligibility Auto Detection

Phase 3

* DigiLocker Integration
* API Setu Integration
* Form Autofill

Phase 4

* Multi-language Support
* Voice Assistant
* WhatsApp Bot
* Mobile App
