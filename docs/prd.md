# Product Requirements Document (PRD)

## Product Name

Bureaucracy Copilot

## Vision

Bureaucracy Copilot helps Indian citizens discover, understand, and apply for government schemes, scholarships, subsidies, and benefits they may qualify for.

Instead of searching through dozens of government websites and complex eligibility criteria, users answer a few questions and receive personalized recommendations, document guidance, and application instructions.

---

# Problem Statement

Millions of Indians miss out on scholarships, subsidies, and welfare schemes because:

* They do not know such schemes exist.
* Eligibility requirements are difficult to understand.
* Information is spread across multiple government websites.
* Required documents are unclear.
* Deadlines are missed.
* Application processes are confusing.

Current government portals provide information but do not provide personalized eligibility discovery.

---

# Target Users

### Primary Users

* College Students
* School Students
* Job Seekers
* Small Business Owners
* Farmers

### Secondary Users

* Parents
* Teachers
* NGOs
* Career Counselors

---

# MVP Scope (Version 1)

Focus only on:

### Scholarships

Examples:

* Central Government Scholarships
* State Government Scholarships
* Minority Scholarships
* Merit-Based Scholarships
* Need-Based Scholarships

Do not include all government schemes initially.

---

# Core Features

## 1. Eligibility Assessment

User answers:

* Age
* Gender
* State
* Education Level
* Course Type
* Annual Family Income
* Category (General/OBC/SC/ST)
* Disability Status

System evaluates matching scholarships.

Output:

* Scholarship Name
* Match Percentage
* Key Benefits
* Eligibility Summary

---

## 2. Scholarship Discovery

Users can search scholarships.

Filters:

* State
* Education Level
* Income Range
* Category
* Scholarship Type

---

## 3. Scholarship Detail Page

Display:

* Description
* Eligibility Criteria
* Benefits
* Deadline
* Required Documents
* Official Website
* Application Process

---

## 4. AI Guidance Assistant

Users can ask:

* Am I eligible?
* What documents do I need?
* How do I apply?
* What does this requirement mean?

The AI must answer only using stored scholarship data.

No hallucinated information.

---

## 5. Personalized Dashboard

Users can:

* Save Scholarships
* Track Applications
* Track Deadlines
* Mark Applications Complete

---

## 6. Deadline Reminder System

Notify users:

* Application Opening
* Closing Soon
* Missing Documents

Notifications:

* Email
* In-App

---

# Admin Panel

Admin can:

* Add Scholarships
* Edit Scholarship Data
* Update Deadlines
* Disable Expired Schemes

---

# Database Design

Scholarship

* id
* title
* description
* provider
* amount
* state
* deadline
* official_url
* status

Eligibility

* scholarship_id
* min_income
* max_income
* education_level
* category
* state
* disability_required

Documents

* scholarship_id
* document_name

Users

* id
* name
* email
* profile_data

SavedScholarships

* user_id
* scholarship_id

---

# User Flow

Homepage

↓

Eligibility Quiz

↓

Eligibility Engine

↓

Matched Scholarships

↓

Scholarship Details

↓

Save Scholarship

↓

Reminder Tracking

---

# Tech Stack

Frontend:

* Next.js
* TypeScript
* TailwindCSS

Backend:

* NestJS

Database:

* PostgreSQL
* Supabase

Authentication:

* Supabase Auth

AI:

* NVIDIA NIM
  or
* Gemini API

Hosting:

* Vercel (Frontend)
* Render/Railway (Backend)

---

# AI Rules

The AI must:

* Never invent scholarship details.
* Only use stored database information.
* Cite source scholarship data.
* Explain eligibility in simple language.

The AI must not:

* Guarantee eligibility.
* Guarantee approval.
* Provide legal advice.

---

# Success Metrics

Month 1:

* 100 scholarships indexed
* 100 registered users

Month 3:

* 1,000 users
* 5,000 eligibility checks

Month 6:

* 10,000 users
* 500 scholarships indexed

---

# Future Versions

Version 2:

* Government Welfare Schemes
* Subsidies
* Farmer Benefits

Version 3:

* DigiLocker Integration
* Document Verification
* Auto Form Filling

Version 4:

* Full Bureaucracy Copilot
* All Citizen Services
* AI Application Assistant
