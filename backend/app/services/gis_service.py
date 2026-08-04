import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.repositories.gis_repository import GISRepository
from app.utils.geo_utils import GeoUtils
from app.utils.map_service import MapTileService
from app.models.collection_vehicle import CollectionVehicle


class GISService:
    """
    Business logic layer for Smart City GIS, Live Maps, Vehicle Tracking, and Route Optimization.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = GISRepository(db)

    def get_live_vehicles(self) -> List[CollectionVehicle]:
        return self.repository.get_vehicles()

    def get_heatmap_points(self) -> Dict[str, Any]:
        points = self.repository.generate_heatmap()
        return {"total_points": len(points), "points": points}

    def get_recycling_centers(self) -> List[Dict[str, Any]]:
        return self.repository.get_recycling_centers()

    def get_live_map_summary(self) -> Dict[str, Any]:
        vehicles = self.get_live_vehicles()
        heatmap = self.get_heatmap_points()
        centers = self.get_recycling_centers()

        return {
            "live_vehicles_count": len(vehicles),
            "heatmap_points_count": heatmap["total_points"],
            "recycling_centers_count": len(centers),
            "map_config": MapTileService.get_map_config(),
        }

    def optimize_collection_route(
        self,
        start_latitude: float,
        start_longitude: float,
        pickup_points: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        if not pickup_points:
            pickup_points = [
                {"id": "BIN-01", "name": "Priority Clean Bin #1", "latitude": 12.9780, "longitude": 77.5900, "priority": "High"},
                {"id": "BIN-02", "name": "E-Waste Depot #2", "latitude": 12.9850, "longitude": 77.6050, "priority": "Urgent"},
                {"id": "BIN-03", "name": "Solar Battery Hub #3", "latitude": 12.9600, "longitude": 77.5800, "priority": "Medium"},
            ]

        optimized = GeoUtils.optimize_nearest_neighbor_route((start_latitude, start_longitude), pickup_points)

        total_dist = sum(pt.get("distance_from_prev_km", 0.0) for pt in optimized)
        est_time_mins = max(10, int((total_dist / 35.0) * 60))

        return {
            "total_stops": len(optimized),
            "total_distance_km": round(total_dist, 2),
            "estimated_time_minutes": est_time_mins,
            "optimized_route": optimized,
        }
