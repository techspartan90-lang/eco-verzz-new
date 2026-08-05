import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.government import (
    StandardResponse,
    GovernmentSchemeResponse,
    VolunteerRegister,
    VolunteerResponse,
    ComplaintCreate,
    ComplaintResponse,
    TreePlantationCreate,
    TreePlantationResponse,
    WaterReportCreate,
    WaterReportResponse,
    PollutionReportCreate,
    PollutionReportResponse,
    FeedbackCreate,
    FeedbackResponse,
    CarbonActivityCreate,
    CarbonActivityResponse,
    NewsResponse,
    EventResponse
)
from app.services.government_service import GovernmentService

router = APIRouter(
    prefix="/government",
    tags=["Government Schemes & Environmental Awareness Hub"]
)


# ==========================================
# SEED DATABASES
# ==========================================
@router.post("/seed", response_model=StandardResponse, status_code=status.HTTP_201_CREATED)
def seed_government_schemes(db: Session = Depends(get_db)):
    service = GovernmentService(db)
    msg = service.seed_schemes()
    return StandardResponse(success=True, message=msg)


# ==========================================
# GET SCHEMES
# ==========================================
@router.get("/schemes", response_model=StandardResponse)
def get_all_schemes(db: Session = Depends(get_db)):
    service = GovernmentService(db)
    # Autoseed if database is empty on first request
    service.seed_schemes()
    schemes = service.get_schemes()
    return StandardResponse(
        success=True,
        message="Schemes loaded successfully",
        data=[GovernmentSchemeResponse.model_validate(s) for s in schemes]
    )


@router.get("/schemes/{scheme_id}", response_model=StandardResponse)
def get_scheme_by_id(scheme_id: uuid.UUID, db: Session = Depends(get_db)):
    service = GovernmentService(db)
    scheme = service.get_scheme_by_id(scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return StandardResponse(
        success=True,
        message="Scheme details loaded successfully",
        data=GovernmentSchemeResponse.model_validate(scheme)
    )


@router.get("/schemes/state/{state}", response_model=StandardResponse)
def get_schemes_by_state(state: str, db: Session = Depends(get_db)):
    service = GovernmentService(db)
    analytics = service.get_global_analytics()
    state_coverage = [x for x in analytics["state_wise_coverage"] if x["state"].lower() == state.lower()]
    if not state_coverage:
        # Default mock if state not found
        state_coverage = [{"state": state, "participation": 1200, "trees_planted": 180, "co2_offset_ton": 45.8}]
    return StandardResponse(
        success=True,
        message=f"State implementation details for {state} loaded",
        data=state_coverage[0]
    )


# ==========================================
# VOLUNTEERS
# ==========================================
@router.post("/volunteer/register", response_model=StandardResponse)
def register_volunteer(
    payload: VolunteerRegister,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GovernmentService(db)
    volunteer = service.register_volunteer(current_user.id, payload.scheme_id, payload.event_id)
    return StandardResponse(
        success=True,
        message="Successfully registered as a volunteer!",
        data=VolunteerResponse.model_validate(volunteer)
    )


# ==========================================
# COMPLAINTS (Swachh Bharat)
# ==========================================
@router.post("/complaints", response_model=StandardResponse)
def create_complaint(
    payload: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GovernmentService(db)
    # Map to generic waste complaint or custom model
    # We can reuse the waste report creation logic or create a custom pollution/cleanliness report
    report = service.log_pollution_report(
        user_id=current_user.id,
        pollution_type="WASTE_DUMP",
        description=f"[{payload.category} - {payload.priority}] {payload.description}",
        location=payload.location,
        latitude=12.9716,
        longitude=77.5946
    )
    return StandardResponse(
        success=True,
        message="Cleanliness complaint filed successfully!",
        data=PollutionReportResponse.model_validate(report)
    )


# ==========================================
# TREE PLANTATION (Green India)
# ==========================================
@router.post("/tree-plantation", response_model=StandardResponse)
def log_tree_plantation(
    payload: TreePlantationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GovernmentService(db)
    plantation = service.log_tree_plantation(current_user.id, payload.tree_species, payload.latitude, payload.longitude)
    return StandardResponse(
        success=True,
        message="Tree plantation logged and verified successfully!",
        data=TreePlantationResponse.model_validate(plantation)
    )


# ==========================================
# WATER REPORT (Jal Jeevan)
# ==========================================
@router.post("/water-report", response_model=StandardResponse)
def log_water_report(
    payload: WaterReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GovernmentService(db)
    report = service.log_water_activity(current_user.id, payload.category, payload.description)
    return StandardResponse(
        success=True,
        message="Water activity logged successfully!",
        data=WaterReportResponse.model_validate(report)
    )


# ==========================================
# POLLUTION REPORT (CPCB)
# ==========================================
@router.post("/pollution-report", response_model=StandardResponse)
def log_pollution_report(
    payload: PollutionReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GovernmentService(db)
    report = service.log_pollution_report(
        user_id=current_user.id,
        pollution_type=payload.pollution_type,
        description=payload.description,
        location=payload.location,
        latitude=payload.latitude,
        longitude=payload.longitude
    )
    return StandardResponse(
        success=True,
        message="Pollution incident reported successfully!",
        data=PollutionReportResponse.model_validate(report)
    )


# ==========================================
# REWARDS / CARBON LOGS (Mission LiFE)
# ==========================================
@router.post("/carbon-activity", response_model=StandardResponse)
def log_carbon_activity(
    payload: CarbonActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GovernmentService(db)
    activity = service.log_carbon_activity(current_user.id, payload.category, payload.value)
    return StandardResponse(
        success=True,
        message="Eco-audit activity saved successfully!",
        data=CarbonActivityResponse.model_validate(activity)
    )


# ==========================================
# GLOBAL ANALYTICS
# ==========================================
@router.get("/analytics", response_model=StandardResponse)
def get_global_analytics(db: Session = Depends(get_db)):
    service = GovernmentService(db)
    analytics = service.get_global_analytics()
    return StandardResponse(
        success=True,
        message="Global environmental metrics loaded successfully",
        data=analytics
    )


# ==========================================
# USER DASHBOARD SUMMARY
# ==========================================
@router.get("/dashboard", response_model=StandardResponse)
def get_user_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GovernmentService(db)
    summary = service.get_user_dashboard_summary(current_user.id)
    return StandardResponse(
        success=True,
        message="User schemes dashboard loaded successfully",
        data=summary
    )


# ==========================================
# LEADERBOARD
# ==========================================
@router.get("/leaderboard", response_model=StandardResponse)
def get_leaderboard(db: Session = Depends(get_db)):
    # Standard mock leaderboard
    data = [
        {"username": "Aditya_V", "ecoPoints": 1540, "rank": "Emerald Guardian"},
        {"username": "Priya_N", "ecoPoints": 1420, "rank": "Forest Champion"},
        {"username": "Rahul_S", "ecoPoints": 1150, "rank": "Water Savior"},
        {"username": "Guest", "ecoPoints": 0, "rank": "Guest Explorer"}
    ]
    return StandardResponse(
        success=True,
        message="Leaderboard loaded successfully",
        data=data
    )


# ==========================================
# NEWS & EVENTS
# ==========================================
@router.get("/news", response_model=StandardResponse)
def get_news(db: Session = Depends(get_db)):
    service = GovernmentService(db)
    news = service.repo.get_news()
    return StandardResponse(
        success=True,
        message="Announcements loaded successfully",
        data=[NewsResponse.model_validate(n) for n in news]
    )


@router.get("/events", response_model=StandardResponse)
def get_events(db: Session = Depends(get_db)):
    service = GovernmentService(db)
    events = service.repo.get_events()
    return StandardResponse(
        success=True,
        message="Event calendar loaded successfully",
        data=[EventResponse.model_validate(e) for e in events]
    )


# ==========================================
# FEEDBACK
# ==========================================
@router.post("/feedback", response_model=StandardResponse)
def submit_feedback(
    payload: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GovernmentService(db)
    fb = FeedbackResponse(
        id=uuid.uuid4(),
        user_id=current_user.id,
        scheme_id=payload.scheme_id,
        rating=payload.rating,
        comment=payload.comment,
        created_at=datetime.utcnow()
    )
    return StandardResponse(
        success=True,
        message="Thank you for your valuable feedback!",
        data=fb
    )
