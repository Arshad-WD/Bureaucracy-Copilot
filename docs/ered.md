# Eligibility Rule Engine Design (ERED)

# Project

Bureaucracy Copilot (MVP: Scholarship Copilot)

Version 1.0

---

# Purpose

The Eligibility Rule Engine determines which scholarships a user is likely eligible for based on their profile.

The engine acts as the core intelligence of the platform.

Unlike the AI assistant, the Rule Engine is the source of truth for scholarship matching.

---

# Goals

The engine must:

* Match users to scholarships
* Explain eligibility decisions
* Support dynamic rule changes
* Allow non-developers to manage rules
* Scale to thousands of scholarships

---

# Design Principles

### Rule-Based

No AI decision making.

Eligibility must be deterministic.

---

### Explainable

Every recommendation must include reasons.

Example:

```json
{
  "score": 92,
  "reasons": [
    "Income criteria satisfied",
    "State criteria satisfied",
    "Engineering student"
  ]
}
```

---

### Configurable

Rules should be editable from Admin Panel.

No code changes required.

---

### Extensible

Future support:

* Schemes
* Subsidies
* Welfare Benefits
* Farmer Programs

---

# Rule Engine Architecture

```text
User Profile
      │
      ▼

Rule Loader
      │
      ▼

Rule Evaluator
      │
      ▼

Score Calculator
      │
      ▼

Recommendation Engine
      │
      ▼

Results
```

---

# User Input Model

```json
{
  "age": 20,
  "gender": "Male",
  "state": "Maharashtra",
  "educationLevel": "Engineering",
  "institutionType": "Private",
  "annualIncome": 300000,
  "category": "OBC",
  "disability": false
}
```

---

# Scholarship Rule Structure

Store rules as JSONB.

Example:

```json
{
  "educationLevel": [
    "Engineering",
    "Diploma"
  ],
  "state": [
    "Maharashtra"
  ],
  "income": {
    "max": 800000
  },
  "category": [
    "OBC",
    "SC",
    "ST"
  ]
}
```

Benefits:

* Flexible
* Easy updates
* Supports future rule types

---

# Rule Types

## Age Rule

```json
{
  "age": {
    "min": 18,
    "max": 25
  }
}
```

Evaluation:

```text
18 <= userAge <= 25
```

---

## Income Rule

```json
{
  "income": {
    "max": 800000
  }
}
```

Evaluation:

```text
userIncome <= 800000
```

---

## State Rule

```json
{
  "state": [
    "Maharashtra",
    "Gujarat"
  ]
}
```

Evaluation:

```text
userState IN allowedStates
```

---

## Category Rule

```json
{
  "category": [
    "SC",
    "ST",
    "OBC"
  ]
}
```

Evaluation:

```text
userCategory IN categories
```

---

## Education Rule

```json
{
  "educationLevel": [
    "Engineering"
  ]
}
```

Evaluation:

```text
userEducation IN educationLevels
```

---

## Gender Rule

```json
{
  "gender": [
    "Female"
  ]
}
```

Evaluation:

```text
userGender IN allowedGender
```

---

## Disability Rule

```json
{
  "disability": true
}
```

Evaluation:

```text
userDisability == true
```

---

# Rule Evaluation Process

Step 1

Load scholarship rules.

---

Step 2

Evaluate each rule.

Example:

```text
Income Check

PASS
```

```text
State Check

PASS
```

```text
Category Check

FAIL
```

---

Step 3

Generate Result.

```json
{
  "eligible": false,
  "reasons": [
    "Category requirement not satisfied"
  ]
}
```

---

# Match Scoring System

Purpose:

Rank scholarships.

Not every scholarship needs 100% match.

---

## Weights

| Criteria   | Weight |
| ---------- | ------ |
| Education  | 30     |
| Income     | 25     |
| State      | 20     |
| Category   | 15     |
| Disability | 10     |

Total:

```text
100
```

---

# Example Score Calculation

User:

```text
Engineering

Income: 3L

State: Maharashtra

Category: OBC
```

Scholarship:

```text
Engineering

Income < 8L

State: Maharashtra

Category: OBC
```

Result:

```text
Education 30

Income 25

State 20

Category 15

Disability N/A

Total = 90
```

Match Score:

```text
90%
```

---

# Recommendation Categories

## Perfect Match

```text
90-100%
```

Label:

```text
Highly Recommended
```

---

## Good Match

```text
70-89%
```

Label:

```text
Recommended
```

---

## Partial Match

```text
50-69%
```

Label:

```text
Review Requirements
```

---

## Low Match

```text
Below 50%
```

Not shown by default.

---

# Eligibility Result Object

```json
{
  "scholarshipId": "uuid",
  "title": "Maharashtra Merit Scholarship",
  "score": 92,
  "status": "HIGH_MATCH",
  "reasons": [
    "Income criteria satisfied",
    "State criteria satisfied",
    "Education criteria satisfied"
  ]
}
```

---

# Rule Evaluation API

Endpoint:

```http
POST /eligibility/check
```

Input:

```json
{
  "profileId": "uuid"
}
```

Response:

```json
{
  "matches": [
    {
      "scholarshipId": "uuid",
      "score": 92
    }
  ]
}
```

---

# Performance Strategy

For 1000+ scholarships:

1. Filter inactive scholarships.
2. Filter by state.
3. Filter by education.
4. Evaluate detailed rules.
5. Rank results.

This avoids checking every scholarship.

---

# Admin Rule Builder

Admin UI should support:

```text
IF

State = Maharashtra

AND

Income <= 800000

AND

Education = Engineering

THEN

Eligible
```

No coding required.

---

# Future Rule Types

Version 2

* Academic Percentage
* CGPA
* Institution Type
* Family Occupation

Version 3

* Course Year
* Research Status
* Sports Achievement
* Competitive Exam Scores

Version 4

* Dynamic Government Scheme Rules
* Multi-condition Eligibility Trees
* AI-Assisted Rule Suggestions

---

# Validation Rules

Engine must:

✓ Explain every decision

✓ Produce deterministic results

✓ Never use AI for eligibility decisions

✓ Handle missing profile data gracefully

✓ Support multiple scholarship providers

---

# MVP Recommendation

For V1:

Use JSONB-based rules stored in PostgreSQL and evaluate them in NestJS services.

Avoid AI-based eligibility determination entirely.

AI should only explain results generated by the Rule Engine.

This separation ensures accuracy, trust, auditability, and easier maintenance as the platform grows.
