import json
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.investor_profile import InvestorProfile
from app.models.ai_recommendation import AIRecommendation
from app.models.portfolio import Portfolio
from app.models.portfolio_holding import PortfolioHolding
from app.schemas.ai import (
    InvestorProfileCreate,
    InvestorProfileUpdate,
    InvestorProfileResponse,
    RecommendationGenerateRequest,
    RecommendationResponse,
    StandardResponse,
)
from app.ai.ml_pipeline import MLEnginePipeline
from app.services.ai_service import AIService

router = APIRouter(
    prefix="/ai",
    tags=["AI Recommendation & Waste Classification Engine"]
)


def get_or_create_profile(db: Session, user: User) -> InvestorProfile:
    profile = db.query(InvestorProfile).filter(InvestorProfile.user_id == user.id).first()
    if not profile:
        profile = InvestorProfile(
            user_id=user.id,
            age=30,
            annual_income=1200000.0,
            investment_experience="Intermediate",
            risk_tolerance="Moderate",
            investment_goal="ESG Wealth Accumulation",
            monthly_investment=25000.0,
            investment_horizon=5,
            liquidity_requirement="Medium",
            preferred_categories="Equity ESG, Clean Tech",
            tax_bracket="30%",
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


# =========================================================================
# PHASE 11: AI WASTE CLASSIFICATION ENGINE ENDPOINTS
# =========================================================================

@router.post(
    "/predict",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Run AI Object Detection & Waste Classification",
    description="Uploads an image file, runs OpenCV preprocessing, PyTorch/YOLOv8 inference session, draws bounding box overlays, calculates eco points, and generates recycling recommendations."
)
def predict_waste_image(
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AIService(db)
    result = service.predict_image(current_user, image)
    return StandardResponse(
        success=True,
        message="Prediction completed successfully",
        data=result
    )


@router.post(
    "/predict/report/{report_id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Run AI Prediction for Existing Waste Report",
    description="Fetches an existing waste report by UUID, runs object detection classification on its uploaded photo, updates eco points and report status."
)
def predict_report_by_id(
    report_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AIService(db)
    result = service.predict_existing_report(current_user, report_id)
    return StandardResponse(
        success=True,
        message="Report prediction completed successfully",
        data=result
    )


@router.get(
    "/history",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get AI Classification Prediction History",
    description="Returns chronological audit history of AI predictions and bounding box annotated images. Citizens access only their predictions, Admins access all."
)
def get_prediction_history(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AIService(db)
    history = service.get_history(current_user, limit)
    return StandardResponse(
        success=True,
        message="Prediction history retrieved successfully",
        data=[
            {
                "id": str(h.id),
                "report_id": str(h.report_id) if h.report_id else None,
                "predicted_category": h.predicted_category,
                "confidence": h.confidence,
                "eco_points": h.eco_points,
                "recycling_method": h.recycling_method,
                "environmental_impact": h.environmental_impact,
                "image_path": h.image_path,
                "annotated_image": h.annotated_image,
                "processing_time": h.processing_time,
                "model_name": h.model_name,
                "created_at": h.created_at.isoformat(),
            }
            for h in history
        ]
    )


@router.get(
    "/prediction/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get AI Prediction Details by ID",
    description="Returns full prediction record by UUID including confidence, eco points, bounding box annotated image, and impact analysis."
)
def get_prediction_by_id(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AIService(db)
    pred = service.get_prediction_by_id(id, current_user)
    return StandardResponse(
        success=True,
        message="Prediction details retrieved successfully",
        data={
            "id": str(pred.id),
            "report_id": str(pred.report_id) if pred.report_id else None,
            "user_id": str(pred.user_id),
            "predicted_category": pred.predicted_category,
            "confidence": pred.confidence,
            "eco_points": pred.eco_points,
            "recycling_method": pred.recycling_method,
            "environmental_impact": pred.environmental_impact,
            "image_path": pred.image_path,
            "annotated_image": pred.annotated_image,
            "processing_time": pred.processing_time,
            "model_name": pred.model_name,
            "created_at": pred.created_at.isoformat(),
        }
    )


@router.delete(
    "/prediction/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete AI Prediction Record",
    description="Deletes an AI prediction record by UUID. Users access only their predictions."
)
def delete_prediction_by_id(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AIService(db)
    service.delete_prediction(id, current_user)
    return StandardResponse(
        success=True,
        message="Prediction record deleted successfully",
        data={"id": str(id)}
    )


@router.get(
    "/models",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Installed AI Models & Hardware Device Status",
    description="Returns active AI model architecture, CUDA GPU vs CPU device status, and supported backend inference frameworks."
)
def get_installed_ai_models(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AIService(db)
    models_info = service.get_installed_models()
    return StandardResponse(
        success=True,
        message="AI models metadata loaded successfully",
        data=models_info
    )


# =========================================================================
# EXISTING RECOMMENDATION ENGINE ENDPOINTS
# =========================================================================

@router.get("/profile", response_model=InvestorProfileResponse)
def get_investor_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_or_create_profile(db, current_user)
    return profile


@router.post("/profile", response_model=InvestorProfileResponse, status_code=status.HTTP_201_CREATED)
def create_investor_profile(
    payload: InvestorProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(InvestorProfile).filter(InvestorProfile.user_id == current_user.id).first()
    if existing:
        for key, val in payload.model_dump().items():
            setattr(existing, key, val)
        db.commit()
        db.refresh(existing)
        return existing

    profile = InvestorProfile(
        user_id=current_user.id,
        **payload.model_dump()
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.put("/profile", response_model=InvestorProfileResponse)
def update_investor_profile(
    payload: InvestorProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_or_create_profile(db, current_user)

    for key, val in payload.model_dump(exclude_unset=True).items():
        setattr(profile, key, val)

    db.commit()
    db.refresh(profile)
    return profile


@router.get("/recommendations", response_model=List[RecommendationResponse])
def get_user_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recs = db.query(AIRecommendation).filter(
        AIRecommendation.user_id == current_user.id
    ).order_by(AIRecommendation.created_at.desc()).all()

    return recs


@router.post("/recommend", response_model=RecommendationResponse, status_code=status.HTTP_201_CREATED)
def generate_recommendation(
    payload: Optional[RecommendationGenerateRequest] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_or_create_profile(db, current_user)

    # Classify risk using ML model
    classified_risk = MLEnginePipeline.classify_risk_profile(
        age=profile.age,
        income=profile.annual_income,
        experience=profile.investment_experience,
        horizon=profile.investment_horizon,
        self_risk=profile.risk_tolerance,
    )

    # Predict CAGR & Rank Funds
    expected_cagr = MLEnginePipeline.predict_expected_return(classified_risk, profile.investment_horizon)
    top_funds = MLEnginePipeline.rank_top_funds(classified_risk, profile.monthly_investment)

    confidence_score = min(98.5, max(88.0, 92.0 + (profile.investment_horizon * 0.8)))
    expected_risk_score = 4.2 if classified_risk == "Moderate" else 6.8 if classified_risk == "High" else 2.5

    explanation = (
        f"Based on your {classified_risk} risk profile, age {profile.age}, annual income ₹{profile.annual_income:,.0f}, "
        f"and {profile.investment_horizon}-year horizon for '{profile.investment_goal}', our Scikit-Learn & Joblib ML engine "
        f"recommends an ESG allocation of ₹{profile.monthly_investment:,.0f}/month across top {len(top_funds)} funds. "
        f"Expected CAGR is {expected_cagr}% with {confidence_score:.1f}% confidence."
    )

    rec_json = json.dumps({
        "risk_profile": classified_risk,
        "monthly_investment": profile.monthly_investment,
        "investment_horizon": profile.investment_horizon,
        "top_funds": top_funds,
        "portfolio_impact": {
            "cagr_boost": "+4.2%",
            "carbon_offset_tons": round(profile.monthly_investment * 0.0004 * 12, 1),
            "esg_score_boost": "+12 Points"
        }
    })

    rec = AIRecommendation(
        user_id=current_user.id,
        portfolio_id=payload.portfolio_id if payload else None,
        recommendation_type="Personalized ESG Allocation",
        confidence_score=round(confidence_score, 1),
        expected_return=expected_cagr,
        expected_risk=expected_risk_score,
        recommendation_json=rec_json,
        explanation=explanation,
    )

    db.add(rec)
    db.commit()
    db.refresh(rec)

    return rec


@router.get("/portfolio-analysis")
def get_portfolio_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    holdings = []
    if portfolio:
        raw_h = db.query(PortfolioHolding).filter(PortfolioHolding.portfolio_id == portfolio.id).all()
        holdings = [
            {
                "fund_name": h.fund_name,
                "current_value": h.current_value,
                "gain_loss_percentage": h.gain_loss_percentage,
                "sector": h.sector,
            }
            for h in raw_h
        ]

    analysis = MLEnginePipeline.evaluate_portfolio_health(holdings)
    return {
        "user_email": current_user.email,
        "portfolio_id": str(portfolio.id) if portfolio else None,
        **analysis,
    }


@router.get("/risk-analysis")
def get_risk_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_or_create_profile(db, current_user)
    risk_class = MLEnginePipeline.classify_risk_profile(
        age=profile.age,
        income=profile.annual_income,
        experience=profile.investment_experience,
        horizon=profile.investment_horizon,
        self_risk=profile.risk_tolerance,
    )

    return {
        "risk_profile": risk_class,
        "risk_score": 4.2 if risk_class == "Moderate" else 7.2 if risk_class == "High" else 2.4,
        "volatility_pct": 12.8,
        "stress_test_scenarios": [
            {"scenario": "Market Rally (+20%)", "projected_gain": "+24.5%"},
            {"scenario": "Market Correction (-15%)", "projected_impact": "-7.8%"},
            {"scenario": "Green Policy Booster", "projected_gain": "+31.2%"},
        ],
    }


@router.get("/diversification")
def get_diversification_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    holdings = []
    if portfolio:
        raw_h = db.query(PortfolioHolding).filter(PortfolioHolding.portfolio_id == portfolio.id).all()
        holdings = [
            {
                "fund_name": h.fund_name,
                "current_value": h.current_value,
                "sector": h.sector,
            }
            for h in raw_h
        ]

    analysis = MLEnginePipeline.evaluate_portfolio_health(holdings)
    return {
        "diversification_score": portfolio.diversification_score if portfolio else 8.5,
        "sector_overexposure_warnings": analysis["overexposed_sectors"],
        "sector_distribution": analysis["sector_distribution"],
        "amc_distribution": [
            {"amc": "EcoVerzz Asset Management", "weight": 40.0},
            {"amc": "SBI Mutual Fund", "weight": 25.0},
            {"amc": "HDFC Mutual Fund", "weight": 20.0},
            {"amc": "Axis Mutual Fund", "weight": 15.0},
        ],
    }


@router.get("/rebalance")
def get_rebalance_suggestions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_or_create_profile(db, current_user)
    portfolio = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).first()
    holdings = []
    if portfolio:
        raw_h = db.query(PortfolioHolding).filter(PortfolioHolding.portfolio_id == portfolio.id).all()
        holdings = [
            {
                "category": h.category,
                "current_value": h.current_value,
            }
            for h in raw_h
        ]

    plan = MLEnginePipeline.generate_rebalance_plan(holdings, profile.risk_tolerance)
    return plan
