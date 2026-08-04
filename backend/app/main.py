from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware

from app.database.connection import engine
from app.database.base import Base
import app.models.user
import app.models.fund
import app.models.notification
import app.models.portfolio
import app.models.portfolio_holding
import app.models.transaction
import app.models.investor_profile
import app.models.ai_recommendation
import app.models.comparison_history
import app.models.saved_comparison
import app.models.badge
import app.models.eco_point_history
import app.models.waste_report
import app.models.waste_image
import app.models.ai_prediction
import app.models.admin_log
import app.models.message
import app.models.chat_room
import app.models.emergency_alert
import app.models.device
import app.models.sensor
import app.models.environment_data
import app.models.collection_vehicle
import app.models.location
import app.models.wallet
import app.models.reward
import app.models.carbon_credit
import app.models.coupon
import app.models.marketplace_item
import app.models.prediction
import app.models.forecast
import app.models.analytics
import app.models.recommendation

import os
from fastapi.staticfiles import StaticFiles

from app.routes.user import router as user_router
from app.routes.auth import router as auth_router
from app.routes.recommendations import router as recommendations_router
from app.routes.funds import router as funds_router
from app.routes.notifications import router as notifications_router
from app.routes.reports import router as reports_router
from app.routes.admin import router as admin_router
from app.routes.portfolio import router as portfolio_router
from app.routes.ai import router as ai_router
from app.routes.analytics import router as analytics_router
from app.routes.dashboard import router as dashboard_router
from app.routes.waste import router as waste_router
from app.routes.chat import router as chat_router
from app.routes.alert import router as alert_router
from app.routes.device import router as device_router
from app.routes.sensor import router as sensor_router
from app.routes.gis import router as gis_router
from app.routes.wallet import router as wallet_router
from app.routes.reward import router as reward_router
from app.routes.marketplace import router as marketplace_router
from app.routes.blockchain import router as blockchain_router
from app.routes.forecast import router as forecast_router
from app.routes.prediction import router as prediction_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="EcoVerzz AI",
    version="1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SecurityHeadersMiddleware)

base_dir = os.path.dirname(os.path.abspath(__file__))
static_reports_dir = os.path.join(base_dir, "static")
static_annotated_dir = os.path.join(static_reports_dir, "annotated")
uploads_dir = os.path.join(base_dir, "uploads")
uploads_predictions_dir = os.path.join(uploads_dir, "predictions")

os.makedirs(static_reports_dir, exist_ok=True)
os.makedirs(static_annotated_dir, exist_ok=True)
os.makedirs(uploads_dir, exist_ok=True)
os.makedirs(uploads_predictions_dir, exist_ok=True)

app.mount("/static", StaticFiles(directory=static_reports_dir), name="static")
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(recommendations_router)
app.include_router(funds_router)
app.include_router(notifications_router)
app.include_router(reports_router)
app.include_router(admin_router)
app.include_router(portfolio_router)
app.include_router(ai_router)
app.include_router(analytics_router)
app.include_router(dashboard_router)
app.include_router(waste_router)
app.include_router(chat_router)
app.include_router(alert_router)
app.include_router(device_router)
app.include_router(sensor_router)
app.include_router(gis_router)
app.include_router(wallet_router)
app.include_router(reward_router)
app.include_router(marketplace_router)
app.include_router(blockchain_router)
app.include_router(forecast_router)
app.include_router(prediction_router)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="EcoVerzz AI",
    version="1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

base_dir = os.path.dirname(os.path.abspath(__file__))
static_reports_dir = os.path.join(base_dir, "static")
static_annotated_dir = os.path.join(static_reports_dir, "annotated")
uploads_dir = os.path.join(base_dir, "uploads")
uploads_predictions_dir = os.path.join(uploads_dir, "predictions")

os.makedirs(static_reports_dir, exist_ok=True)
os.makedirs(static_annotated_dir, exist_ok=True)
os.makedirs(uploads_dir, exist_ok=True)
os.makedirs(uploads_predictions_dir, exist_ok=True)

app.mount("/static", StaticFiles(directory=static_reports_dir), name="static")
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(recommendations_router)
app.include_router(funds_router)
app.include_router(notifications_router)
app.include_router(reports_router)
app.include_router(admin_router)
app.include_router(portfolio_router)
app.include_router(ai_router)
app.include_router(analytics_router)
app.include_router(dashboard_router)
app.include_router(waste_router)
app.include_router(chat_router)
app.include_router(alert_router)
app.include_router(device_router)
app.include_router(sensor_router)
app.include_router(gis_router)
app.include_router(wallet_router)
app.include_router(reward_router)
app.include_router(marketplace_router)
app.include_router(blockchain_router)




@app.get("/")
def home():
    return {
        "status": "running",
        "project": "EcoVerzz AI"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "service": "EcoVerzz FastAPI Backend",
        "version": "1.0"
    }


