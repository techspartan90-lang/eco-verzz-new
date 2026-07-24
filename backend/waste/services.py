import math
from django.db import models
from .models import WasteReport


class AIWasteDetectionService:
    @staticmethod
    def detect_waste_type(image_file):
        """
        Mocks YOLOv11 and OpenCV image classification.
        In production, this would call our FastAPI AI microservice
        or run inference directly using the YOLOv11/OpenCV model.
        """
        if not image_file:
            return {
                "detected_category": "OTHER",
                "confidence": 0.0,
                "recyclable": False,
                "suggestions": ["Please upload a clearer image of the waste."]
            }
            
        filename = image_file.name.lower()
        
        # Simple heuristic mock classification based on file names or extensions for testing
        if "plastic" in filename or "bottle" in filename:
            category = "PLASTIC"
            confidence = 0.94
            recyclable = True
            suggestions = ["Deposit in yellow recycling bin.", "Rinse plastic containers before recycling."]
        elif "paper" in filename or "cardboard" in filename or "box" in filename:
            category = "PAPER"
            confidence = 0.91
            recyclable = True
            suggestions = ["Flatten cardboard boxes.", "Keep paper dry for collection."]
        elif "can" in filename or "metal" in filename or "foil" in filename:
            category = "METAL"
            confidence = 0.89
            recyclable = True
            suggestions = ["Rinse metal cans.", "Aluminum is infinitely recyclable."]
        elif "glass" in filename or "jar" in filename:
            category = "GLASS"
            confidence = 0.95
            recyclable = True
            suggestions = ["Separate by color if possible.", "Avoid breaking glass before disposal."]
        elif "food" in filename or "organic" in filename or "leaf" in filename:
            category = "ORGANIC"
            confidence = 0.88
            recyclable = False
            suggestions = ["Ideal for composting.", "Keep organic waste separate to prevent odor."]
        elif "battery" in filename or "phone" in filename or "wire" in filename or "electronics" in filename:
            category = "E_WASTE"
            confidence = 0.97
            recyclable = False
            suggestions = ["Contains hazardous materials.", "Must be taken to an official e-waste drop-off site."]
        else:
            category = "OTHER"
            confidence = 0.75
            recyclable = False
            suggestions = ["Sort manually or contact municipal waste services."]

        return {
            "detected_category": category,
            "confidence": confidence,
            "recyclable": recyclable,
            "suggestions": suggestions
        }


class GeoLocationService:
    @staticmethod
    def calculate_distance(lat1, lon1, lat2, lon2):
        """
        Calculates the distance in kilometers between two GPS coordinates
        using the Haversine formula.
        """
        # Convert degrees to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [float(lat1), float(lon1), float(lat2), float(lon2)])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        r = 6371 # Radius of earth in kilometers
        return c * r

    @classmethod
    def haversine_distance(cls, lat1, lon1, lat2, lon2):
        return cls.calculate_distance(lat1, lon1, lat2, lon2)

    @classmethod
    def get_nearby_reports(cls, latitude, longitude, radius_km=5.0):
        """
        Returns reports within a specific radius (in kilometers) from the given GPS coordinates.
        """
        latitude = float(latitude)
        longitude = float(longitude)
        
        all_reports = WasteReport.objects.all()
        nearby_report_ids = []
        
        for report in all_reports:
            dist = cls.calculate_distance(latitude, longitude, report.latitude, report.longitude)
            if dist <= radius_km:
                nearby_report_ids.append((report.id, dist))
                
        # Sort by distance
        nearby_report_ids.sort(key=lambda x: x[1])
        
        # Return queryset ordered by proximity
        ids = [item[0] for item in nearby_report_ids]
        
        if not ids:
            return WasteReport.objects.none()
        
        # Preserve order in django query
        preserved_order = models.Case(*[models.When(pk=pk, then=pos) for pos, pk in enumerate(ids)])
        return WasteReport.objects.filter(id__in=ids).order_by(preserved_order)
