import sys
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import text

from app.main import app
from app.database.connection import engine
from app.core.security import verify_password

client = TestClient(app)

def test_full_auth_system():
    print("=" * 60)
    print("Starting Automated E2E Authentication & RBAC Test")
    print("=" * 60)

    # 1. Health check
    response = client.get("/")
    assert response.status_code == 200, f"Health check failed: {response.text}"
    print("[PASS] Health Check Endpoint GET /: OK")

    # Generate unique test email prefixes to ensure clean test runs
    unique_suffix = str(uuid.uuid4())[:8]

    users_data = [
        {"name": "Admin User", "email": f"admin_{unique_suffix}@ecoverzz.io", "password": "AdminPassword123!", "role": "Admin"},
        {"name": "Analyst User", "email": f"analyst_{unique_suffix}@ecoverzz.io", "password": "AnalystPassword123!", "role": "Analyst"},
        {"name": "Investor User", "email": f"investor_{unique_suffix}@ecoverzz.io", "password": "InvestorPassword123!", "role": "Investor"}
    ]

    tokens = {}

    # 2. Register Users
    for u in users_data:
        reg_payload = {
            "full_name": u["name"],
            "email": u["email"],
            "password": u["password"],
            "phone": "+1234567890",
            "role": u["role"]
        }
        res = client.post("/auth/register", json=reg_payload)
        assert res.status_code == 200, f"Registration failed for {u['email']}: {res.text}"
        data = res.json()
        assert "access_token" in data, "Token missing in registration response"
        assert data["user"]["role"] == u["role"], f"Role mismatch: expected {u['role']}, got {data['user']['role']}"
        print(f"[PASS] Registration for {u['role']} ({u['email']}): OK")

    # 3. Login Users
    for u in users_data:
        login_payload = {
            "email": u["email"],
            "password": u["password"]
        }
        res = client.post("/auth/login", json=login_payload)
        assert res.status_code == 200, f"Login failed for {u['email']}: {res.text}"
        data = res.json()
        assert "access_token" in data, "Token missing in login response"
        tokens[u["role"]] = data["access_token"]
        print(f"[PASS] Login & JWT Generation for {u['role']}: OK")

    # Test Invalid Login
    res = client.post("/auth/login", json={"email": users_data[0]["email"], "password": "WrongPassword!"})
    assert res.status_code == 401, f"Expected 401 for wrong password, got {res.status_code}"
    print("[PASS] Invalid Login Rejected with 401 Unauthorized: OK")

    # 4. Protected Route: /user/profile
    for u in users_data:
        token = tokens[u["role"]]
        headers = {"Authorization": f"Bearer {token}"}
        res = client.get("/user/profile", headers=headers)
        assert res.status_code == 200, f"Profile request failed for {u['role']}: {res.text}"
        data = res.json()
        assert data["email"] == u["email"]
        assert data["role"] == u["role"]
        print(f"[PASS] Token Verification & /user/profile for {u['role']}: OK")

    # 5. Role-Based Access Control Enforcements
    # 5a. Admin Dashboard (/user/admin-dashboard)
    # Admin -> 200 OK
    res = client.get("/user/admin-dashboard", headers={"Authorization": f"Bearer {tokens['Admin']}"})
    assert res.status_code == 200, f"Admin failed to access admin-dashboard: {res.text}"
    print("[PASS] RBAC - Admin accessing /user/admin-dashboard: 200 OK")

    # Analyst -> 403 Forbidden
    res = client.get("/user/admin-dashboard", headers={"Authorization": f"Bearer {tokens['Analyst']}"})
    assert res.status_code == 403, f"Analyst should be denied access to admin-dashboard, got {res.status_code}"
    print("[PASS] RBAC - Analyst denied access to /user/admin-dashboard: 403 Forbidden")

    # Investor -> 403 Forbidden
    res = client.get("/user/admin-dashboard", headers={"Authorization": f"Bearer {tokens['Investor']}"})
    assert res.status_code == 403, f"Investor should be denied access to admin-dashboard, got {res.status_code}"
    print("[PASS] RBAC - Investor denied access to /user/admin-dashboard: 403 Forbidden")

    # 5b. Analyst Reports (/user/analyst-reports)
    # Admin -> 200 OK
    res = client.get("/user/analyst-reports", headers={"Authorization": f"Bearer {tokens['Admin']}"})
    assert res.status_code == 200, "Admin accessing analyst-reports failed"
    # Analyst -> 200 OK
    res = client.get("/user/analyst-reports", headers={"Authorization": f"Bearer {tokens['Analyst']}"})
    assert res.status_code == 200, "Analyst accessing analyst-reports failed"
    # Investor -> 403 Forbidden
    res = client.get("/user/analyst-reports", headers={"Authorization": f"Bearer {tokens['Investor']}"})
    assert res.status_code == 403, "Investor should be denied analyst-reports"
    print("[PASS] RBAC - Analyst Reports Permissions (Admin/Analyst Allowed, Investor Denied): OK")

    # 5c. Investor Portfolio (/user/investor-portfolio)
    for r in ["Admin", "Analyst", "Investor"]:
        res = client.get("/user/investor-portfolio", headers={"Authorization": f"Bearer {tokens[r]}"})
        assert res.status_code == 200, f"{r} accessing investor-portfolio failed"
    print("[PASS] RBAC - Investor Portfolio Permissions (All Allowed): OK")

    # 6. Direct PostgreSQL Database Verification
    print("-" * 60)
    print("Verifying PostgreSQL Persistence...")
    with engine.connect() as conn:
        for u in users_data:
            result = conn.execute(
                text("SELECT id, full_name, email, password_hash, role FROM users WHERE email = :email"),
                {"email": u["email"]}
            ).fetchone()
            assert result is not None, f"User {u['email']} not found in PostgreSQL database!"
            db_id, db_name, db_email, db_hash, db_role = result
            assert db_email == u["email"]
            assert db_role == u["role"]
            assert verify_password(u["password"], db_hash), f"Password hash mismatch in DB for {u['email']}"
            print(f"[PASS] PostgreSQL record verified: Email={db_email}, Role={db_role}, Password Hash Verified=True")

    print("=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY! AUTH & RBAC SYSTEM IS 100% FUNCTIONAL.")
    print("=" * 60)

if __name__ == "__main__":
    test_full_auth_system()
