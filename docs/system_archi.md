# System Architecture Diagram

# Project

Bureaucracy Copilot (MVP: Scholarship Copilot)

Version 1.0

---

# High-Level System Architecture

```text
┌───────────────────────────────────────┐
│               USERS                   │
│                                       │
│ Students • Parents • NGOs • Teachers  │
└───────────────────┬───────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│            NEXT.JS FRONTEND           │
│                                       │
│ Landing Page                          │
│ Dashboard                             │
│ Scholarship Search                    │
│ Eligibility Checker                   │
│ AI Assistant                          │
│ Admin Portal                          │
└───────────────────┬───────────────────┘
                    │ HTTPS
                    ▼
┌───────────────────────────────────────┐
│           API GATEWAY (NestJS)        │
└───────────────────┬───────────────────┘
                    │
    ┌───────────────┼────────────────┐
    │               │                │
    ▼               ▼                ▼

┌───────────┐ ┌────────────┐ ┌────────────┐
│ Auth      │ │ User       │ │ Scholarship│
│ Module    │ │ Module     │ │ Module     │
└───────────┘ └────────────┘ └────────────┘

    ▼               ▼                ▼

┌───────────┐ ┌────────────┐ ┌────────────┐
│ Eligibility│ │ AI Module │ │ Notification│
│ Engine     │ │            │ │ Module      │
└───────────┘ └────────────┘ └────────────┘

                    │
                    ▼

┌───────────────────────────────────────┐
│         PostgreSQL (Supabase)         │
└───────────────────┬───────────────────┘
                    │
      ┌─────────────┼──────────────┐
      │             │              │
      ▼             ▼              ▼

Users      Scholarships      Applications

                    │
                    ▼

          Scholarship Embeddings

                    │
                    ▼

              PGVECTOR

                    │
                    ▼

             NVIDIA NIM
```

---

# Production Architecture

```text
Internet Users
       │
       ▼

┌──────────────────────────┐
│      Vercel CDN          │
│      Next.js App         │
└───────────┬──────────────┘
            │
            ▼

┌──────────────────────────┐
│     NestJS Backend       │
│      Render/Railway      │
└───────────┬──────────────┘
            │
            ▼

┌──────────────────────────┐
│     Supabase Database    │
│       PostgreSQL         │
└───────────┬──────────────┘
            │
            ├─────────────┐
            │             │
            ▼             ▼

      PgVector       Supabase Auth

            │
            ▼

┌──────────────────────────┐
│       NVIDIA NIM         │
│     AI Inference API     │
└──────────────────────────┘

            │
            ▼

┌──────────────────────────┐
│      Upstash Redis       │
│ Reminder Queue System    │
└──────────────────────────┘
```

---

# Component Architecture

```text
Frontend Layer
│
├── Landing Page
├── Authentication
├── Dashboard
├── Scholarship Search
├── Scholarship Details
├── Saved Scholarships
├── AI Assistant
└── Admin Panel

        │

        ▼

Backend Layer
│
├── Auth Module
├── User Module
├── Scholarship Module
├── Eligibility Module
├── AI Module
├── Notification Module
└── Admin Module

        │

        ▼

Data Layer
│
├── PostgreSQL
├── PgVector
├── Redis
└── Object Storage (Future)
```

---

# Eligibility Flow Architecture

```text
User Profile
      │
      ▼

Eligibility API

      │
      ▼

Load Active Scholarships

      │
      ▼

Eligibility Rule Engine

      │
      ▼

Score Calculator

      │
      ▼

Rank Scholarships

      │
      ▼

Return Recommendations
```

---

# AI (RAG) Architecture

```text
User Question
      │
      ▼

AI Endpoint

      │
      ▼

Vector Search

      │
      ▼

PgVector Database

      │
      ▼

Relevant Scholarship Chunks

      │
      ▼

Prompt Builder

      │
      ▼

NVIDIA NIM

      │
      ▼

AI Response
```

---

# Notification Architecture

```text
Scholarship Deadline
         │
         ▼

Reminder Scheduler

         │
         ▼

BullMQ Queue

         │
         ▼

Redis

         │
         ▼

Notification Worker

         │
         ▼

Email Service

         │
         ▼

User
```

---

# Security Architecture

```text
User Request
      │
      ▼

JWT Authentication

      │
      ▼

Role Guard

      │
      ▼

Rate Limiter

      │
      ▼

Validation Pipe

      │
      ▼

Controller

      │
      ▼

Service

      │
      ▼

Database
```

---

# Future Architecture (Phase 2-4)

```text
Bureaucracy Copilot

│
├── Scholarship Service
├── Government Scheme Service
├── Subsidy Service
├── Document Verification Service
├── OCR Service
├── DigiLocker Integration
├── WhatsApp Bot
├── Mobile App API
└── AI Recommendation Service
```

---

# Recommended MVP Infrastructure

Frontend:

* Next.js
* Vercel

Backend:

* NestJS
* Render

Database:

* Supabase PostgreSQL

Vector Database:

* PgVector

Authentication:

* Supabase Auth

AI:

* NVIDIA NIM

Queue:

* BullMQ

Cache:

* Redis (Upstash)

Monitoring:

* Sentry

Analytics:

* PostHog

This architecture can comfortably support the first 5,000–10,000 users before requiring major scaling changes.
