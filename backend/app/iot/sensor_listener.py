import logging
from typing import Dict, Any

logger = logging.getLogger("ecoverzz.iot.sensor_listener")


class SensorTelemetryListener:
    """
    Evaluates incoming IoT sensor telemetry payloads and triggers alerts if safety thresholds are exceeded.
    """

    THRESHOLDS = {
        "air_quality_aqi": 150.0,   # Hazardous AQI threshold
        "gas_leak_ppm": 50.0,       # Gas leak threshold
        "fill_level_pct": 90.0,     # Smart bin full alert
        "water_quality_ph_min": 6.5,
        "water_quality_ph_max": 8.5,
    }

    @classmethod
    def evaluate_telemetry(cls, telemetry: Dict[str, Any]) -> Dict[str, Any]:
        aqi = telemetry.get("air_quality_aqi", 42.0)
        gas = telemetry.get("gas_leak_ppm", 12.0)
        fill = telemetry.get("fill_level_pct", 45.0)

        alerts = []
        if aqi > cls.THRESHOLDS["air_quality_aqi"]:
            alerts.append(f"HAZARDOUS AIR QUALITY DETECTED: AQI {aqi}")
        if gas > cls.THRESHOLDS["gas_leak_ppm"]:
            alerts.append(f"GAS LEAKAGE DETECTED: {gas} PPM")
        if fill > cls.THRESHOLDS["fill_level_pct"]:
            alerts.append(f"SMART DUSTBIN OVERFLOW: {fill}% FULL")

        if alerts:
            logger.warning(f"SensorTelemetryListener Alert: {alerts}")

        return {
            "telemetry": telemetry,
            "alerts": alerts,
            "is_critical": len(alerts) > 0,
        }
