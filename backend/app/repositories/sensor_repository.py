import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.sensor import Sensor
from app.models.environment_data import EnvironmentData


class SensorRepository:
    """
    SQLAlchemy 2.0 Repository pattern implementation for Sensor & EnvironmentData entities.
    """

    def __init__(self, db: Session):
        self.db = db

    def save_sensor_data(
        self,
        device_id: uuid.UUID,
        air_quality_aqi: float = 42.0,
        water_quality_ph: float = 7.2,
        temperature_c: float = 28.5,
        humidity_pct: float = 65.0,
        gas_leak_ppm: float = 12.0,
        fill_level_pct: float = 45.0,
    ) -> EnvironmentData:
        env_record = EnvironmentData(
            device_id=device_id,
            air_quality_aqi=air_quality_aqi,
            water_quality_ph=water_quality_ph,
            temperature_c=temperature_c,
            humidity_pct=humidity_pct,
            gas_leak_ppm=gas_leak_ppm,
            fill_level_pct=fill_level_pct,
        )
        self.db.add(env_record)
        self.db.commit()
        self.db.refresh(env_record)
        return env_record

    def get_live_data(self, limit: int = 20) -> List[EnvironmentData]:
        return self.db.query(EnvironmentData).order_by(EnvironmentData.recorded_at.desc()).limit(limit).all()

    def get_sensor_history(self, device_id: uuid.UUID, limit: int = 50) -> List[EnvironmentData]:
        return self.db.query(EnvironmentData).filter(
            EnvironmentData.device_id == device_id
        ).order_by(EnvironmentData.recorded_at.desc()).limit(limit).all()

    def get_statistics(self) -> Dict[str, float]:
        records = self.db.query(EnvironmentData).limit(100).all()
        if not records:
            return {
                "avg_aqi": 42.5,
                "avg_ph": 7.2,
                "avg_temperature": 28.4,
                "avg_humidity": 65.2,
                "avg_gas": 11.8,
                "avg_fill_level": 48.0,
            }

        avg_aqi = sum(r.air_quality_aqi for r in records) / len(records)
        avg_ph = sum(r.water_quality_ph for r in records) / len(records)
        avg_temp = sum(r.temperature_c for r in records) / len(records)
        avg_hum = sum(r.humidity_pct for r in records) / len(records)
        avg_gas = sum(r.gas_leak_ppm for r in records) / len(records)
        avg_fill = sum(r.fill_level_pct for r in records) / len(records)

        return {
            "avg_aqi": round(avg_aqi, 1),
            "avg_ph": round(avg_ph, 2),
            "avg_temperature": round(avg_temp, 1),
            "avg_humidity": round(avg_hum, 1),
            "avg_gas": round(avg_gas, 1),
            "avg_fill_level": round(avg_fill, 1),
        }
