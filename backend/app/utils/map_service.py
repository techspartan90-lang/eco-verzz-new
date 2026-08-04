from typing import Dict, Any


class MapTileService:
    """
    OpenStreetMap, Leaflet, Mapbox, and Google Maps API metadata layer provider.
    """

    @classmethod
    def get_map_config(cls) -> Dict[str, Any]:
        return {
            "default_center": {"latitude": 12.9716, "longitude": 77.5946, "zoom": 13},
            "tile_layers": {
                "OpenStreetMap": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "MapboxDark": "https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.ecoverzz",
                "GoogleSatellite": "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
                "TrafficOverlay": "https://mt1.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}",
            },
            "attribution": "© EcoVerzz AI GIS • OpenStreetMap • Mapbox • Google Maps",
        }
