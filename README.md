# DataGuard.ai 🛡️

**DataGuard.ai** is an intelligent Cloud Security Posture Management (CSPM) platform that autonomously detects and remediates cloud vulnerabilities using AI.

![DataGuard Dashboard](https://github.com/user-attachments/assets/placeholder-image-if-you-have-one)

## 🚀 Key Features

-   **🔍 Auto-Discovery**: Automatically scans and maps cloud infrastructure (Mock AWS S3, EC2).
-   **⚠️ Real-Time Risk Feed**: Live vulnerability streaming via WebSockets.
-   **🧠 AI Remediation Agent**: Uses **GPT-4** to analyze vulnerabilities and generate precise **Terraform** fixes.
-   **🛡️ "Safe-Fix" Sandbox**: Review AI-generated code before applying it to your infrastructure.
-   **⚡ Real-Time Updates**: Instant status updates across all connected clients.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15 (App Router), Tailwind CSS, Shadcn/UI, Socket.io Client.
-   **Backend**: NestJS, Prisma (SQLite/Postgres), OpenAI SDK, Socket.io Gateway.
-   **Database**: SQLite (Dev) / PostgreSQL (Prod).
-   **Infrastructure**: Docker, Docker Compose.

## 🏁 Quick Start

### Prerequisites
-   Node.js 20+
-   npm
-   (Optional) Docker

### Local Development

1.  **Clone the repository**
    ```bash
    git clone https://github.com/bastola-wrld/dataguard.ai.git
    cd dataguard.ai
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    cp .env.example .env # (Create .env with OPENAI_API_KEY)
    npx prisma generate
    npm run start:dev
    ```
    _Server runs on http://localhost:4000_

3.  **Setup Frontend**
    ```bash
    cd ../client
    npm install
    npm run dev
    ```
    _Client runs on http://localhost:3000_

4.  **Login**
    -   Email: `agent@dataguard.ai`
    -   Password: `password123`

### 🐳 Run with Docker

Simply run the compose file to start the full stack:

```bash
docker-compose up --build
```

## 🔒 Environment Variables

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Connection string for the database (Prisma) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `OPENAI_API_KEY` | **Required** for AI features. |

## 📜 deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to Vercel, Railway, or VPS.

---

Built with ❤️ by **DataGuard Team**.
