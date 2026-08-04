import starlette.middleware.base as base
from starlette.types import ASGIApp, Receive, Scope, Send

class SecurityHeadersMiddleware(base.BaseHTTPMiddleware):
    """Add common security headers to every response.

    - Content Security Policy (CSP) – restricts sources for scripts, styles, etc.
    - Strict-Transport-Security (HSTS) – enforce HTTPS.
    - X-Frame-Options – prevent clickjacking.
    - X-Content-Type-Options – disable MIME sniffing.
    - Referrer-Policy – control referrer information.
    """

    def __init__(self, app: ASGIApp, csp: str | None = None):
        super().__init__(app)
        self.csp = csp or "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"

    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Content-Security-Policy"] = self.csp
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "no-referrer"
        return response
