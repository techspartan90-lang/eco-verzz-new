import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app as fastapi_app
from app.database.connection import engine
from app.database.base import Base
import app.models.government as gov_models

client = TestClient(fastapi_app)

def test_government_schemes_hub():
    print("\n" + "=" * 60)
    print("Starting Automated E2E Government Schemes Hub Test Suite")
    print("=" * 60)

    # Force table creation for new models
    Base.metadata.create_all(bind=engine)

    # 1. Register a test user to obtain credentials
    unique_suffix = str(uuid.uuid4())[:8]
    user_payload = {
        "full_name": "Siddharth Sharma",
        "email": f"siddharth_{unique_suffix}@ecoverzz.io",
        "password": "Password123!",
        "phone": "+919876543210",
        "role": "Investor"
    }
    
    reg_res = client.post("/auth/register", json=user_payload)
    assert reg_res.status_code == 200, f"User registration failed: {reg_res.text}"
    reg_data = reg_res.json()
    token = reg_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[PASS] Test User Registered successfully.")

    # 2. Test Schemes Seeding and Retrieval
    schemes_res = client.get("/government/schemes")
    assert schemes_res.status_code == 200, f"Failed to retrieve schemes: {schemes_res.text}"
    schemes_data = schemes_res.json()
    assert schemes_data["success"] is True
    assert len(schemes_data["data"]) == 11, f"Expected 11 schemes, found {len(schemes_data['data'])}"
    print("[PASS] Schemes auto-seeded and verified 11 environmental missions.")

    # Fetch a single scheme ID
    first_scheme = schemes_data["data"][0]
    scheme_id = first_scheme["id"]
    print(f"First scheme: {first_scheme['title']} (ID: {scheme_id})")

    # 3. Test Retrieve Scheme Details by ID
    details_res = client.get(f"/government/schemes/{scheme_id}")
    assert details_res.status_code == 200
    details_data = details_res.json()
    assert details_data["data"]["title"] == first_scheme["title"]
    print("[PASS] Scheme details retrieved by ID successfully.")

    # 4. Test Retrieve Schemes by State
    state_res = client.get("/government/schemes/state/Gujarat")
    assert state_res.status_code == 200
    state_data = state_res.json()
    assert "participation" in state_data["data"]
    print("[PASS] State implementation details retrieved successfully.")

    # 5. Test Volunteer Registration
    # Find an event ID from the scheme
    event_id = first_scheme["events"][0]["id"] if first_scheme["events"] else None
    volunteer_payload = {
        "scheme_id": scheme_id,
        "event_id": event_id
    }
    vol_res = client.post("/government/volunteer/register", json=volunteer_payload, headers=headers)
    assert vol_res.status_code == 200, f"Volunteering failed: {vol_res.text}"
    vol_data = vol_res.json()
    assert vol_data["data"]["status"] == "APPROVED"
    print("[PASS] Registered volunteer for event.")

    # 6. Test Swachh Bharat cleanliness complaint
    complaint_payload = {
        "title": "Unsorted waste dump in market",
        "description": "Large pile of plastic wraps and organic food scraps at main circle.",
        "location": "Sector 11, Ahmedabad",
        "category": "PLASTIC",
        "priority": "HIGH"
    }
    comp_res = client.post("/government/complaints", json=complaint_payload, headers=headers)
    assert comp_res.status_code == 200, f"Filing complaint failed: {comp_res.text}"
    comp_data = comp_res.json()
    assert comp_data["data"]["status"] == "PENDING"
    print("[PASS] Swachh Bharat cleanliness complaint filed.")

    # 7. Test Green India Tree afforestation
    plantation_payload = {
        "tree_species": "NEEM",
        "latitude": 23.0225,
        "longitude": 72.5714
    }
    plant_res = client.post("/government/tree-plantation", json=plantation_payload, headers=headers)
    assert plant_res.status_code == 200
    plant_data = plant_res.json()
    assert plant_data["data"]["status"] == "VERIFIED"
    assert plant_data["data"]["carbon_sequestered"] == 22.0
    print("[PASS] Tree plantation logged and carbon sequestration tracked.")

    # 8. Test Jal Jeevan water logging
    water_payload = {
        "category": "Quality Audit",
        "description": "Assessed water source in local school; pH levels are optimal."
    }
    water_res = client.post("/government/water-report", json=water_payload, headers=headers)
    assert water_res.status_code == 200
    water_data = water_res.json()
    assert water_data["data"]["status"] == "PENDING"
    print("[PASS] Jal Jeevan water activity reported.")

    # 9. Test CPCB pollution incident report
    pollution_payload = {
        "pollution_type": "AIR",
        "description": "Industrial furnace releasing black smog during evening hours.",
        "location": "GIDC Vatva Industrial Area",
        "latitude": 22.9554,
        "longitude": 72.6341
    }
    pol_res = client.post("/government/pollution-report", json=pollution_payload, headers=headers)
    assert pol_res.status_code == 200
    pol_data = pol_res.json()
    assert pol_data["data"]["status"] == "PENDING"
    print("[PASS] CPCB pollution incident reported.")

    # 10. Test Mission LiFE carbon activity log
    carbon_payload = {
        "category": "transport",
        "value": 15.5
    }
    carb_res = client.post("/government/carbon-activity", json=carbon_payload, headers=headers)
    assert carb_res.status_code == 200
    carb_data = carb_res.json()
    assert carb_data["data"]["co2_saved"] > 0
    assert carb_data["data"]["points_earned"] > 0
    print("[PASS] Mission LiFE carbon saving activity logged.")

    # 11. Test Global Analytics
    anal_res = client.get("/government/analytics")
    assert anal_res.status_code == 200
    anal_data = anal_res.json()
    assert "national_stats" in anal_data["data"]
    assert "aqi_trends" in anal_data["data"]
    print("[PASS] Global environmental analytics loaded.")

    # 12. Test User Dashboard Summary
    dash_res = client.get("/government/dashboard", headers=headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert "user_stats" in dash_data["data"]
    assert len(dash_data["data"]["daily_challenges"]) > 0
    print("[PASS] User schemes dashboard statistics verified.")

    # 13. Test News and Announcements
    news_res = client.get("/government/news")
    assert news_res.status_code == 200
    assert len(news_res.json()["data"]) > 0
    print("[PASS] Government announcements retrieved successfully.")

    # 14. Test Events Calendar
    events_res = client.get("/government/events")
    assert events_res.status_code == 200
    assert len(events_res.json()["data"]) > 0
    print("[PASS] Upcoming environmental events loaded.")

    # 15. Test Citizen Feedback
    feed_payload = {
        "scheme_id": scheme_id,
        "rating": 5,
        "comment": "Mission LiFE challenges are highly motivating!"
    }
    feed_res = client.post("/government/feedback", json=feed_payload, headers=headers)
    assert feed_res.status_code == 200
    feed_data = feed_res.json()
    assert feed_data["data"]["rating"] == 5
    print("[PASS] Citizen feedback submitted.")

    print("\n" + "=" * 60)
    print("ALL 15 SUB-TESTS IN THE GOVERNMENT SCHEMES HUB PASSED SUCCESSFULLY!")
    print("=" * 60 + "\n")
