#!/bin/bash

# NexGen DataGuard & Form MVP - Automated Scaffolding Script
# This script installs all dependencies and prepares the database environments.

echo "🚀 Starting NexGen Project Scaffolding..."

# 1. DataGuard Server Setup
echo "--- Setting up DataGuard Server ---"
cd server
npm install
if [ ! -f .env ]; then
  cp .env.example .env 2>/dev/null || echo "JWT_SECRET=default_secret_key" > .env
fi
npx prisma generate
npx prisma db push
cd ..

# 2. DataGuard Client Setup
echo "--- Setting up DataGuard Client ---"
cd client
npm install
if [ ! -f .env.local ]; then
  echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
fi
cd ..

# 3. Form MVP Setup
echo "--- Setting up NexGen Feedback Form MVP ---"
cd mvp-form-collector/server
npm install
if [ ! -f .env ]; then
  echo "DATABASE_URL=\"file:./dev.db\"" > .env
fi
npx prisma generate
npx prisma db push
cd ../..

echo "✅ Scaffolding Complete!"
echo "To run the platform:"
echo "1. DataGuard Backend: cd server && npm run start:dev"
echo "2. DataGuard Frontend: cd client && npm run dev"
echo "3. Form MVP Backend: cd mvp-form-collector/server && npm start"
