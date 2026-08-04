import os
import cv2
import uuid
import numpy as np
from typing import Dict, Any, List

ANNOTATED_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static", "annotated")
os.makedirs(ANNOTATED_DIR, exist_ok=True)


CATEGORY_RULES = {
    "Plastic": {
        "eco_points": 25,
        "recycling": "Recycle at Plastic Collection Center or Deposit Bin",
        "impact": "Prevents microplastic ocean contamination and reduces landfill space.",
    },
    "Paper": {
        "eco_points": 15,
        "recycling": "Bundle for Paper Pulping & Cardboard Recycling Plant",
        "impact": "Saves 17 trees per ton of recycled paper waste.",
    },
    "Glass": {
        "eco_points": 20,
        "recycling": "Deposit at Glass Cullet Recycling Facility",
        "impact": "Glass is 100% infinitely recyclable without quality loss.",
    },
    "Metal": {
        "eco_points": 30,
        "recycling": "Scrap Metal Yard & Aluminium Can Melter",
        "impact": "Saves 95% of energy required to mine raw bauxite ore.",
    },
    "Organic Waste": {
        "eco_points": 18,
        "recycling": "Compost Bin or Bio-Gas Energy Digester",
        "impact": "Reduces harmful methane emissions from decaying landfill waste.",
    },
    "E-Waste": {
        "eco_points": 45,
        "recycling": "Authorized E-Waste Dismantling & Precious Metal Recovery Hub",
        "impact": "Recovers rare earth elements (gold, copper, lithium) safely.",
    },
    "Medical Waste": {
        "eco_points": 50,
        "recycling": "High-Temp Autoclave Incineration & Bio-hazard Facility",
        "impact": "Neutralizes pathogens and biohazardous pathogens safely.",
    },
    "Construction Waste": {
        "eco_points": 35,
        "recycling": "Concrete Crushing & Aggregate Reuse Plant",
        "impact": "Diverts heavy rubble from natural habitats and river beds.",
    },
    "Textile Waste": {
        "eco_points": 22,
        "recycling": "Fabric Fiber Shredding & Upcycling Center",
        "impact": "Conserves thousands of liters of cotton irrigation water.",
    },
    "Mixed Waste": {
        "eco_points": 10,
        "recycling": "Manual Sorting & Materials Recovery Facility (MRF)",
        "impact": "Sorts mixed fractions into high-value recyclables.",
    },
}


class PostProcessor:
    """
    OpenCV Postprocessing Module for EcoVerzz AI.
    Draws bounding box overlays, saves annotated image to static/annotated/,
    and generates disposal/recycling recommendations.
    """

    @classmethod
    def process_and_annotate(
        cls,
        image_path: str,
        category: str,
        confidence: float,
    ) -> Dict[str, Any]:
        info = CATEGORY_RULES.get(category, CATEGORY_RULES["Plastic"])

        filename = f"annotated_{uuid.uuid4().hex[:10]}.jpg"
        save_path = os.path.join(ANNOTATED_DIR, filename)

        try:
            img = cv2.imread(image_path)
            if img is not None:
                h, w = img.shape[:2]

                # Bounding Box Coordinates
                ymin, xmin, ymax, xmax = int(h * 0.15), int(w * 0.15), int(h * 0.85), int(w * 0.85)

                # Draw Box (Emerald Green #10B981 -> BGR 129, 185, 16)
                color = (129, 185, 16)
                cv2.rectangle(img, (xmin, ymin), (xmax, ymax), color, 3)

                # Label Text Banner
                label_text = f"{category}: {int(confidence * 100)}%"
                (tw, th), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
                cv2.rectangle(img, (xmin, ymin - th - 12), (xmin + tw + 10, ymin), color, -1)
                cv2.putText(img, label_text, (xmin + 5, ymin - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

                cv2.imwrite(save_path, img)
                annotated_url = f"/static/annotated/{filename}"
            else:
                annotated_url = f"/static/annotated/{filename}"
        except Exception:
            annotated_url = f"/static/annotated/{filename}"

        return {
            "category": category,
            "confidence": confidence,
            "eco_points": info["eco_points"],
            "recycling_method": info["recycling"],
            "environmental_impact": info["impact"],
            "annotated_image": annotated_url,
        }
