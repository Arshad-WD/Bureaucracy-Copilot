# Software Design Document (SDD)

# Project

Bureaucracy Copilot (MVP: Scholarship Copilot)

Version: 1.0

---

# 1. Introduction

## Purpose

This Software Design Document defines the architecture, system components, database design, APIs, security model, and implementation details for Bureaucracy Copilot.

The system helps users discover scholarships they may qualify for based on personal and academic information.

The platform consists of:

* Frontend Application
* Backend API
* Eligibility Engine
* Scholarship Search Engine
* AI Assistant
* Notification Service
* Admin Portal

---

# 2. High-Level Architecture

```text
┌────────────────────┐
│     Frontend       │
│     Next.js        │
└──────────┬─────────┘
           │
           ▼
┌────────────────────┐
│    NestJS API      │
│    Backend Layer   │
└──────────┬─────────┘
           │
 ┌─────────┼─────────┐
 ▼         ▼         ▼

PostgreSQL PgVector Redis

(Supabase)

           │
           ▼
    NVIDIA NIM
```

---

# 3. Architectural Style

Pattern:

### Layered Architecture

```text
Presentation Layer

↓

Application Layer

↓

Business Logic Layer

↓

Persistence Layer

↓

Infrastructure Layer
```

Benefits:

* Maintainability
* Scalability
* Separation of concerns
* Easier testing

---

# 4. Frontend Design

## Technology

* Next.js
* TypeScript
* TailwindCSS
* Zustand
* React Query

---

## Pages

### Public

```text
/
 /login
 /register
 /scholarships
 /scholarships/[id]
```

### Protected

```text
/dashboard
/profile
/saved
/applications
/notifications
```

### Admin

```text
/admin
/admin/scholarships
/admin/users
/admin/settings
```

---

## Component Structure

```text
components/

├── layout/
├── navigation/
├── scholarship/
├── dashboard/
├── forms/
├── ai/
├── profile/
└── notifications/
```

---

# 5. Backend Design

## Technology

* NestJS
* TypeScript
* Prisma ORM

---

## Modules

### Auth Module

Responsibilities:

* Login
* Registration
* JWT
* Google Authentication

Files:

```text
auth/

auth.controller.ts
auth.service.ts
auth.module.ts
jwt.strategy.ts
```

---

### User Module

Responsibilities:

* User profile management
* Preferences
* Saved scholarships

---

### Scholarship Module

Responsibilities:

* Scholarship CRUD
* Search
* Filters
* Scholarship details

---

### Eligibility Module

Responsibilities:

* Rule processing
* Matching
* Score calculation

---

### AI Module

Responsibilities:

* Context retrieval
* Vector search
* AI responses

---

### Reminder Module

Responsibilities:

* Email reminders
* Deadline alerts
* Notification scheduling

---

### Admin Module

Responsibilities:

* Scholarship management
* Analytics
* User management

---

# 6. Database Design

## Entity Relationship Diagram

```text
User
 │
 ├──── Profile
 │
 ├──── SavedScholarships
 │
 └──── Applications

Scholarship
 │
 ├──── EligibilityRules
 │
 ├──── Documents
 │
 └──── Applications
```

---

## User

```sql
CREATE TABLE users (
 id UUID PRIMARY KEY,
 name VARCHAR(255),
 email VARCHAR(255) UNIQUE,
 password_hash TEXT,
 role VARCHAR(20),
 created_at TIMESTAMP,
 updated_at TIMESTAMP
);
```

---

## Profile

```sql
CREATE TABLE profiles (
 id UUID PRIMARY KEY,
 user_id UUID,
 age INTEGER,
 gender VARCHAR(50),
 state VARCHAR(100),
 income DECIMAL,
 category VARCHAR(50),
 disability BOOLEAN
);
```

---

## Scholarship

```sql
CREATE TABLE scholarships (
 id UUID PRIMARY KEY,
 title VARCHAR(255),
 description TEXT,
 provider VARCHAR(255),
 amount DECIMAL,
 application_url TEXT,
 deadline DATE,
 status VARCHAR(20),
 created_at TIMESTAMP
);
```

---

## Eligibility Rule

```sql
CREATE TABLE eligibility_rules (
 id UUID PRIMARY KEY,
 scholarship_id UUID,

 min_income DECIMAL,
 max_income DECIMAL,

 state VARCHAR(100),

 category VARCHAR(100),

 education_level VARCHAR(100),

 disability_required BOOLEAN
);
```

---

# 7. Eligibility Engine Design

## Goal

Determine scholarships matching user profile.

---

## Workflow

```text
User Profile

↓

Load Active Scholarships

↓

Apply Rules

↓

Calculate Score

↓

Sort Results

↓

Return Matches
```

---

## Match Scoring

Weights:

```text
Income Match         25%

Education Match      30%

State Match          20%

Category Match       15%

Disability Match     10%
```

Maximum Score:

100

---

## Example

```text
User

Income: 2 Lakh

State: Maharashtra

Category: OBC

Education: Engineering
```

Result:

```text
Scholarship A

Score: 92%

Reason:

✓ Income Eligible

✓ State Eligible

✓ Education Eligible

✓ Category Eligible
```

---

# 8. Search System Design

## Search Types

### Keyword Search

Example:

```text
Engineering Scholarship
```

---

### Filter Search

Filters:

* State
* Income
* Category
* Education
* Provider

---

## Query Flow

```text
Search Request

↓

Database Query

↓

Pagination

↓

Response
```

---

# 9. AI Assistant Design

## Objective

Provide explanations only.

AI is NOT the source of truth.

---

## Retrieval Pipeline

```text
Question

↓

Embedding Search

↓

Relevant Records

↓

Prompt Builder

↓

NVIDIA NIM

↓

Response
```

---

## Context Window

Includes:

* Scholarship Description
* Eligibility Rules
* Documents
* Deadlines

---

## Prompt Template

```text
You are Bureaucracy Copilot.

Answer only using provided scholarship data.

Never invent information.

Never guarantee eligibility.

Never provide legal advice.
```

---

# 10. Notification System

## Notification Types

### Deadline Alert

### New Scholarship Match

### Application Update

---

## Queue Architecture

```text
Scheduler

↓

BullMQ

↓

Redis

↓

Worker

↓

Email Service
```

---

# 11. Security Design

Authentication:

* JWT Access Token
* Refresh Token

Authorization:

```text
USER

ADMIN
```

---

## Password Storage

Algorithm:

```text
Argon2
```

---

## API Protection

* Rate Limiting
* Input Validation
* Sanitization
* CORS

---

# 12. Error Handling

Global Exception Filter

```text
400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

500 Internal Server Error
```

---

# 13. Logging Design

Levels:

```text
INFO

WARN

ERROR

DEBUG
```

Stored:

* API Logs
* Auth Logs
* Admin Actions

---

# 14. Deployment Design

## Frontend

Platform:

Vercel

Build:

```bash
npm run build
```

---

## Backend

Platform:

Render

Build:

```bash
npm run build
```

Run:

```bash
npm run start:prod
```

---

## Database

Supabase PostgreSQL

---

## Redis

Upstash Redis

---

## AI

NVIDIA NIM Endpoint

---

# 15. Monitoring

Tools:

* Sentry
* Supabase Logs
* Render Metrics

Metrics:

* API Latency
* Error Rate
* Search Response Time
* AI Response Time

---

# 16. Scalability Plan

Phase 1

```text
Single Backend Instance
```

Phase 2

```text
Load Balancer

↓

Multiple API Servers
```

Phase 3

```text
Microservices

Eligibility Service

AI Service

Notification Service
```

---

# 17. Future Design Extensions

Version 2

* OCR Document Verification
* Scholarship Recommendation Engine
* Regional Languages

Version 3

* DigiLocker Integration
* API Setu Integration
* Auto Form Filling

Version 4

* Government Schemes
* Subsidies
* Citizen Service Copilot

```
```
