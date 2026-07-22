# Use Python slim as base
FROM python:3.11-slim

# Install Node.js and bash
RUN apt-get update && apt-get install -y curl bash && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY app/ ./app/

# Install Next.js dependencies and build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
ENV NEXT_PUBLIC_API_URL=""
RUN npm run build

# Go back to /app and setup start script
WORKDIR /app
COPY start.sh .
RUN chmod +x start.sh

# Environment variables
ENV PYTHONUNBUFFERED=1

# Expose Render PORT (dynamic)
EXPOSE 3000

# Start both servers
CMD ["./start.sh"]
