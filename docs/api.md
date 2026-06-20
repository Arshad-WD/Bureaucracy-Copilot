# API Specification Document

# Project

Bureaucracy Copilot (MVP: Scholarship Copilot)

Version: 1.0

Base URL

```http
/api/v1
```

Authentication

```http
Authorization: Bearer <JWT_TOKEN>
```

Response Format

Success

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# AUTH MODULE

## Register User

### Endpoint

```http
POST /auth/register
```

### Request

```json
{
  "name": "Arshad",
  "email": "arshad@gmail.com",
  "password": "Password@123"
}
```

### Response

```json
{
  "success": true,
  "message": "Account created successfully"
}
```

---

## Login

### Endpoint

```http
POST /auth/login
```

### Request

```json
{
  "email": "arshad@gmail.com",
  "password": "Password@123"
}
```

### Response

```json
{
  "success": true,
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

---

## Refresh Token

### Endpoint

```http
POST /auth/refresh
```

### Request

```json
{
  "refreshToken": "token"
}
```

### Response

```json
{
  "accessToken": "new_token"
}
```

---

## Logout

### Endpoint

```http
POST /auth/logout
```

### Headers

```http
Authorization: Bearer TOKEN
```

### Response

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Get Current User

### Endpoint

```http
GET /auth/me
```

### Response

```json
{
  "id": "uuid",
  "name": "Arshad",
  "email": "arshad@gmail.com",
  "role": "USER"
}
```

---

# USER PROFILE MODULE

## Create / Update Profile

### Endpoint

```http
POST /profile
```

### Request

```json
{
  "age": 21,
  "gender": "Male",
  "state": "Maharashtra",
  "educationLevel": "Engineering",
  "institutionType": "Private",
  "annualIncome": 300000,
  "category": "OBC",
  "disability": false
}
```

### Response

```json
{
  "success": true,
  "message": "Profile updated"
}
```

---

## Get Profile

### Endpoint

```http
GET /profile
```

### Response

```json
{
  "id": "uuid",
  "age": 21,
  "state": "Maharashtra",
  "educationLevel": "Engineering"
}
```

---

# SCHOLARSHIP MODULE

## Get Scholarships

### Endpoint

```http
GET /scholarships
```

### Query Params

```http
?page=1
&limit=10
&state=Maharashtra
&education=Engineering
&category=OBC
```

### Response

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Scholarship A",
      "provider": "Government",
      "amount": 50000
    }
  ],
  "total": 120
}
```

---

## Get Scholarship By ID

### Endpoint

```http
GET /scholarships/:id
```

### Response

```json
{
  "id": "uuid",
  "title": "Scholarship A",
  "description": "Scholarship Description",
  "amount": 50000,
  "deadline": "2026-12-01",
  "documents": []
}
```

---

## Search Scholarships

### Endpoint

```http
POST /scholarships/search
```

### Request

```json
{
  "keyword": "engineering",
  "state": "Maharashtra"
}
```

### Response

```json
{
  "results": []
}
```

---

# ELIGIBILITY MODULE

## Check Eligibility

### Endpoint

```http
POST /eligibility/check
```

### Request

```json
{
  "state": "Maharashtra",
  "annualIncome": 300000,
  "educationLevel": "Engineering",
  "category": "OBC"
}
```

### Response

```json
{
  "matches": [
    {
      "scholarshipId": "uuid",
      "title": "Scholarship A",
      "score": 92,
      "reasons": [
        "Income eligible",
        "Education eligible"
      ]
    }
  ]
}
```

---

## Eligibility Using Saved Profile

### Endpoint

```http
GET /eligibility/recommendations
```

### Response

```json
{
  "matches": []
}
```

---

# SAVED SCHOLARSHIP MODULE

## Save Scholarship

### Endpoint

```http
POST /saved-scholarships
```

### Request

```json
{
  "scholarshipId": "uuid"
}
```

### Response

```json
{
  "success": true
}
```

---

## Get Saved Scholarships

### Endpoint

```http
GET /saved-scholarships
```

### Response

```json
{
  "data": []
}
```

---

## Remove Saved Scholarship

### Endpoint

```http
DELETE /saved-scholarships/:id
```

### Response

```json
{
  "success": true
}
```

---

# APPLICATION TRACKING MODULE

## Create Application

### Endpoint

```http
POST /applications
```

### Request

```json
{
  "scholarshipId": "uuid",
  "status": "INTERESTED"
}
```

### Response

```json
{
  "success": true
}
```

---

## Update Application Status

### Endpoint

```http
PATCH /applications/:id
```

### Request

```json
{
  "status": "APPLIED"
}
```

### Response

```json
{
  "success": true
}
```

---

## Get User Applications

### Endpoint

```http
GET /applications
```

### Response

```json
{
  "applications": []
}
```

---

# NOTIFICATION MODULE

## Get Notifications

### Endpoint

```http
GET /notifications
```

### Response

```json
{
  "notifications": []
}
```

---

## Mark Notification Read

### Endpoint

```http
PATCH /notifications/:id/read
```

### Response

```json
{
  "success": true
}
```

---

# AI MODULE

## Chat With AI

### Endpoint

```http
POST /ai/chat
```

### Request

```json
{
  "message": "Am I eligible for NSP scholarship?"
}
```

### Response

```json
{
  "answer": "Based on your profile..."
}
```

---

## AI Scholarship Explanation

### Endpoint

```http
POST /ai/explain
```

### Request

```json
{
  "scholarshipId": "uuid"
}
```

### Response

```json
{
  "summary": "This scholarship is intended for..."
}
```

---

# ADMIN MODULE

## Create Scholarship

### Endpoint

```http
POST /admin/scholarships
```

### Request

```json
{
  "title": "Scholarship A",
  "provider": "Government",
  "amount": 50000
}
```

### Response

```json
{
  "success": true
}
```

---

## Update Scholarship

### Endpoint

```http
PATCH /admin/scholarships/:id
```

### Response

```json
{
  "success": true
}
```

---

## Delete Scholarship

### Endpoint

```http
DELETE /admin/scholarships/:id
```

### Response

```json
{
  "success": true
}
```

---

## Get Dashboard Analytics

### Endpoint

```http
GET /admin/analytics
```

### Response

```json
{
  "totalUsers": 1200,
  "totalScholarships": 250,
  "eligibilityChecks": 5400,
  "savedScholarships": 3200
}
```

---

# Health Check

## API Status

### Endpoint

```http
GET /health
```

### Response

```json
{
  "status": "UP",
  "database": "CONNECTED",
  "ai": "CONNECTED"
}
```

---

# API Security

Protected Routes:

```text
/profile/*
/saved-scholarships/*
/applications/*
/notifications/*
/admin/*
```

Public Routes:

```text
/auth/register
/auth/login
/scholarships
/scholarships/:id
/health
```

Rate Limits:

```text
Public APIs: 100 req/min

Authenticated APIs: 300 req/min

AI APIs: 20 req/min
```

API Versioning:

```http
/api/v1
```

Future:

```http
/api/v2
```
