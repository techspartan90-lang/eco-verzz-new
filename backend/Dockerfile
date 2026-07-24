FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements_current.txt .
# Install django-extensions, pytest, and others as well if they are used
RUN pip install --no-cache-dir -r requirements_current.txt
RUN pip install --no-cache-dir gunicorn uvicorn pytest pytest-django pytest-cov django-extensions django-prometheus sentry-sdk celery redis

COPY . .

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
