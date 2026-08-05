import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database.base import Base


class GovernmentScheme(Base):
    __tablename__ = "government_schemes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    overview: Mapped[str] = mapped_column(Text, nullable=False)
    objectives: Mapped[str] = mapped_column(Text, nullable=False)
    vision_mission: Mapped[str] = mapped_column(Text, nullable=False)
    ministry: Mapped[str] = mapped_column(String(255), nullable=False)
    launch_year: Mapped[int] = mapped_column(Integer, nullable=False)
    eligibility: Mapped[str] = mapped_column(Text, nullable=False)
    benefits: Mapped[str] = mapped_column(Text, nullable=False)
    target_beneficiaries: Mapped[str] = mapped_column(Text, nullable=False)
    current_progress: Mapped[str] = mapped_column(Text, nullable=False)
    state_implementation: Mapped[str] = mapped_column(Text, nullable=False)
    guidelines: Mapped[str] = mapped_column(Text, nullable=False)
    official_links: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    news: Mapped[List["GovernmentNews"]] = relationship("GovernmentNews", back_populates="scheme", cascade="all, delete-orphan")
    events: Mapped[List["GovernmentEvent"]] = relationship("GovernmentEvent", back_populates="scheme", cascade="all, delete-orphan")
    faqs: Mapped[List["FAQs"]] = relationship("FAQs", back_populates="scheme", cascade="all, delete-orphan")
    downloads: Mapped[List["Downloads"]] = relationship("Downloads", back_populates="scheme", cascade="all, delete-orphan")
    media: Mapped[List["Media"]] = relationship("Media", back_populates="scheme", cascade="all, delete-orphan")


class GovernmentNews(Base):
    __tablename__ = "government_news"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scheme_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("government_schemes.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    published_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    scheme: Mapped["GovernmentScheme"] = relationship("GovernmentScheme", back_populates="news")


class GovernmentEvent(Base):
    __tablename__ = "government_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scheme_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("government_schemes.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    event_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    max_volunteers: Mapped[int] = mapped_column(Integer, default=100)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    scheme: Mapped["GovernmentScheme"] = relationship("GovernmentScheme", back_populates="events")
    volunteers: Mapped[List["Volunteer"]] = relationship("Volunteer", back_populates="event", cascade="all, delete-orphan")


class Volunteer(Base):
    __tablename__ = "government_volunteers"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    event_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("government_events.id"), nullable=True)
    scheme_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("government_schemes.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="PENDING")  # PENDING, APPROVED, REJECTED
    registered_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    event: Mapped[Optional["GovernmentEvent"]] = relationship("GovernmentEvent", back_populates="volunteers")


class Participation(Base):
    __tablename__ = "government_participations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    scheme_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("government_schemes.id"), nullable=False)
    challenge_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="IN_PROGRESS")  # IN_PROGRESS, COMPLETED
    points_earned: Mapped[int] = mapped_column(Integer, default=0)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Certificate(Base):
    __tablename__ = "government_certificates"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    scheme_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("government_schemes.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    issue_date: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    certificate_url: Mapped[str] = mapped_column(String(255), nullable=False)


class CarbonActivity(Base):
    __tablename__ = "government_carbon_activities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # Transport, Diet, Electricity, etc.
    value: Mapped[float] = mapped_column(Float, nullable=False)
    co2_saved: Mapped[float] = mapped_column(Float, nullable=False)
    points_earned: Mapped[int] = mapped_column(Integer, default=0)
    logged_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class WaterActivity(Base):
    __tablename__ = "government_water_activities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # Quality, Leakage, Conservation
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="PENDING")  # PENDING, INVESTIGATING, RESOLVED
    logged_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class TreePlantation(Base):
    __tablename__ = "government_tree_plantations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    tree_species: Mapped[str] = mapped_column(String(100), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="PLANTED")  # PLANTED, VERIFIED
    carbon_sequestered: Mapped[float] = mapped_column(Float, default=0.0)
    planted_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class PollutionReport(Base):
    __tablename__ = "government_pollution_reports"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    pollution_type: Mapped[str] = mapped_column(String(50), nullable=False)  # AIR, WATER, NOISE
    description: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="PENDING")  # PENDING, INVESTIGATING, RESOLVED
    reported_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class SmartCity(Base):
    __tablename__ = "government_smart_cities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    city_name: Mapped[str] = mapped_column(String(100), nullable=False)
    bin_fill_level: Mapped[float] = mapped_column(Float, default=0.0)  # Percentage
    street_light_status: Mapped[str] = mapped_column(String(50), default="OFF")
    parking_occupancy: Mapped[float] = mapped_column(Float, default=0.0)  # Percentage
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())


class SchemeAnalytics(Base):
    __tablename__ = "government_scheme_analytics"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scheme_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("government_schemes.id"), nullable=False)
    metric_name: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., Trees Planted, CO2 Offset
    metric_value: Mapped[float] = mapped_column(Float, nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Downloads(Base):
    __tablename__ = "government_downloads"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scheme_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("government_schemes.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    file_url: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    scheme: Mapped["GovernmentScheme"] = relationship("GovernmentScheme", back_populates="downloads")


class Media(Base):
    __tablename__ = "government_media"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scheme_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("government_schemes.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # IMAGE, VIDEO
    url: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    scheme: Mapped["GovernmentScheme"] = relationship("GovernmentScheme", back_populates="media")


class FAQs(Base):
    __tablename__ = "government_faqs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scheme_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("government_schemes.id"), nullable=False)
    question: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str] = mapped_column(Text, nullable=False)

    scheme: Mapped["GovernmentScheme"] = relationship("GovernmentScheme", back_populates="faqs")
