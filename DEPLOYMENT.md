# Deployment Guide

How to deploy **DataGuard.ai** for real users.

## Option 1: The "Easy" Way (PaaS)

### Backend (Railway / Render)
1.  Connect your GitHub repo.
2.  Set `Root Directory` to `server`.
3.  Build Command: `npm install && npx prisma generate && npm run build`
4.  Start Command: `npm run start:prod`
5.  **Environment Variables**:
    *   `DATABASE_URL`: (Provision a PostgreSQL DB on the platform and paste URL here)
    *   `JWT_SECRET`: (Generate a long random string)
    *   `OPENAI_API_KEY`: (Your Key)

### Frontend (Vercel)
1.  Connect your GitHub repo.
2.  Set `Root Directory` to `client`.
3.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: (The URL of your deployed Backend, e.g., `https://api.dataguard.onrender.com`)

---

## Option 2: The "Pro" Way (Docker / VPS)

If you have a server (EC2, DigitalOcean Droplet) with Docker installed:

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/bastola-wrld/dataguard.ai.git
    cd dataguard.ai
    ```

2.  **Set Secrets**:
    Create a `.env` file or export `OPENAI_API_KEY`.

3.  **Run**:
    ```bash
    docker-compose up --build -d
    ```
    Your app is now live on port `3000`.

---

> **Note for Real Users**:
> *   For production, switch `DATABASE_URL` in `server/.env` to a real PostgreSQL database instead of SQLite.
> *   Ensure `NEXT_PUBLIC_API_URL` in the frontend points to the publicly accessible backend domain, not `localhost`.
