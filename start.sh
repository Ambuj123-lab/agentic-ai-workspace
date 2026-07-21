#!/bin/bash

# Exit on error
set -e

echo "Starting FastAPI Backend..."
# Run FastAPI on internal port 8000 in the background
uvicorn app.main:app --host 127.0.0.1 --port 8000 &

echo "Starting Next.js Frontend..."
# Run Next.js on the port provided by Render
cd frontend
npm run start -- -p ${PORT:-3000}
