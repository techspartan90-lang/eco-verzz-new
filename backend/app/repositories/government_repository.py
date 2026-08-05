import uuid
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.government import (
    GovernmentScheme,
    GovernmentNews,
    GovernmentEvent,
    Volunteer,
    Participation,
    Certificate,
    CarbonActivity,
    WaterActivity,
    TreePlantation,
    PollutionReport,
    SmartCity,
    SchemeAnalytics,
    Downloads,
    Media,
    FAQs
)
from app.models.user import User


class GovernmentRepository:
    def __init__(self, db: Session):
        self.db = db

    # ==========================================
    # SCHEME CRUD
    # ==========================================
    def get_all_schemes(self) -> List[GovernmentScheme]:
        return self.db.query(GovernmentScheme).options(
            joinedload(GovernmentScheme.faqs),
            joinedload(GovernmentScheme.downloads),
            joinedload(GovernmentScheme.media),
            joinedload(GovernmentScheme.news),
            joinedload(GovernmentScheme.events)
        ).all()

    def get_scheme_by_id(self, scheme_id: uuid.UUID) -> Optional[GovernmentScheme]:
        return self.db.query(GovernmentScheme).filter(GovernmentScheme.id == scheme_id).options(
            joinedload(GovernmentScheme.faqs),
            joinedload(GovernmentScheme.downloads),
            joinedload(GovernmentScheme.media),
            joinedload(GovernmentScheme.news),
            joinedload(GovernmentScheme.events)
        ).first()

    def get_scheme_by_name(self, name: str) -> Optional[GovernmentScheme]:
        return self.db.query(GovernmentScheme).filter(GovernmentScheme.name == name).options(
            joinedload(GovernmentScheme.faqs),
            joinedload(GovernmentScheme.downloads),
            joinedload(GovernmentScheme.media)
        ).first()

    def create_scheme(self, scheme: GovernmentScheme) -> GovernmentScheme:
        self.db.add(scheme)
        self.db.commit()
        self.db.refresh(scheme)
        return scheme

    # ==========================================
    # VOLUNTEERS
    # ==========================================
    def create_volunteer(self, volunteer: Volunteer) -> Volunteer:
        self.db.add(volunteer)
        self.db.commit()
        self.db.refresh(volunteer)
        return volunteer

    def get_volunteers_by_user(self, user_id: uuid.UUID) -> List[Volunteer]:
        return self.db.query(Volunteer).filter(Volunteer.user_id == user_id).all()

    def get_volunteers_by_event(self, event_id: uuid.UUID) -> List[Volunteer]:
        return self.db.query(Volunteer).filter(Volunteer.event_id == event_id).all()

    # ==========================================
    # PARTICIPATION & CHALLENGES
    # ==========================================
    def create_participation(self, participation: Participation) -> Participation:
        self.db.add(participation)
        self.db.commit()
        self.db.refresh(participation)
        return participation

    def get_participations_by_user(self, user_id: uuid.UUID) -> List[Participation]:
        return self.db.query(Participation).filter(Participation.user_id == user_id).all()

    def update_participation_status(self, user_id: uuid.UUID, challenge_name: str, status: str, points: int) -> Optional[Participation]:
        participation = self.db.query(Participation).filter(
            Participation.user_id == user_id,
            Participation.challenge_name == challenge_name
        ).first()
        if participation:
            participation.status = status
            participation.points_earned = points
            if status == "COMPLETED":
                participation.completed_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(participation)
        return participation

    # ==========================================
    # CERTIFICATES
    # ==========================================
    def create_certificate(self, certificate: Certificate) -> Certificate:
        self.db.add(certificate)
        self.db.commit()
        self.db.refresh(certificate)
        return certificate

    def get_certificates_by_user(self, user_id: uuid.UUID) -> List[Certificate]:
        return self.db.query(Certificate).filter(Certificate.user_id == user_id).all()

    # ==========================================
    # CARBON ACTIVITY LOG
    # ==========================================
    def create_carbon_activity(self, activity: CarbonActivity) -> CarbonActivity:
        self.db.add(activity)
        self.db.commit()
        self.db.refresh(activity)
        return activity

    def get_carbon_activities_by_user(self, user_id: uuid.UUID) -> List[CarbonActivity]:
        return self.db.query(CarbonActivity).filter(CarbonActivity.user_id == user_id).order_by(CarbonActivity.logged_at.desc()).all()

    # ==========================================
    # WATER ACTIVITY LOG
    # ==========================================
    def create_water_activity(self, activity: WaterActivity) -> WaterActivity:
        self.db.add(activity)
        self.db.commit()
        self.db.refresh(activity)
        return activity

    def get_water_activities(self) -> List[WaterActivity]:
        return self.db.query(WaterActivity).order_by(WaterActivity.logged_at.desc()).all()

    # ==========================================
    # TREE PLANTATION LOG
    # ==========================================
    def create_tree_plantation(self, plantation: TreePlantation) -> TreePlantation:
        self.db.add(plantation)
        self.db.commit()
        self.db.refresh(plantation)
        return plantation

    def get_tree_plantations(self) -> List[TreePlantation]:
        return self.db.query(TreePlantation).order_by(TreePlantation.planted_at.desc()).all()

    # ==========================================
    # POLLUTION REPORT LOG
    # ==========================================
    def create_pollution_report(self, report: PollutionReport) -> PollutionReport:
        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)
        return report

    def get_pollution_reports(self) -> List[PollutionReport]:
        return self.db.query(PollutionReport).order_by(PollutionReport.reported_at.desc()).all()

    # ==========================================
    # SMART CITY IOT SIMULATION
    # ==========================================
    def get_smart_city_devices(self) -> List[SmartCity]:
        return self.db.query(SmartCity).all()

    def update_smart_city_device(self, city_name: str, bin_fill_level: float, street_light_status: str, parking_occupancy: float) -> SmartCity:
        device = self.db.query(SmartCity).filter(SmartCity.city_name == city_name).first()
        if not device:
            device = SmartCity(
                city_name=city_name,
                bin_fill_level=bin_fill_level,
                street_light_status=street_light_status,
                parking_occupancy=parking_occupancy
            )
            self.db.add(device)
        else:
            device.bin_fill_level = bin_fill_level
            device.street_light_status = street_light_status
            device.parking_occupancy = parking_occupancy
        self.db.commit()
        self.db.refresh(device)
        return device

    # ==========================================
    # FAQs, NEWS, EVENTS, DOWNLOADS, MEDIA (CMS)
    # ==========================================
    def create_faq(self, faq: FAQs) -> FAQs:
        self.db.add(faq)
        self.db.commit()
        self.db.refresh(faq)
        return faq

    def create_news(self, news: GovernmentNews) -> GovernmentNews:
        self.db.add(news)
        self.db.commit()
        self.db.refresh(news)
        return news

    def get_news(self) -> List[GovernmentNews]:
        return self.db.query(GovernmentNews).order_by(GovernmentNews.published_at.desc()).all()

    def create_event(self, event: GovernmentEvent) -> GovernmentEvent:
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def get_events(self) -> List[GovernmentEvent]:
        return self.db.query(GovernmentEvent).order_by(GovernmentEvent.event_date.asc()).all()

    def create_download(self, download: Downloads) -> Downloads:
        self.db.add(download)
        self.db.commit()
        self.db.refresh(download)
        return download

    def create_media(self, media: Media) -> Media:
        self.db.add(media)
        self.db.commit()
        self.db.refresh(media)
        return media
