# LOOP

## Project Overview
LOOP is a modern, full-stack web application designed for seamless user interaction, robust data management, and optimized performance. It provides a clean interface and powerful backend capabilities.

## Features
- Secure User Authentication and Authorization.
- Dynamic dashboard with real-time updates.
- Responsive design optimized for all devices (Tailwind CSS).
- Database integration with secure ORM management.

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend/API:** Next.js Server Actions / API Routes
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Deployment:** Vercel

## Architecture
The application follows a modern monolithic/serverless architecture using Next.js App Router, separating server-side logic, database queries via Prisma, and client-side UI components.

## Database
- **Database:** PostgreSQL (Hosted on cloud provider like Supabase/Neon)
- **ORM:** Prisma

## Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
DATABASE_URL="your_postgresql_database_url"
NEXTAUTH_SECRET="your_nextauth_secret_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"