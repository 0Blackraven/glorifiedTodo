# 🚀 Glorified Todo App

A Todo application built with **Next.js**, **Express**, **Prisma**, and **Redis**.

## ✨ Features

- **🔐 Secure Auth**: Complete authentication system using JWT, Bcrypt, and HTTP-only cookies.
- **⚡ Redis Caching**: Read operations are cached in Redis with intelligent invalidation to minimize database load.
- **📦 Batch DB Updates**: Instead of hitting the database on every change, writes are queued in Redis and flushed to PostgreSQL in batches every minute via a background worker.
- **🔄 Instant Consistency**: High-performance "Read-After-Write" merging ensures that users see their pending changes immediately, even before the batch worker hits the database.
- **🎨 Modern UI**: Built with Next.js 15, Tailwind CSS, and Shadcn UI for a premium, responsive experience.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React
- **State Management**: React Hooks (useState/useEffect)

### Backend
- **Server**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL (Neon.tech / PostgreSQL)
- **Cache/Queue**: Redis (Redis Cloud)
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A PostgreSQL database
- A Redis instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/glorified-todo-app.git
   cd glorified-todo-app
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in `/backend`:
   ```env
   DATABASE_URL="your_postgresql_url"
   REDIS_URL="your_redis_url"
   JWT_SECRET="your_secret"
   PORT="your_port"
   ```
   Initialize Database:
   ```bash
   npx prisma db push
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env.local` file in `/frontend`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:8080"
   ```

### Running Locally

- **Start Backend**: `cd backend && npm start`
- **Start Frontend**: `cd frontend && npm run dev`

## ⚙️ Architecture Details

### Working On 

- better UI/UX
- more info on tasks
- google auth