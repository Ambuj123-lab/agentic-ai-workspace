# =============================================
# Stage 1: Build Frontend (Next.js Node Server)
# =============================================
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Build the Next.js app (creates .next/ directory)
COPY frontend/ ./
ENV NEXT_PUBLIC_API_URL=""
RUN npm run build


# =============================================
# Stage 2: Final Production Image (FastAPI + Next.js)
# =============================================
FROM python:3.11-slim AS production

# Install Node.js v20 in the Python image
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Setup Backend
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ ./app/

# 2. Setup Frontend (copy built files from Stage 1)
COPY --from=frontend-build /app/frontend ./frontend

# 3. Setup Startup Script
COPY start.sh .
RUN chmod +x start.sh

# Environment
ENV PYTHONUNBUFFERED=1
ENV NODE_ENV=production

# Render assigns $PORT dynamically, we expose it
EXPOSE 8000
EXPOSE 3000

# Start both FastAPI and Next.js concurrently
CMD ["./start.sh"]
