# =============================================
# Stage 1: Build Frontend (Next.js Static Export)
# =============================================
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Install dependencies (cached layer)
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Build static export (output → /app/frontend/out)
COPY frontend/ ./
ENV NEXT_PUBLIC_API_URL=""
RUN npm run build


# =============================================
# Stage 2: Backend (FastAPI — serves everything)
# =============================================
FROM python:3.11-slim AS backend

WORKDIR /app

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY app/ ./app/

# Copy built frontend from Stage 1
COPY --from=frontend-build /app/frontend/out ./frontend/out

# Environment
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Start server (shell form for Render's dynamic $PORT)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
