# JobPilot AI
> **Autonomous Multi-Agent Career Platform: Tailor Multi-Format Resumes, Discover Aligned Jobs Automatically & Apply via Gmail Integration**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%20%7C%203.14-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![NVIDIA NIM](https://img.shields.io/badge/NVIDIA%20NIM-Nemotron%20120B%20%7C%20Llama%203.2-76B900?style=for-the-badge&logo=nvidia)](https://www.nvidia.com/)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary%20%2F%20All%20Rights%20Reserved-red.svg?style=for-the-badge)](LICENSE)

JobPilot AI is an autonomous multi-agent platform designed to act as your personal career team. Candidates can tailor and generate different specialized CV formats (ATS Modern, Technical Specialist, Executive Leadership, and Europass). The moment you customize a CV, the Autonomous Job Discovery Agent immediately activates, reads that specific resume format, and discovers live job openings matching that exact profile—then drafts personalized application materials and sends them directly through the Gmail Connector.

---

![JobPilot AI Cover](Images/JobPilot%20AI.png)

---

## Table of Contents
- [Executive Overview](#executive-overview)
- [Multi-Agent System Architecture](#multi-agent-system-architecture)
- [Key Capability: Multi-Format CV Tailoring & Auto-Job Discovery](#key-capability-multi-format-cv-tailoring--auto-job-discovery)
- [Step-by-Step Platform Walkthrough](#step-by-step-platform-walkthrough)
  - [Step 1: Central Career Command Center](#step-1-central-career-command-center)
  - [Step 2: Real Document Ingestion & Text Parsing](#step-2-real-document-ingestion--text-parsing)
  - [Step 3: Granular Fact Verification & Database Sync](#step-3-granular-fact-verification--database-sync)
  - [Step 4: Resume Studio & Live Interactive Editor](#step-4-resume-studio--live-interactive-editor)
  - [Step 5: Multi-Format Executive Template Customization](#step-5-multi-format-executive-template-customization)
  - [Step 6: Pixel-Isolated PDF & Print Generation](#step-6-pixel-isolated-pdf--print-generation)
  - [Step 7: Autonomous CV-Driven Job Discovery](#step-7-autonomous-cv-driven-job-discovery)
  - [Step 8: Real-Time Live Job Market Dashboard](#step-8-real-time-live-job-market-dashboard)
  - [Step 9: Deep Role Match Matrix & Skill Gap Analysis](#step-9-deep-role-match-matrix--skill-gap-analysis)
  - [Step 10: Centralized Application Pipeline CRM](#step-10-centralized-application-pipeline-crm)
  - [Step 11: Tailored Outreach Drafting & 1-Click Gmail Dispatch](#step-11-tailored-outreach-drafting--1-click-gmail-dispatch)
  - [Step 12: Continuous Career Coaching & Technical Mock Interviews](#step-12-continuous-career-coaching--technical-mock-interviews)
- [Commercial Database Memory Architecture (Short-Term vs. Long-Term)](#commercial-database-memory-architecture-short-term-vs-long-term)
- [Job Discovery & Search API Configuration](#job-discovery--search-api-configuration)
- [Gmail Connector Integration Guide](#gmail-connector-integration-guide)
- [Technology Stack](#technology-stack)
- [Installation & Quickstart](#installation--quickstart)
- [Environment Configuration](#environment-configuration)
- [API Endpoints Reference](#api-endpoints-reference)
- [Proprietary License & Intellectual Property](#proprietary-license--intellectual-property)

---

## Executive Overview

Modern career management requires managing multiple specialized resumes, tracking dozens of application portals, and writing tailored communications. JobPilot AI coordinates specialized agents to execute this full workflow end-to-end:

* **Document Fact Extraction**: Ingests real PDF, DOCX, and TXT files, extracting granular personal, technical, and historical facts with confidence scores.
* **Multi-Format Synthesis**: Produces 4 distinct resume formats optimized for ATS scanners, technical hiring managers, executive panels, or international recruiters.
* **Adaptive Job Discovery**: Reads active resume headlines and skill tags, instantly querying live job markets (Google Jobs, LinkedIn, Indeed) for matching vacancies.
* **Automated Application Outreach**: Generates context-aware cover letters and cold emails, allowing direct 1-click dispatch via Google OAuth Gmail API.
* **Continuous Strategic Coaching**: Multi-turn dialogue powered by NVIDIA Nemotron 120B and Llama 3 models for mock interviews, compensation negotiations, and upskilling plans.

---

## Multi-Agent System Architecture

```
                               ┌─────────────────────────────────────────┐
                               │       User / Candidate Interface        │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                       ┌─────────────────────────────────────────────────────────┐
                       │           Strategic Orchestration Agent                 │
                       │     (Powered by NVIDIA Nemotron 120B & Llama 3)         │
                       └─────┬──────────────┬──────────────┬──────────────┬──────┘
                             │              │              │              │
        ┌────────────────────┘              │              │              └────────────────────┐
        ▼                                   ▼              ▼                                   ▼
┌───────────────────────┐       ┌───────────────────────┐ ┌───────────────────────┐  ┌───────────────────────┐
│ Fact Ingestion Agent  │       │ Resume Tailor Agent   │ │ Job Discovery Agent   │  │ Outreach & CRM Agent  │
│                       │       │                       │ │                       │  │                       │
│ • Real Document Parse │──────>│ • 4 Resume Formats    │>│ • Auto-Reads CV Data  │─>│ • Tailored Emails     │
│ • Granular Validation │       │ • Live Visual Preview │ │ • Live SERP Discovery │  │ • Direct Gmail Send   │
└───────────────────────┘       └───────────────────────┘ └───────────────────────┘  └───────────────────────┘
            │                               │                         │                          │
            └───────────────────────────────┴────────────┬────────────┴──────────────────────────┘
                                                         │
                                                         ▼
                               ┌──────────────────────────────────────────────────┐
                               │           PostgreSQL Canonical Store             │
                               │  Profiles • Verified Facts • Application Records │
                               └──────────────────────────────────────────────────┘
```

### Agent Roles & Specifications

| Agent | Responsibility | Implementation |
| :--- | :--- | :--- |
| **Strategy & Dialogue Agent** | Provides continuous career advising, system design critiques, mock interview evaluation, and salary strategies. | NVIDIA NIM API (`nvidia/nemotron-3-super-120b-a12b`, `meta/llama-3.2-11b-vision-instruct`) |
| **Document Ingestion Agent** | Extracts raw text from uploaded files, validates contact and work history, and outputs granular candidate facts. | `pdfminer.six`, `python-docx`, Regex Extractors, ProfileAgent |
| **Resume Tailoring Agent** | Synthesizes targeted resumes across 4 layouts (ATS Modern, Technical Specialist, Executive Leadership, Europass). | Next.js 16, TypeScript, Resume Exporter (PDF & DOCX) |
| **Job Discovery Agent** | Automatically binds to the active tailored CV title and skill stack to execute real-time market queries. | SerpAPI (Google Jobs Engine) & Career Agent Engine |
| **Outreach & Gmail Agent** | Composes tailored outreach communications and executes authenticated delivery through the user's Gmail inbox. | Google OAuth 2.0 & Gmail API REST Services |

---

## Key Capability: Multi-Format CV Tailoring & Auto-Job Discovery

JobPilot AI connects resume customization directly to real-time job matching:

* **Create Specialized Formats for Specific Goals**:
  * **Technical Specialist Format**: Emphasizes architecture, frameworks, and system metrics for Staff and Principal Engineer roles.
  * **Executive Leadership Format**: Highlights team leadership, business growth, and organizational scale for Director and VP candidates.
  * **ATS Modern Format**: High-density single-column structure designed for enterprise applicant tracking systems.
  * **Europass Format**: Standardized structure for international and European applications.

* **Autonomous Search Re-Alignment**:
  * When you switch or tailor a resume format and click **"Find Jobs for this CV"**, the Job Discovery Agent automatically re-aligns its search queries.
  * It reads the specific headline, certifications, and highlighted technical stack from that tailored version and queries the live market accordingly.

---

## Step-by-Step Platform Walkthrough

### Step 1: Central Career Command Center
The central dashboard provides an executive summary of profile completeness, estimated ATS readiness score, verified fact count, and direct shortcuts to all modules.

![Overview Dashboard](Images/Overview%20Dashboard.png)

---

### Step 2: Real Document Ingestion & Text Parsing
Upload resumes, CVs, or accreditation documents in PDF, DOCX, or TXT formats. The ingestion pipeline processes raw files without manual data entry.

![Doc Info Extractor](Images/Doc%20Info%20Extractor.png)

---

### Step 3: Granular Fact Verification & Database Sync
Extracted details are broken down into discrete atomic facts (Personal Details, Headline, Executive Summary, Skills, Work History, Education, Certifications). You can edit any value inline and synchronize all confirmed data directly to PostgreSQL.

![Extracted Info](Images/Extracted%20Info.png)

---

### Step 4: Resume Studio & Live Interactive Editor
The Resume Studio features a split-screen layout with an interactive customization panel on the left and a live real-time document preview on the right.

![Resume Studio](Images/Resume%20Studio.png)

---

### Step 5: Multi-Format Executive Template Customization
Select from 4 distinct styles tailored to specific industry standards:

#### Template 1: ATS Modern (Single-column layout designed for maximum ATS machine-readability)
![ATS CV](Images/ATS%20Cv.png)

#### Template 2: Technical Specialist (Two-column layout highlighting technical proficiencies, tools, and system metrics)
![Technical Specialist CV](Images/Technical%20Specialist%20Cv.png)

#### Template 3: Executive Leadership (Refined typography suited for Senior, Lead, and Managerial candidates)
![Executive Leadership CV](Images/Executive%20Leadership%20Cv.png)

#### Template 4: Europass International (Standardized structure for global and international roles)
![Europass CV](Images/Europass%20Cv.png)

---

### Step 6: Pixel-Isolated PDF & Print Generation
Dedicated print rules isolate the `#printable-cv` document container, ensuring downloaded PDFs exclude editor sidebars, navigation bars, and buttons.

![PDF Print](Images/PDF%20Print.png)

---

### Step 7: Autonomous CV-Driven Job Discovery
Clicking **"Find Jobs for this CV"** extracts your active job title and primary skill stack to initiate tailored live searches automatically.

![Finding Job](Images/Finding%20Job.png)

---

### Step 8: Real-Time Live Job Market Dashboard
The Job Dashboard displays active vacancies aggregated from Google Jobs, LinkedIn, and Indeed, including verified salary bands, location, and remote availability.

![Job Dashboard according to CV](Images/Job%20Dashboard%20according%20to%20Cv.png)

![Agentic AI Jobs](Images/Agentic%20Ai%20Jobs.png)

---

### Step 9: Deep Role Match Matrix & Skill Gap Analysis
Selecting any job reveals an automated fit evaluation, detailing matched skills, missing requirements, and specific action items to optimize your candidacy.

![Recommendations and Gaps](Images/Recommendations%20of%20jobs%20and%20gaps.png)

---

### Step 10: Centralized Application Pipeline CRM
Manage active opportunities across all stages: Applied, Interviewing, Offer Received, and Archived.

![Go for Application](Images/Go%20for%20application.png)

---

### Step 11: Tailored Outreach Drafting & 1-Click Gmail Dispatch
For every opportunity, the platform:
* Generates customized Cold Emails, LinkedIn Messages, and Cover Letters with adjustable tones (Technical, Professional, Bold, Casual).
* Sends the email directly through your connected Gmail account using the Gmail API integration.

![Outreach Drafter](Images/Technical,%20professional,%20cold%20outreach%20tone%20Gmail%20or%20application%20written%20by%20agent%20by%20observing%20the%20job%20requirement.png)

---

### Step 12: Continuous Career Coaching & Technical Mock Interviews
The Career Agent provides continuous dialogue powered by NVIDIA Nemotron 120B and Llama 3 models for mock interviews, salary negotiation tactics, and career roadmaps.

![Career Counselling Chatbot](Images/Career%20Counselling%20Chatbot.png)

---

## Commercial Database Memory Architecture (Short-Term vs. Long-Term)

For production enterprise deployment, JobPilot AI utilizes a dual-memory system:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              DUAL-TIER MEMORY ARCHITECTURE                             │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│            SHORT-TERM MEMORY              │             LONG-TERM MEMORY               │
│            (Active Context)               │        (Canonical Persistent Store)        │
├───────────────────────────────────────────┼────────────────────────────────────────────┤
│ • Sliding chat conversation history       │ • Canonical user profile in PostgreSQL     │
│ • In-flight tool invocation state         │ • Verified facts with source provenance    │
│ • Real-time resume draft modifications    │ • Versioned resume history and templates   │
│ • Active job query parameters             │ • Applications CRM audit trail             │
│ • Streaming Server-Sent Events cache      │ • Semantic career vector embeddings        │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

* **Short-Term Memory**: Keeps multi-turn conversations and interactive editor adjustments responsive during active sessions.
* **Long-Term Memory**: Stores verified profile facts, resume versions, and application statuses securely in PostgreSQL across user sessions.

---

## Job Discovery & Search API Configuration

JobPilot AI connects to **SerpAPI (Google Jobs Engine)** for real-time market discovery.

### Setup Instructions
1. Obtain an API key from [SerpAPI.com](https://serpapi.com/) (includes 100 free searches monthly).
2. Add your key to `backend/.env`:
   ```env
   SERPAPI_KEY=your_serpapi_key_here
   ```

---

## Gmail Connector Integration Guide

The Gmail Connector allows authenticated email dispatch directly from the candidate's personal Gmail account.

### Setup Instructions
1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and enable the **Gmail API**.
3. Configure OAuth 2.0 Credentials:
   * Application Type: **Web Application**
   * Authorized Redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add the credentials to `backend/.env`:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
   ```
5. Click **"Connect Gmail"** in the application interface to authorize sending.

---

## Technology Stack

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons
* **Backend**: FastAPI, Python 3.11 / 3.14, SQLAlchemy 2.0, Alembic
* **Database**: PostgreSQL 16
* **AI Models**: NVIDIA NIM API (`nvidia/nemotron-3-super-120b-a12b`, `meta/llama-3.2-11b-vision-instruct`, `openai/gpt-oss-20b`)
* **Job Discovery Engine**: SerpAPI (Google Jobs Engine)
* **Document Processing**: `pdfminer.six`, `python-docx`
* **Email Delivery**: Google OAuth 2.0 & Gmail API

---

## Installation & Quickstart

### Prerequisites
* Node.js (v18+ or v20+)
* Python (v3.10+)
* PostgreSQL instance or Docker container

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/jobpilot-ai.git
cd jobpilot-ai
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn backend.api.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

Access the interface at **http://localhost:3000**.

---

## Environment Configuration

### Backend `.env` (`backend/.env`)
```env
# Database Connection (PostgreSQL)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/career_buddy

# Security Keys
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# NVIDIA AI Models (Nemotron 120B / Llama 3)
OPENAI_API_KEY=your_nvidia_api_key
OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1

# Real-Time Job Search (SerpAPI)
SERPAPI_KEY=your_serpapi_key_here

# Gmail Connector (Google Cloud)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
```

### Frontend `.env.local` (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
OPENAI_API_KEY=your_nvidia_api_key
OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
```

---

## API Endpoints Reference

| Endpoint | Method | Purpose |
| :--- | :---: | :--- |
| `/auth/register` | `POST` | Register candidate account |
| `/auth/login` | `POST` | Authenticate and retrieve JWT Bearer token |
| `/profiles/me` | `GET` / `PUT` | Retrieve or update canonical profile |
| `/documents/parse` | `POST` | Parse unstructured CV files into atomic facts |
| `/documents/sync-profile` | `POST` | Commit verified facts to PostgreSQL |
| `/resumes/` | `GET` / `POST` | Manage and create tailored resume records |
| `/resumes/{id}/export/pdf` | `GET` | Export resume as binary PDF |
| `/resumes/{id}/export/docx` | `GET` | Export resume as Word document |
| `/jobs/search` | `POST` | Query live job market via SerpAPI |
| `/applications/` | `GET` / `POST` | Manage application pipeline stages |
| `/applications/{id}/generate-email` | `POST` | Generate tailored outreach communication |
| `/gmail/oauth/start` | `GET` | Initiate Google OAuth authorization |
| `/api/agent/chat` | `POST` | SSE Streaming endpoint for AI Career Coach |

---

## Proprietary License & Intellectual Property

**Copyright © 2026 Eman Yahya. All Rights Reserved.**

This repository, including its source code, architecture, design assets, and documentation, is **strictly proprietary and confidential**. 

* **No Unauthorized Use**: No individual, organization, or entity may copy, clone, distribute, modify, reverse engineer, sublicense, sell, or deploy this software or any part of it without explicit prior written authorization from **Eman Yahya**.
* **Commercial & Educational Restriction**: Unauthorized private, educational, commercial, or non-commercial deployment of this codebase is strictly prohibited.
* For licensing inquiries or formal authorization, contact the repository owner directly.
