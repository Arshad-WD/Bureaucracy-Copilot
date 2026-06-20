# RAG Design Document

# Project

Bureaucracy Copilot (MVP: Scholarship Copilot)

Version 1.0

---

# Purpose

The Retrieval-Augmented Generation (RAG) system enables the AI assistant to answer scholarship-related questions using verified scholarship data instead of relying solely on the language model.

The RAG system ensures:

* Accurate responses
* Reduced hallucinations
* Source-grounded answers
* Explainable AI behavior
* Up-to-date scholarship information

---

# Objectives

The RAG system must:

✓ Answer scholarship questions

✓ Explain eligibility requirements

✓ Explain required documents

✓ Explain application processes

✓ Use verified scholarship data only

✓ Never invent scholarship information

---

# Non-Objectives

The RAG system will NOT:

✗ Determine eligibility

✗ Make approval decisions

✗ Replace official scholarship guidelines

✗ Generate scholarship information not stored in the database

---

# Architecture Overview

```text
User Question
      │
      ▼
API Request
      │
      ▼
Embedding Search
      │
      ▼
PgVector Retrieval
      │
      ▼
Top Matching Chunks
      │
      ▼
Context Builder
      │
      ▼
Prompt Generator
      │
      ▼
NVIDIA NIM
      │
      ▼
AI Response
      │
      ▼
User
```

---

# RAG Pipeline

## Step 1: User Query

Example:

```text
Am I eligible for Maharashtra Merit Scholarship?
```

Request:

```json
{
  "message": "Am I eligible for Maharashtra Merit Scholarship?"
}
```

---

## Step 2: Query Embedding

Convert user question into vector embedding.

Example:

```text
User Query
↓
Embedding Model
↓
1536-Dimensional Vector
```

Recommended Models:

* NVIDIA NV-Embed
* BGE Large
* E5 Large

---

## Step 3: Vector Search

Search pgvector database.

Query:

```sql
SELECT *
FROM scholarship_embeddings
ORDER BY embedding <-> query_embedding
LIMIT 5;
```

Returns:

```text
Top 5 Relevant Chunks
```

---

## Step 4: Context Assembly

Combine retrieved chunks.

Example:

```text
Chunk 1

Maharashtra Merit Scholarship is available for engineering students.

Chunk 2

Annual family income must be less than ₹8,00,000.

Chunk 3

Required documents include Aadhaar and income certificate.
```

---

## Step 5: Prompt Construction

System Prompt:

```text
You are Bureaucracy Copilot.

Answer only using the provided scholarship data.

If information is unavailable, say:
"I could not find this information in the scholarship database."

Never invent scholarship information.

Never guarantee eligibility.

Never provide legal advice.
```

User Context:

```text
[Retrieved Scholarship Data]
```

User Question:

```text
Am I eligible?
```

---

## Step 6: NVIDIA NIM Generation

Input:

```text
System Prompt

+
Scholarship Context

+
User Question
```

Output:

```text
Based on the scholarship requirements,
engineering students with annual family
income below ₹8,00,000 may qualify.
Please verify with the official guidelines.
```

---

# Data Sources

Scholarship Database

Source of Truth:

```text
PostgreSQL
```

Tables:

```text
scholarships

eligibility_rules

required_documents
```

The LLM never directly accesses external websites.

---

# Embedding Architecture

## Embedding Table

```sql
scholarship_embeddings
```

Fields:

```text
id UUID

scholarship_id UUID

chunk_text TEXT

embedding VECTOR

metadata JSONB

created_at TIMESTAMP
```

---

# Chunking Strategy

## Why Chunking?

Scholarship pages contain:

* Description
* Eligibility
* Documents
* Application Process

Storing entire pages as one chunk reduces retrieval quality.

---

## Recommended Chunk Size

```text
300-500 tokens
```

Overlap:

```text
50 tokens
```

---

## Example Chunks

### Chunk 1

```text
Scholarship Overview
```

### Chunk 2

```text
Eligibility Requirements
```

### Chunk 3

```text
Required Documents
```

### Chunk 4

```text
Application Process
```

---

# Metadata Structure

Example:

```json
{
  "scholarshipId": "uuid",
  "section": "eligibility",
  "provider": "Government",
  "state": "Maharashtra"
}
```

Benefits:

* Faster filtering
* Better retrieval
* More accurate context

---

# Retrieval Strategy

## Hybrid Retrieval

Use:

### Semantic Search

```text
Vector Similarity
```

AND

### Metadata Filtering

```text
State

Scholarship ID

Provider
```

---

## Example

User asks:

```text
What documents are required?
```

System:

```text
Filter:

Scholarship = Maharashtra Merit Scholarship

Search:

Documents Section
```

Improves accuracy significantly.

---

# Retrieval Limits

Top Chunks:

```text
5
```

Maximum Context:

```text
3000 Tokens
```

Avoid:

* Context Overflow
* Increased Costs
* Slower Responses

---

# AI Guardrails

## Allowed

✓ Explain scholarships

✓ Explain requirements

✓ Explain documents

✓ Explain deadlines

✓ Explain application process

---

## Not Allowed

✗ Guarantee eligibility

✗ Guarantee approval

✗ Invent scholarship amounts

✗ Invent deadlines

✗ Legal advice

---

# Hallucination Prevention

Rule 1

Only answer from retrieved context.

---

Rule 2

If context unavailable:

```text
I could not find this information in the scholarship database.
```

---

Rule 3

Always cite scholarship source.

Example:

```text
Source:
Maharashtra Merit Scholarship
```

---

# Scholarship-Specific Retrieval

User opens scholarship page.

Frontend sends:

```json
{
  "scholarshipId": "uuid",
  "message": "What documents are required?"
}
```

Backend:

```text
Filter by scholarshipId
↓
Retrieve Chunks
↓
Generate Answer
```

This dramatically improves accuracy.

---

# Conversation Memory

Store:

```text
Last 10 Messages
```

Purpose:

* Follow-up questions
* Better context understanding

Example:

```text
User:
Tell me about Scholarship A

User:
What documents are needed?
```

The system understands the second question.

---

# Performance Targets

Vector Search:

```text
< 200ms
```

Prompt Construction:

```text
< 100ms
```

AI Response:

```text
< 5 seconds
```

Total Response Time:

```text
< 6 seconds
```

---

# Error Handling

No Matching Chunks

Response:

```text
I could not find relevant information in the scholarship database.
```

---

AI Service Failure

Response:

```text
The AI assistant is currently unavailable.
Please try again later.
```

---

# Future Enhancements

Version 2

* Multi-language Retrieval
* Hindi Support
* Marathi Support

---

Version 3

* OCR Document Understanding
* PDF Scholarship Parsing

---

Version 4

* Government Scheme Knowledge Base
* Welfare Programs
* Subsidy Retrieval

---

# Recommended MVP Stack

Vector Database:

```text
PgVector
```

Embeddings:

```text
NVIDIA NV-Embed
```

Backend:

```text
NestJS
```

Database:

```text
PostgreSQL (Supabase)
```

Inference:

```text
NVIDIA NIM
```

---

# Final Architecture

```text
Scholarship Data
        │
        ▼
Chunking Service
        │
        ▼
Embedding Generator
        │
        ▼
PgVector Storage
        │
        ▼
User Question
        │
        ▼
Vector Search
        │
        ▼
Context Builder
        │
        ▼
NVIDIA NIM
        │
        ▼
Verified AI Response
```

---

# Key Principle

The Rule Engine determines eligibility.

The RAG System explains eligibility.

The AI never decides eligibility.

This separation ensures trust, accuracy, auditability, and future scalability.
