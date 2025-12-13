
# Applicant Tracking System (ATS)

A full-stack ATS built with Next.js, Prisma, PostgreSQL (Supabase), and Tailwind CSS.

## Features

- **Job Management**: Create and view job postings.
- **Applicant Tracking**: Review candidates, resume links, and contact info.
- **Application Workflow**: Track candidates through statuses (New, Review, Interview, Offer, Rejected).
- **Notes**: Recruiters can add notes to applications.
- **Authentication**: Secure signup/signin for recruiters using NextAuth.js.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Supabase) via Prisma ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js installed.
- **Windows Users**: If you see `PSSecurityException` in PowerShell, use **Command Prompt (cmd)** instead, or run commands like `cmd /c "npm run dev"`.

### Installation

1. **Clone the repository** (if you haven't already).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```env
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
   DIRECT_URL="postgres://..."
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```
4. **Database Setup**:
   Initialize the database schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   *Note: If `npx prisma db push` fails with a connection error, verify your database password in `.env` and ensure your Supabase project is active.*

5. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deployment

This app is optimized for Vercel.
1. Push to GitHub.
2. Import project in Vercel.
3. Add Environment Variables (DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL).
4. Deploy!
