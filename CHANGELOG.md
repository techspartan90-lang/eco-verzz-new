# Changelog

All notable changes to the EcoVerse enterprise platform will be documented in this file.

## [1.0.0] - 2026-07-24

### Added
- Monorepo structure with `/frontend`, `/backend`, `/ai-service`, `/infra`, and `/.github/workflows`.
- FastAPI AI microservice in `/ai-service` utilizing OpenCV and YOLOv8 with mock fallback routines.
- Scaffolding (models, serializers, services, views, urls, permissions, validators, admin, tests) for Django apps: `ai`, `common`, `users`, `marketplace`, `community`, `rewards`, `analytics`, `notifications`, `dashboard`.
- SimpleJWT integration, email verification, password reset, and role-based access control (RBAC).
- Redis-backed DRF throttling classes and custom scopes: `login`, `password_reset`, `uploads`.
- Pytest testing framework integration with a custom `pytest.ini` and a testing cache fallback utilizing `LocMemCache`.
- Django structured metadata request logging middleware.
- Security headers (HSTS, secure cookies, Clickjacking protection).
- Sentry SDK error tracking in Django and React.
- Prometheus scraper target rules and Grafana automated datasource/dashboard provisioners.
- GitHub Actions CI/CD pipeline definition (`ci-cd.yml`).
- Post-deployment HTTP status smoke test script (`smoke_tests.py`).

### Changed
- Relocated original root frontend code to the `/frontend` subfolder to establish a clean monorepo.
- Removed skeletal, redundant template `backend/frontend` folder to eliminate duplication.
- Combined all duplicate/overridden Django `REST_FRAMEWORK` settings in `settings.py` into a unified block.
