import sys
import unittest
from fastapi.testclient import TestClient
from app.main import app

class TestAiAndAdminSystem(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # Register Admin & Investor users
        cls.admin_reg = cls.client.post("/auth/register", json={
            "email": "sysadmin@ecoverzz.ai",
            "password": "AdminPassword123!",
            "full_name": "System Admin",
            "role": "Admin"
        })
        cls.admin_token = cls.client.post("/auth/login", json={
            "email": "sysadmin@ecoverzz.ai",
            "password": "AdminPassword123!"
        }).json().get("access_token")

        cls.investor_reg = cls.client.post("/auth/register", json={
            "email": "testinvestor@ecoverzz.ai",
            "password": "InvestorPass123!",
            "full_name": "Test Investor",
            "role": "Investor"
        })
        cls.investor_token = cls.client.post("/auth/login", json={
            "email": "testinvestor@ecoverzz.ai",
            "password": "InvestorPass123!"
        }).json().get("access_token")

    def test_01_ai_recommendation_engine(self):
        headers = {"Authorization": f"Bearer {self.investor_token}"}
        res = self.client.post("/recommendations/generate", json={
            "risk_profile": "Moderate",
            "investment_goal": "ESG Growth",
            "monthly_investment": 1000.0,
            "investment_period": 10
        }, headers=headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["risk_profile"], "Moderate")
        self.assertIn("recommended_funds", data)
        self.assertGreater(data["confidence_score"], 80)
        print("  [OK] AI Recommendation Engine test passed.")

    def test_02_fund_comparison_matrix(self):
        headers = {"Authorization": f"Bearer {self.investor_token}"}
        res = self.client.post("/funds/compare", json={
            "symbols": ["ECO-SOLAR", "ECO-WIND", "CARBON-YIELD"]
        }, headers=headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data["funds"]), 3)
        self.assertIn("highest_cagr", data["metrics_summary"])
        print("  [OK] Fund Comparison Matrix test passed.")

    def test_03_notifications_system(self):
        headers = {"Authorization": f"Bearer {self.investor_token}"}
        res = self.client.get("/notifications/", headers=headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("notifications", data)
        print("  [OK] Notifications System test passed.")

    def test_04_reports_and_csv_export(self):
        headers = {"Authorization": f"Bearer {self.investor_token}"}
        res = self.client.get("/reports/portfolio", headers=headers)
        self.assertEqual(res.status_code, 200)
        self.assertIn("report_title", res.json())

        csv_res = self.client.get("/reports/export/portfolio", headers=headers)
        self.assertEqual(csv_res.status_code, 200)
        self.assertIn("text/csv", csv_res.headers["content-type"])
        print("  [OK] Reports & CSV Export test passed.")

    def test_05_admin_master_control_and_rbac(self):
        admin_headers = {"Authorization": f"Bearer {self.admin_token}"}
        investor_headers = {"Authorization": f"Bearer {self.investor_token}"}

        # Test Admin access
        status_res = self.client.get("/admin/system-status", headers=admin_headers)
        self.assertEqual(status_res.status_code, 200)
        self.assertEqual(status_res.json()["database"]["status"], "HEALTHY")

        logs_res = self.client.get("/admin/logs", headers=admin_headers)
        self.assertEqual(logs_res.status_code, 200)

        # Test Non-Admin 403 Forbidden
        forbidden_res = self.client.get("/admin/system-status", headers=investor_headers)
        self.assertEqual(forbidden_res.status_code, 403)
        print("  [OK] Admin Master Control & 403 Protection test passed.")

if __name__ == "__main__":
    unittest.main()
