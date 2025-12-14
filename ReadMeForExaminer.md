# Applicant Tracking System (ATS)

A modern, full-stack Applicant Tracking System built for recruiters who manage hundreds of applications.

**Live Demo**: https://recruitats.vercel.app/

---

## 🎯 Target User

Recruiters who need to efficiently sort through large volumes of job applications, track candidates through hiring stages, and make quick decisions.

---

## ✨ Features

### Core Features
- **Job Management** - Create, edit, and delete job postings
- **Applicant Management** - Store candidate profiles with contact info and skills
- **Application Tracking** - Pipeline stages: New → Review → Interview → Offer → Rejected
- **Notes System** - Add private notes to applications
- **Dashboard** - Stats overview, activity timeline, and 7-day trends chart

### Advanced Features 
- **AI Job Matching** - Match applicants to jobs based on skills
- **Secure Authentication** - Recruiter login with NextAuth.js

---

## 🛠️ Tech Stack

| Technology | Choice | Reasoning |
|------------|--------|-----------|
| **Framework** | Next.js 14 (App Router) | Modern React framework with built-in API routes and TypeScript support |
| **Database** | PostgreSQL (Supabase) | Relational DB ideal for structured hiring data with relationships |
| **ORM** | Prisma | Type-safe queries, excellent TypeScript integration |
| **Styling** | Tailwind CSS | Rapid UI development, consistent design |
| **Auth** | NextAuth.js | Secure, industry-standard authentication |
| **Storage** | Supabase Storage | Resume file storage |
| **Deployment** | Vercel | Zero-config deployment for Next.js |

---

## 📐 Design Decisions

1. **5-Stage Pipeline** - New, Review, Interview, Offer, Rejected covers the standard hiring workflow without overcomplication
2. **Recruiter-Centric Model** - Each recruiter sees only their own data, enabling multi-tenant use
3. **Resume Parsing** - Auto-extracts candidate info from PDFs to save time when processing many applications
4. **7-Day Activity Chart** - Quick pulse on hiring activity without data overload
5. **Confirmation Modals** - Prevents accidental deletions of important data
6. **Mobile Responsive** - Works on all device sizes for recruiters on the go
---

## 🤔 Assumptions

1. **Single Recruiter Per Account** - Team collaboration features are out of scope for MVP
3. **English Language** - UI and parsing optimized for English content
4. **Small-Medium Scale** - Designed for hundreds of applications; enterprise scale would need caching/pagination optimization
5. **Manual Applicant Entry** - No public job board; recruiters add candidates directly
6. **Basic Skills Matching** - Simple keyword comparison; production system would use ML models

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase account)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your database URL and auth secrets

# Initialize database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
