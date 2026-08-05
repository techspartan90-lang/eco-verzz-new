import uuid
from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, ConfigDict


# FAQ Schema
class FAQBase(BaseModel):
    question: str
    answer: str

class FAQResponse(FAQBase):
    id: uuid.UUID
    scheme_id: uuid.UUID
    model_config = ConfigDict(from_attributes=True)


# Downloads Schema
class DownloadBase(BaseModel):
    title: str
    file_url: str

class DownloadResponse(DownloadBase):
    id: uuid.UUID
    scheme_id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Media Schema
class MediaBase(BaseModel):
    title: str
    type: str  # IMAGE, VIDEO
    url: str

class MediaResponse(MediaBase):
    id: uuid.UUID
    scheme_id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# News Schema
class NewsBase(BaseModel):
    title: str
    content: str

class NewsResponse(NewsBase):
    id: uuid.UUID
    scheme_id: uuid.UUID
    published_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Event Schema
class EventBase(BaseModel):
    title: str
    description: str
    event_date: datetime
    location: str
    max_volunteers: int

class EventResponse(EventBase):
    id: uuid.UUID
    scheme_id: uuid.UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Government Scheme Schemas
class GovernmentSchemeBase(BaseModel):
    name: str
    title: str
    description: str
    overview: str
    objectives: str
    vision_mission: str
    ministry: str
    launch_year: int
    eligibility: str
    benefits: str
    target_beneficiaries: str
    current_progress: str
    state_implementation: str
    guidelines: str
    official_links: Optional[dict] = None

class GovernmentSchemeCreate(GovernmentSchemeBase):
    pass

class GovernmentSchemeResponse(GovernmentSchemeBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    news: List[NewsResponse] = []
    events: List[EventResponse] = []
    faqs: List[FAQResponse] = []
    downloads: List[DownloadResponse] = []
    media: List[MediaResponse] = []
    model_config = ConfigDict(from_attributes=True)


# Volunteer Schemas
class VolunteerRegister(BaseModel):
    scheme_id: uuid.UUID
    event_id: Optional[uuid.UUID] = None

class VolunteerResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    scheme_id: uuid.UUID
    event_id: Optional[uuid.UUID] = None
    status: str
    registered_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Complaint / Waste Report (Swachh Bharat)
class ComplaintCreate(BaseModel):
    title: str
    description: str
    location: str
    category: str
    priority: str

class ComplaintResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    description: str
    location: str
    category: str
    priority: str
    status: str
    reported_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Tree Plantation (Green India)
class TreePlantationCreate(BaseModel):
    tree_species: str
    latitude: float
    longitude: float

class TreePlantationResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    tree_species: str
    latitude: float
    longitude: float
    status: str
    carbon_sequestered: float
    planted_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Water Leakage / Quality Report (Jal Jeevan)
class WaterReportCreate(BaseModel):
    category: str  # Quality, Leakage, Conservation
    description: str

class WaterReportResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    category: str
    description: str
    status: str
    logged_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Pollution Report (CPCB)
class PollutionReportCreate(BaseModel):
    pollution_type: str  # AIR, WATER, NOISE
    description: str
    location: str
    latitude: float
    longitude: float

class PollutionReportResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    pollution_type: str
    description: str
    location: str
    latitude: float
    longitude: float
    status: str
    reported_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Feedback Schema
class FeedbackCreate(BaseModel):
    scheme_id: uuid.UUID
    rating: int  # 1 to 5
    comment: str

class FeedbackResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    scheme_id: uuid.UUID
    rating: int
    comment: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Carbon Activity Schema
class CarbonActivityCreate(BaseModel):
    category: str
    value: float

class CarbonActivityResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    category: str
    value: float
    co2_saved: float
    points_earned: int
    logged_at: datetime
    model_config = ConfigDict(from_attributes=True)


# General Response Schema
class StandardResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
