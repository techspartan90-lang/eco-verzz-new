FROM python:3.12-slim AS builder

WORKDIR /app

# Install system dependencies for PyTorch and OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends gcc g++ git curl libgl1-mesa-glx libglib2.0-0 && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
# Add AI specific packages (torch, torchvision, yolov5, etc.)
RUN pip install --no-cache-dir -r requirements.txt torch torchvision opencv-python-headless yolov5

# Copy application code (AI modules only)
COPY backend/app ./app

# Runtime stage
FROM python:3.12-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /app ./app

ENV PYTHONUNBUFFERED=1

# Entry point for AI inference worker using Celery
CMD ["celery", "-A", "app.services.ai_service", "worker", "--loglevel=info", "-Q", "ai_queue", "-c", "2"]
