# Security Design Document (SecDD)

# Project

Bureaucracy Copilot (MVP: Scholarship Copilot)

Version 1.0

---

# Purpose

This document defines the security architecture, policies, controls, and implementation requirements for Bureaucracy Copilot.

The goal is to protect:

* User accounts
* Personal information
* Scholarship data
* AI services
* Backend infrastructure
* Administrative operations

---

# Security Objectives

The platform must ensure:

✓ Confidentiality

✓ Integrity

✓ Availability

✓ Authentication

✓ Authorization

✓ Auditability

✓ Data Protection

---

# Security Principles

### Least Privilege

Users only access resources they own.

Admins only access resources required for administration.

---

### Zero Trust

Every request must be verified.

Never trust:

* Client input
* Browser state
* Frontend validation

---

### Defense in Depth

Security exists at multiple layers:

```text
Frontend

↓

API Gateway

↓

Authentication

↓

Authorization

↓

Validation

↓

Database
```

---

# Security Architecture

```text
User
 │
 ▼

HTTPS

 │
 ▼

Next.js Frontend

 │
 ▼

JWT Authentication

 │
 ▼

NestJS Backend

 │
 ▼

Authorization Guards

 │
 ▼

Validation Layer

 │
 ▼

Business Logic

 │
 ▼

PostgreSQL Database
```

---

# Authentication Design

## Authentication Method

Primary:

* Email + Password

Secondary:

* Google OAuth

---

## Registration Flow

```text
User Registers
      │
      ▼

Validate Input

      │
      ▼

Hash Password

      │
      ▼

Store User

      │
      ▼

Generate JWT
```

---

# Password Security

Algorithm:

```text
Argon2id
```

Never store:

❌ Plain Text Passwords

❌ Reversible Passwords

---

Example:

```text
Password

↓

Argon2 Hash

↓

Store Hash
```

---

# JWT Authentication

## Access Token

Purpose:

* API Authentication

Expiration:

```text
15 Minutes
```

---

## Refresh Token

Purpose:

* Generate new access tokens

Expiration:

```text
30 Days
```

Storage:

```text
HTTP Only Cookie
```

---

# Authorization Design

## Roles

```text
USER

ADMIN

SUPER_ADMIN
```

---

# Access Matrix

| Resource           | User | Admin | Super Admin |
| ------------------ | ---- | ----- | ----------- |
| Own Profile        | ✓    | ✓     | ✓           |
| Scholarships       | ✓    | ✓     | ✓           |
| Saved Scholarships | ✓    | ✓     | ✓           |
| Admin Dashboard    | ✗    | ✓     | ✓           |
| User Management    | ✗    | ✗     | ✓           |

---

# Route Protection

## Public Routes

```http
/auth/register

/auth/login

/scholarships

/scholarships/:id

/health
```

---

## Protected Routes

```http
/profile

/saved-scholarships

/applications

/notifications
```

---

## Admin Routes

```http
/admin/*
```

Role Guard Required.

---

# API Security

## Rate Limiting

Public APIs

```text
100 Requests / Minute
```

---

Authenticated APIs

```text
300 Requests / Minute
```

---

AI Endpoints

```text
20 Requests / Minute
```

---

Implementation

```text
@nestjs/throttler
```

---

# Input Validation

Every request must pass validation.

---

## DTO Validation

Example:

```typescript
@IsEmail()
email: string

@MinLength(8)
password: string
```

---

## Request Validation

Use:

```text
Class Validator

Class Transformer
```

---

Reject:

* Invalid Emails
* Invalid IDs
* Invalid Types

---

# SQL Injection Protection

Use:

```text
Prisma ORM
```

Never:

```text
Raw SQL String Concatenation
```

---

Safe Example

```typescript
prisma.user.findUnique({
  where: {
    id
  }
})
```

---

# XSS Protection

Sanitize:

* User Input
* Search Queries
* AI Messages

---

Frontend:

```text
React Auto Escaping
```

---

Backend:

```text
Sanitize HTML Inputs
```

---

# CSRF Protection

Applies To:

* Authentication Routes
* Profile Updates

Methods:

```text
SameSite Cookies

CSRF Tokens
```

---

# CORS Policy

Allowed Origins:

```text
https://bureaucracycopilot.com

https://www.bureaucracycopilot.com
```

Development:

```text
http://localhost:3000
```

---

# Sensitive Data Protection

## User Data

Protected Fields:

```text
Email

Income

Category

Disability Status
```

---

Rules

* Never expose internal IDs unnecessarily
* Never expose password hashes
* Never expose refresh tokens

---

# Database Security

## PostgreSQL

Use:

```text
SSL Connection Required
```

---

Database Access

```text
Backend Only
```

Never:

```text
Direct Client Access
```

---

# Secrets Management

Store:

```text
JWT Secret

Database URL

NVIDIA API Key

Google OAuth Secret
```

Using:

```text
Environment Variables
```

---

Never Commit:

```text
.env
```

to Git.

---

# Logging & Auditing

## Security Logs

Log:

* Login Attempts
* Failed Logins
* Password Changes
* Admin Actions
* Scholarship Modifications

---

Example

```json
{
  "userId": "uuid",
  "action": "LOGIN",
  "timestamp": "2026-06-20"
}
```

---

# Audit Trail

Track:

```text
Scholarship Created

Scholarship Updated

Scholarship Deleted

Admin Login
```

---

# AI Security

## Prompt Injection Protection

Reject:

```text
Ignore previous instructions

Reveal system prompt

Reveal database
```

---

System Prompt Rule

```text
Only answer using scholarship data.
```

---

# RAG Security

AI receives:

✓ Retrieved Chunks

AI never receives:

✗ Database Access

✗ API Keys

✗ User Passwords

---

# File Upload Security (Future)

Allowed:

```text
PDF

PNG

JPG
```

---

Maximum Size:

```text
10 MB
```

---

Validation:

* MIME Type Check
* Virus Scan
* Extension Validation

---

# Notification Security

Emails:

* Verified Sender Domain
* Rate Limited

Prevent:

```text
Spam Abuse
```

---

# Monitoring

Tools

```text
Sentry

Supabase Logs

Render Logs
```

Monitor:

* Error Rate
* Login Failures
* API Abuse
* AI Abuse

---

# Backup Strategy

Database Backup

Frequency:

```text
Daily
```

Retention:

```text
30 Days
```

---

# Disaster Recovery

Recovery Time Objective

```text
4 Hours
```

Recovery Point Objective

```text
24 Hours
```

---

# Security Testing

Before Release

Perform:

✓ Authentication Testing

✓ Authorization Testing

✓ Input Validation Testing

✓ SQL Injection Testing

✓ XSS Testing

✓ API Rate Limit Testing

✓ JWT Expiry Testing

---

# Compliance Considerations

User Rights

* View Data
* Delete Account
* Export Data

Privacy Requirements

* Transparent Data Collection
* Consent-Based Processing

---

# MVP Security Checklist

Authentication
✓ Argon2 Password Hashing
✓ JWT Access Tokens
✓ Refresh Tokens

Authorization
✓ RBAC
✓ Route Guards

API Security
✓ Rate Limiting
✓ Validation
✓ Sanitization

Database Security
✓ Prisma ORM
✓ SSL
✓ Secrets Management

AI Security
✓ Prompt Injection Protection
✓ RAG Isolation

Monitoring
✓ Sentry
✓ Audit Logs

---

# Final Security Model

```text
User
 │
 ▼

HTTPS
 │
 ▼

Authentication
 │
 ▼

Authorization
 │
 ▼

Validation
 │
 ▼

Business Logic
 │
 ▼

Database
 │
 ▼

Audit Logging
 │
 ▼

Monitoring
```

The system follows a layered security approach where every request is authenticated, authorized, validated, logged, and monitored before accessing sensitive resources.
