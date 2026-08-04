import math
from typing import List, Dict, Any, Tuple


class GeoUtils:
    """
    GIS Geo Utilities for EcoVerzz AI.
    Provides Haversine distance math, heatmap spatial clustering, and Nearest Neighbor TSP Route Optimization.
    """

    @classmethod
    def haversine_distance_km(cls, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculates exact great-circle distance between two GPS coordinates in kilometers."""
        R = 6371.0  # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    @classmethod
    def optimize_nearest_neighbor_route(
        cls,
        start_coords: Tuple[float, float],
        waypoints: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Solves Traveling Salesperson Problem (TSP) using Nearest Neighbor algorithm for priority waste collection.
        """
        unvisited = list(waypoints)
        route = []
        current_lat, current_lon = start_coords

        while unvisited:
            nearest_idx = 0
            min_dist = float("inf")
            for idx, pt in enumerate(unvisited):
                d = cls.haversine_distance_km(current_lat, current_lon, pt["latitude"], pt["longitude"])
                if d < min_dist:
                    min_dist = d
                    nearest_idx = idx

            next_stop = unvisited.pop(nearest_idx)
            next_stop["distance_from_prev_km"] = round(min_dist, 2)
            route.append(next_stop)
            current_lat, current_lon = next_stop["latitude"], next_stop["longitude"]

        return route
