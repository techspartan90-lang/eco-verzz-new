import logging
from typing import Dict, Any, List, Tuple
import math

logger = logging.getLogger("ecoverzz.iot.gps")


class VehicleGPSTracker:
    """
    Real-time vehicle GPS tracker & geo-fencing engine.
    Calculates speed, ETA, and geo-fence perimeter violations.
    """

    @classmethod
    def check_geofence(
        cls,
        lat: float,
        lon: float,
        center_lat: float = 12.9716,
        center_lon: float = 77.5946,
        max_radius_km: float = 15.0,
    ) -> bool:
        # Haversine distance check
        R = 6371.0
        dlat = math.radians(lat - center_lat)
        dlon = math.radians(lon - center_lon)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(center_lat)) * math.cos(math.radians(lat)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        dist = R * c
        return dist <= max_radius_km

    @classmethod
    def calculate_eta_minutes(cls, distance_km: float, speed_kmh: float = 35.0) -> int:
        if speed_kmh <= 0:
            speed_kmh = 35.0
        hours = distance_km / speed_kmh
        return max(1, int(hours * 60))
