# NexGen Feedback | Form MVP

A premium, high-aesthetic data collection system with secure user authentication and a private analytics dashboard.

## Features
- **Modern UI**: Dark-mode Glassmorphism design with fluid CSS animations.
- **Secure Auth**: JWT-based session management and bcrypt password hashing.
- **Private Dashboard**: Individual users can view and manage their specific submissions.
- **Responsive**: Fully optimized for various screen dimensions.

## Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL (compatible), currently using SQLite for demo.
- **ORM**: Prisma.

## Setup
1. `cd server`
2. `npm install`
3. `npx prisma db push`
4. `npm start`
5. Open `client/index.html` in a browser.

## Database Analysis
See the [DB Architecture Report](../../brain/db_architecture_report.md) for a technical breakdown of scalability and DBMS selection logic.
