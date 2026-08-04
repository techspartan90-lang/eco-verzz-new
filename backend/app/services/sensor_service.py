import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.repositories.sensor_repository import SensorRepository
from app.iot.sensor_listener import SensorTelemetryListener
from app.models.environment_data import EnvironmentData


class SensorService:
    """
    Business logic layer for Environmental Sensors & Real-time Telemetry Ingestion.
    """

    def __init__(self, db: Session):
        self.db = db
        self.repository = SensorRepository(db)

    def record_sensor_telemetry(
        self,
        device_id: uuid.UUID,
        air_quality_aqi: float,
        water_quality_ph: float,
        temperature_c: float,
        humidity_pct: float,
        gas_leak_ppm: float,
        fill_level_pct: float,
    ) -> Dict[str, Any]:
        env_record = self.repository.save_sensor_data(
            device_id=device_id,
            air_quality_aqi=air_quality_aqi,
            water_quality_ph=water_quality_ph,
            temperature_c=temperature_c,
            humidity_pct=humidity_pct,
            gas_leak_ppm=gas_leak_ppm,
            fill_level_pct=fill_level_pct,
        )

        # Check telemetry thresholds
        telemetry_dict = {
            "air_quality_aqi": air_quality_aqi,
            "water_quality_ph": water_quality_ph,
            "temperature_c": temperature_c,
            "humidity_pct": humidity_pct,
            "gas_leak_ppm": gas_leak_ppm,
            "fill_level_pct": fill_level_pct,
        }
        eval_res = SensorTelemetryListener.evaluate_telemetry(telemetry_dict)

        return {
            "record_id": str(env_record.id),
            "device_id": str(device_id),
            "telemetry": telemetry_dict,
            "alerts": eval_res["alerts"],
            "recorded_at": env_record.recorded_at.isoformat(),
        }

    def get_live_telemetry(self, limit: int = 20) -> List[EnvironmentData]:
        return self.repository.get_live_data(limit)

    def get_sensor_history(self, device_id: uuid.UUID, limit: int = 50) -> List[EnvironmentData]:
        return self.repository.get_sensor_history(device_id, limit)

    def get_statistics(self) -> Dict[str, float]:
        return self.repository.get_statistics()
