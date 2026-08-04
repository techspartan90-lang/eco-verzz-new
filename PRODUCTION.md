# EcoVerzz Production Deployment & Architecture Guide

This repository is containerized and ready for production deployment using Docker, Docker Compose, Nginx, PostgreSQL, and FastAPI.

---

## Quick Start (Production Setup)

To start the entire EcoVerzz application stack (PostgreSQL, FastAPI Backend, React Nginx Frontend):

```bash
docker compose up --build -d
```

### Services Started
- **Frontend App**: `http://localhost` (Nginx serving React single-page app)
- **FastAPI Backend**: `http://localhost:8000` (Uvicorn API server)
- **PostgreSQL Database**: `localhost:5432` (`ecoverzz_ai` database)

---

## Health Check & Monitoring

- **Backend Health Check**: `http://localhost:8000/health`
- **Swagger API Interactive Docs**: `http://localhost:8000/docs`

```json
{
  "status": "healthy",
  "database": "connected",
  "service": "EcoVerzz FastAPI Backend",
  "version": "1.0"
}
```

---

## Architecture & Security Highlights

### 1. Analytics Engine (Recharts & Integrations)
- **Investment, Portfolio, Risk & Return Analytics** powered by Recharts charts (Area, Bar, Composed, Pie, Line) and custom ESG Risk Heatmaps.
- **Multi-Source Integrations**: Realtime synchronization connectors for Google Sheets/Apps Script, Yahoo Finance API, Alpha Vantage, News API, and OpenAI GPT-4o risk summarization.

### 2. Security Hardening
- **Authentication**: JWT Bearer token authentication with Argon2 password hashing.
- **Nginx Security Headers**: `X-Frame-Options`, `X-XSS-Protection`, `X-Content-Type-Options`, and `Referrer-Policy` enabled.
- **CORS Protection**: Controlled CORS headers configured in FastAPI backend middleware.
- **Database Security**: Prepared statements & SQLAlchemy ORM parameter binding preventing SQL injection.

---

## Environment Variables Reference

| Variable | Service | Default Value | Description |
|---|---|---|---|
| `DATABASE_URL` | Backend | `postgresql://postgres:postgrespassword@postgres:5432/ecoverzz_ai` | PostgreSQL Connection URI |
| `SECRET_KEY` | Backend | `EcoVerzzAI_2026_SuperSecretKey_Production` | JWT signing secret |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Backend | `60` | Token lifetime in minutes |
| `VITE_API_BASE_URL` | Frontend | `http://127.0.0.1:8000` | Backend API URL |
| `VITE_OPENAI_API_KEY` | Frontend | *(Optional)* | OpenAI API Key for GPT-4o Insights |
| `VITE_GOOGLE_APPS_SCRIPT_URL` | Frontend | *(Optional)* | Google Apps Script Web App URL |
