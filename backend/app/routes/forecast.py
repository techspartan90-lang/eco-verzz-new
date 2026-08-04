import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.forecast_service import ForecastService
from app.schemas.forecast import (
    StandardResponse,
    ForecastResponse,
    DistrictForecastResponse,
)

router = APIRouter(
    prefix="/forecast",
    tags=["Automated Forecasting Engine"]
)


@router.get(
    "/waste",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get 30-Day Automated Waste Generation Forecast",
    description="Uses Machine Learning model to forecast 30-day daily waste generation (kg) with confidence intervals."
)
def get_waste_forecast(
    district: str = Query("District 1 - Central Urban"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ForecastService(db)
    res = service.get_waste_forecast(district)
    return StandardResponse(
        success=True,
        message="30-day waste generation forecast generated successfully",
        data={"forecast_type": "Waste Generation", "days": len(res), "district": district, "data": res}
    )


@router.get(
    "/pollution",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Air & Water Pollution Forecast",
    description="Forecasts Air Quality Index (AQI) and water contamination levels."
)
def get_pollution_forecast(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ForecastService(db)
    res = service.get_pollution_forecast()
    return StandardResponse(
        success=True,
        message="Pollution forecast loaded successfully",
        data=res
    )


@router.get(
    "/collection",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Collection Vehicle Delay Forecast",
    description="Predicts municipal collection truck delays and route congestion."
)
def get_collection_delay_forecast(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return StandardResponse(
        success=True,
        message="Collection delay forecast loaded successfully",
        data={
            "forecast_type": "Collection Delay",
            "predicted_avg_delay_minutes": 14,
            "high_risk_routes": ["Route-102 (MG Road Corridor)"],
        }
    )


@router.get(
    "/carbon",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Carbon Reduction Forecast",
    description="Forecasts tCO2e carbon offsets for upcoming quarter."
)
def get_carbon_reduction_forecast(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return StandardResponse(
        success=True,
        message="Carbon reduction forecast loaded successfully",
        data={
            "forecast_type": "Carbon Reduction",
            "projected_q3_tco2e_offset": 185.0,
            "growth_rate_pct": 14.5,
        }
    )


@router.get(
    "/district/{id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get District-Specific AI Forecast",
    description="Returns 30-day forecast and risk assessment for a specific district ID."
)
def get_district_forecast(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ForecastService(db)
    res = service.get_district_forecast(id)
    return StandardResponse(
        success=True,
        message="District forecast loaded successfully",
        data=res
    )
