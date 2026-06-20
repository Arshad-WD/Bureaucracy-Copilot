# User Flow Document

# Project

Bureaucracy Copilot (MVP: Scholarship Copilot)

---

# Primary User Journey

```text
Landing Page
      ↓
Sign Up / Login
      ↓
Complete Profile
      ↓
Eligibility Assessment
      ↓
Scholarship Matches
      ↓
Scholarship Details
      ↓
Save Scholarship
      ↓
Track Application
      ↓
Receive Deadline Reminders
```

---

# Flow 1: New User Onboarding

### Step 1 - Landing Page

User lands on homepage.

Displayed:

* Search Bar
* Benefits Overview
* How It Works
* Featured Scholarships
* Sign Up Button

Actions:

* Sign Up
* Login
* Explore Scholarships

---

### Step 2 - Registration

User chooses:

* Email Signup
* Google Login

Required Fields:

* Name
* Email
* Password

System:

* Creates account
* Sends verification email
* Redirects to onboarding

---

### Step 3 - Profile Setup

User fills:

Personal Information

* Age
* Gender
* State

Academic Information

* Education Level
* Course
* Institution Type

Financial Information

* Family Income

Optional Information

* Category
* Disability Status

System:

* Saves profile
* Calculates eligibility baseline

Redirect:

Eligibility Dashboard

---

# Flow 2: Eligibility Assessment

### User Clicks

"Find Scholarships"

System loads profile.

Eligibility Engine executes.

```text
Profile Data
      ↓
Rule Matching
      ↓
Scoring
      ↓
Recommendations
```

Results Screen:

For each scholarship:

* Scholarship Name
* Match Score
* Deadline
* Scholarship Amount
* Quick Summary

Actions:

* View Details
* Save
* Compare

---

# Flow 3: Scholarship Details

User opens scholarship.

Displays:

Overview

* Description
* Benefits
* Provider

Eligibility

* Income Criteria
* State Criteria
* Education Criteria

Documents

* Income Certificate
* Marksheet
* Aadhaar
* Other Documents

Application

* Official Link
* Deadline
* Application Steps

Actions:

* Save Scholarship
* Mark Applying
* Ask AI

---

# Flow 4: AI Guidance Assistant

Entry Points:

* Scholarship Page
* Dashboard

User asks:

Examples:

"What documents do I need?"

"Why am I not eligible?"

"Explain income criteria."

System:

```text
User Question
      ↓
Knowledge Search
      ↓
Scholarship Data
      ↓
AI Response
```

Response includes:

* Explanation
* Eligibility Clarification
* Application Guidance

Restrictions:

* No legal advice
* No eligibility guarantees

---

# Flow 5: Save Scholarship

User clicks:

Save Scholarship

System:

* Creates saved record

Redirect:

Saved Scholarships Page

Displays:

* Saved Scholarships
* Deadlines
* Status

Actions:

* Remove
* Open Details
* Mark Applying

---

# Flow 6: Application Tracking

User selects:

Mark Applying

Application Status Options:

* Interested
* Preparing Documents
* Applied
* Under Review
* Approved
* Rejected

Dashboard updates automatically.

---

# Flow 7: Deadline Reminder System

System checks daily.

Conditions:

* 30 Days Remaining
* 14 Days Remaining
* 7 Days Remaining
* 1 Day Remaining

Notifications:

Email

In-App Notification

User Actions:

* Open Scholarship
* Dismiss Reminder

---

# Flow 8: Scholarship Search

User uses search bar.

Filters:

* State
* Category
* Income
* Education Level
* Scholarship Type

System returns filtered results.

Actions:

* Save
* View Details
* Ask AI

---

# Flow 9: Returning User

```text
Login
   ↓
Dashboard
   ↓
Saved Scholarships
   ↓
Deadline Updates
   ↓
Continue Applications
```

Dashboard Shows:

* New Matching Scholarships
* Upcoming Deadlines
* Saved Scholarships
* Application Status

---

# Admin Flow

Admin Login

↓

Admin Dashboard

↓

Manage Scholarships

↓

Manage Rules

↓

Manage Documents

↓

Publish Updates

---

# Admin Scholarship Creation Flow

Admin enters:

* Scholarship Name
* Description
* Eligibility Criteria
* Documents
* Deadline
* Official Link

System:

* Validates Data
* Stores Scholarship
* Creates Search Index
* Updates Eligibility Engine

---

# Error Flows

### Missing Profile

User tries eligibility check.

System:

Prompt:

"Complete your profile to see personalized scholarships."

Redirect:

Profile Setup

---

### Expired Scholarship

User opens scholarship.

System:

Shows:

"Applications Closed"

Actions:

* View Similar Scholarships

---

### AI Service Unavailable

System:

Displays:

"AI Assistant temporarily unavailable."

Scholarship browsing and eligibility features continue working.

---

# Future Flow (Phase 2)

```text
Upload Documents
       ↓
OCR Processing
       ↓
Document Verification
       ↓
Eligibility Recalculation
       ↓
Improved Recommendations
```

---

# Future Flow (Phase 3)

```text
Connect DigiLocker
        ↓
Import Documents
        ↓
Auto Verify
        ↓
Auto Eligibility Check
        ↓
Ready-to-Apply Dashboard
```
