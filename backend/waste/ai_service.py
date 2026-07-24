import random


class WasteAI:

    @staticmethod
    def classify(image):

        waste = [

            "Plastic",

            "Glass",

            "Organic",

            "Metal",

            "Paper",

            "Electronic"

        ]

        return {

            "category": random.choice(waste),

            "confidence": round(
                random.uniform(75,99),
                2
            )

        }