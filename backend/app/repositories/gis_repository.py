import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.collection_vehicle import CollectionVehicle
from app.models.location import LocationHistory
from app.models.waste_report import WasteReport
from app.models.device import Device
from app.utils.geo_utils import GeoUtils


class GISRepository:
    """
    SQLAlchemy 2.0 Repository pattern implementation for GIS, Map, and Route Optimization queries.
    """

    def __init__(self, db: Session):
        self.db = db

    def get_vehicles(self) -> List[CollectionVehicle]:
        vehicles = self.db.query(CollectionVehicle).all()
        if not vehicles:
            # Seed default vehicles
            v1 = CollectionVehicle(
                vehicle_code="ECO-TRUCK-101",
                driver_name="Ramesh Kumar",
                status="En-Route",
                current_latitude=12.9716,
                current_longitude=77.5946,
                speed_kmh=38.0,
                fuel_pct=85.0,
            )
            v2 = CollectionVehicle(
                vehicle_code="ECO-TRUCK-102",
                driver_name="Suresh Patel",
                status="En-Route",
                current_latitude=12.9850,
                current_longitude=77.6050,
                speed_kmh=32.0,
                fuel_pct=72.0,
            )
            self.db.add_all([v1, v2])
            self.db.commit()
            vehicles = [v1, v2]
        return vehicles

    def get_vehicle_location(self, vehicle_id: uuid.UUID) -> Optional[CollectionVehicle]:
        return self.db.query(CollectionVehicle).filter(CollectionVehicle.id == vehicle_id).first()

    def save_location(self, vehicle_id: uuid.UUID, latitude: float, longitude: float, speed_kmh: float) -> LocationHistory:
        loc = LocationHistory(
            vehicle_id=vehicle_id,
            latitude=latitude,
            longitude=longitude,
            speed_kmh=speed_kmh,
        )
        self.db.add(loc)

        # Update vehicle current location
        vehicle = self.get_vehicle_location(vehicle_id)
        if vehicle:
            vehicle.current_latitude = latitude
            vehicle.current_longitude = longitude
            vehicle.speed_kmh = speed_kmh

        self.db.commit()
        self.db.refresh(loc)
        return loc

    def generate_heatmap(self) -> List[Dict[str, float]]:
        reports = self.db.query(WasteReport).limit(100).all()
        points = []
        for r in reports:
            points.append({
                "latitude": r.latitude or 12.9716,
                "longitude": r.longitude or 77.5946,
                "intensity": 0.85 if r.status == "Pending" else 0.4,
            })

        if not points:
            points = [
                {"latitude": 12.9716, "longitude": 77.5946, "intensity": 0.9},
                {"latitude": 12.9850, "longitude": 77.6050, "intensity": 0.75},
                {"latitude": 12.9600, "longitude": 77.5800, "intensity": 0.6},
            ]
        return points

    def get_recycling_centers(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": str(uuid.uuid4()),
                "name": "Central Urban Plastic & E-Waste Hub",
                "category": "Plastic & E-Waste",
                "latitude": 12.9780,
                "longitude": 77.5900,
                "address": "MG Road Eco Hub, District 1",
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Tech Corridor Clean Energy Recycling",
                "category": "Solar & Clean Energy",
                "latitude": 12.9900,
                "longitude": 77.6150,
                "address": "Indiranagar Eco Hub, District 2",
            },
        ]
