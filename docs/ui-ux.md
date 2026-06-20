# UI/UX Specification Document

# Project

Bureaucracy Copilot (MVP: Scholarship Copilot)

Version 1.0

---

# Design Principles

### Simplicity First

Users should discover scholarships within 60 seconds.

---

### Mobile First

Most users will access the platform from mobile devices.

---

### Accessibility

* Clear typography
* High contrast
* Large tap targets
* Keyboard accessibility

---

### Trust Focused

The platform must feel official, reliable, and transparent.

Display:

* Official sources
* Verification status
* Last updated dates

---

# Design System

## Colors

### Primary

```text
#2563EB
Blue 600
```

Purpose:

* Primary buttons
* Links
* Highlights

---

### Success

```text
#16A34A
Green 600
```

Purpose:

* Eligible
* Success states

---

### Warning

```text
#F59E0B
Amber 500
```

Purpose:

* Deadlines approaching

---

### Error

```text
#DC2626
Red 600
```

Purpose:

* Validation errors

---

### Neutral

```text
#111827
#374151
#9CA3AF
#F9FAFB
```

---

# Typography

## Heading

```text
Font:
Inter

Weight:
700
```

---

## Body

```text
Font:
Inter

Weight:
400
```

---

# Layout Structure

```text
Navbar

↓

Main Content

↓

Footer
```

Max Width:

```text
1280px
```

Container:

```text
mx-auto px-4
```

---

# Page Specifications

---

# 1. Landing Page

Route

```text
/
```

Goal

Convert visitors into users.

---

## Sections

### Hero Section

Content:

```text
Find Scholarships You Qualify For

Answer a few questions and discover scholarships tailored to you.
```

Components:

* Search Bar
* CTA Button
* Illustration

Buttons:

```text
Find Scholarships

Get Started
```

---

### How It Works

3 Steps

```text
1. Complete Profile

2. Get Matches

3. Apply Successfully
```

---

### Featured Scholarships

Cards showing:

* Name
* Amount
* Deadline

---

### Footer

Links:

* About
* Privacy
* Contact
* Terms

---

# 2. Registration Page

Route

```text
/register
```

Components:

* Name Input
* Email Input
* Password Input
* Confirm Password

Buttons:

```text
Create Account

Continue With Google
```

---

# 3. Login Page

Route

```text
/login
```

Components:

* Email
* Password

Buttons:

```text
Login

Continue With Google
```

Links:

```text
Forgot Password

Create Account
```

---

# 4. Profile Setup

Route

```text
/profile/setup
```

Goal

Collect eligibility information.

---

## Multi-Step Form

Step 1

Personal Information

Fields:

* Age
* Gender
* State

---

Step 2

Academic Information

Fields:

* Education Level
* Institution Type

---

Step 3

Financial Information

Fields:

* Annual Income
* Category
* Disability Status

---

Buttons

```text
Back

Continue

Finish
```

---

# 5. Dashboard

Route

```text
/dashboard
```

Goal

Provide personalized scholarship overview.

---

## Sections

### Welcome Card

```text
Welcome Back, Arshad
```

---

### Recommended Scholarships

Cards:

* Scholarship Name
* Match %
* Amount
* Deadline

Buttons:

```text
View Details

Save
```

---

### Upcoming Deadlines

Timeline View

```text
7 Days Remaining

14 Days Remaining

30 Days Remaining
```

---

### Application Progress

Statistics:

```text
Saved

Applied

Approved
```

---

# 6. Scholarship Listing Page

Route

```text
/scholarships
```

---

## Left Sidebar Filters

Filters:

* State
* Income
* Category
* Education
* Provider

---

## Main Content

Scholarship Cards

Each Card:

```text
Title

Provider

Amount

Deadline

Match Score
```

Buttons:

```text
View Details

Save
```

---

# 7. Scholarship Detail Page

Route

```text
/scholarships/[id]
```

---

## Header

Displays:

```text
Scholarship Name

Provider

Amount

Deadline
```

---

## Sections

### Overview

Description

---

### Eligibility

Requirements

---

### Documents

Required Documents List

---

### Application Process

Step-by-step instructions

---

### Official Link

Apply Button

---

Actions

```text
Save Scholarship

Track Application

Ask AI
```

---

# 8. AI Assistant

Route

```text
/assistant
```

---

## Layout

Chat Interface

```text
User Message

↓

AI Response
```

---

Features

* Suggested Questions
* Scholarship Context
* Typing Indicator

---

Example Questions

```text
Am I eligible?

What documents do I need?

Explain this scholarship.
```

---

# 9. Saved Scholarships

Route

```text
/saved
```

---

## Table View

Columns

```text
Scholarship

Amount

Deadline

Status
```

Actions

```text
Remove

Open

Track
```

---

# 10. Application Tracker

Route

```text
/applications
```

---

## Kanban Board

Columns

```text
Interested

Preparing Documents

Applied

Under Review

Approved

Rejected
```

Drag & Drop Support

---

# 11. Notifications Page

Route

```text
/notifications
```

---

Notification Card

Displays:

```text
Scholarship Deadline Soon

Scholarship Match Found

Application Reminder
```

Actions:

```text
Open

Mark Read
```

---

# 12. Admin Dashboard

Route

```text
/admin
```

---

## Statistics Cards

```text
Total Users

Total Scholarships

Eligibility Checks

Applications Tracked
```

---

## Charts

* User Growth
* Scholarship Views
* Eligibility Checks

---

# 13. Scholarship Management

Route

```text
/admin/scholarships
```

---

## Table

Columns

```text
Name

Provider

Deadline

Status
```

Actions

```text
Create

Edit

Delete
```

---

# Empty States

### No Scholarships Found

```text
No scholarships match your profile.

Try adjusting your filters.
```

---

### No Saved Scholarships

```text
You haven't saved any scholarships yet.
```

Button:

```text
Explore Scholarships
```

---

# Loading States

Use:

* Skeleton Cards
* Loading Spinners
* Progress Indicators

---

# Error States

Examples:

```text
Failed to load scholarships.

Try again.
```

Buttons:

```text
Retry
```

---

# Mobile Design

Bottom Navigation

```text
Home

Scholarships

Saved

AI

Profile
```

---

# Responsive Breakpoints

```text
Mobile:
< 640px

Tablet:
640px - 1024px

Desktop:
> 1024px
```

---

# UX Goals

User should be able to:

1. Register in under 2 minutes
2. Complete profile in under 3 minutes
3. Find relevant scholarships in under 60 seconds
4. Save a scholarship in one click
5. Understand eligibility without external research

---

# MVP Design Priority

Build in this order:

1. Landing Page
2. Login/Register
3. Profile Setup
4. Dashboard
5. Scholarship List
6. Scholarship Details
7. Saved Scholarships
8. Admin Panel
9. AI Assistant
10. Notifications

This order delivers a usable product before adding AI features.
