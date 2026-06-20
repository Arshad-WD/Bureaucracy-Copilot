# Bureaucracy Copilot 🇮🇳 (MVP: Scholarship Copilot)

**Bureaucracy Copilot** is a state-of-the-art, AI-powered scholarship discovery, eligibility matching, and progress-tracking platform designed to help Indian students navigate complex government welfare schemes without the typical administrative friction.

---

## 🎯 Why This Project Exists

Applying for government scholarships and welfare schemes in India is notoriously complex. Meritorious and needy students frequently miss out on critical financial support due to:
* **Information Fragmentation:** Schemes are scattered across multiple state and central portals.
* **Complex Eligibility Rules:** Manual evaluation of multiple parameters (family income, academic level, caste categories, state residency, and physical disability).
* **Document Confusion:** Missing or incorrect paperwork that leads to application rejection.

**Bureaucracy Copilot** solves these challenges by combining:
1. **A Determinstic Eligibility Engine:** A strict rule-based matcher that evaluates applicant profiles against criteria and ranks matching schemes.
2. **Context-Restricted AI Assistant:** A RAG (Retrieval-Augmented Generation) assistant that answers questions using *only* verified database context, preventing AI hallucinations.
3. **Application Kanban Progress Tracker:** A visual board that helps students organize documents and track application stages from discovery to approval.

---

## ⚙️ Technical Architecture

The workspace is organized into a clean monorepo layout:
```text
Bureaucracy Copilot/
├── backend/            # NestJS API Server + Prisma PostgreSQL ORM
├── frontend/           # Next.js 15 Client Web App (React 19 & TailwindCSS)
└── docs/               # System Specifications and Design Documents
```

### Technology Stack
* **Frontend:** Next.js 15 (App Router), React 19, Zustand (State Management), Axios, TailwindCSS, Lucide Icons.
* **Backend:** NestJS (Modular API framework), Prisma ORM (Database connection & modeling), Jest (Testing).
* **Database:** **Neon PostgreSQL** (Cloud Serverless Database).
* **AI Engine:** NVIDIA NIM (`meta/llama-3.3-70b-instruct`) / Google Gemini (`gemini-1.5-flash`) with a 4-second timeout fallback to a local database keyword index.

---

## 🚀 Setup & Execution Guide

### 1. Environment Configurations
Configure your environment variables in [backend/.env](file:///d:/Varity%20of%20Projects/Bureacuracy%20Copilot/backend/.env):
```env
PORT=5000
DATABASE_URL="postgresql://neondb_owner:npg_TZ2rREPeuB1W@ep-hidden-waterfall-ah2vyjgz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

JWT_SECRET="1MndljZBLGm0WeQj75FuOewcIKiMjhT3JYMMx96T0uk="
JWT_REFRESH_SECRET="HiVENMpZMIX0LLQycHcaBfmRrEjAjU1LJt33yn9XFDc="

# AI Keys (If left empty, local mock search fallbacks will be used)
NVIDIA_API_KEY="your-nvidia-api-key"
GEMINI_API_KEY="your-gemini-api-key"
```

### 2. Run Backend (NestJS Server)
In the `backend` directory, run:
```bash
# Install dependencies
npm install

# Push database schema to Neon PostgreSQL
npx prisma db push --force-reset

# Seed 10 real-world Indian government scholarships
npx ts-node prisma/seed.ts

# Start the API server in development mode
npm run start
```
*The backend API will start at:* **http://localhost:5000/api/v1**

### 3. Run Frontend (Next.js App)
In the `frontend` directory, run:
```bash
# Install dependencies
npm install

# Start Next.js client
npm run dev
```
*Access the Web UI at:* **http://localhost:3000**

---

## 🧪 Running Integration Tests
To execute the integration tests check for both database connections and AI assistant fallback rules, navigate to the `backend` directory and run:
```bash
npm run test:e2e
```
All **23 integrated test specs** will run and verify database reads/writes, authentication guards, eligibility calculations, and AI assistant flows.

---

## 📂 Project Documentation

All design specs and technical sheets have been grouped under the [docs/](file:///d:/Varity%20of%20Projects%20Bureacuracy%20Copilot/docs) folder:
* [brd.md](file:///d:/Varity%20of%20Projects/Bureacuracy%20Copilot/docs/brd.md) (Business Requirements)
* [prd.md](file:///d:/Varity%20of%20Projects/Bureacuracy%20Copilot/docs/prd.md) (Product Requirements)
* [trd.md](file:///d:/Varity%20of%20Projects/Bureacuracy%20Copilot/docs/trd.md) (Technical Requirements)
* [sdd.md](file:///d:/Varity%20of%20Projects/Bureacuracy%20Copilot/docs/sdd.md) (Software Design Document)
* [erd.md](file:///d:/Varity%20of%20Projects/Bureacuracy%20Copilot/docs/erd.md) (Entity-Relationship Database Diagram)
* [ered.md](file:///d:/Varity%20of%20Projects/Bureacuracy%20Copilot/docs/ered.md) (Eligibility Rule Engine Design)
* [api.md](file:///d:/Varity%20of%20Projects/Bureacuracy%20Copilot/docs/api.md) (REST API Specifications)
* [security.md](file:///d:/Varity%20of%20Projects/Bureacuracy%20Copilot/docs/security.md) (Security Design Details)
* [rag.md](file:///d:/Varity%20of%20Projects/Bureacuracy%20Copilot/docs/rag.md) (RAG Assistant Spec)
* [test.md](file:///d:/Varity%20of%20Projects/Bureacuracy%20Copilot/docs/test.md) (Testing & Checklist Matrix)
