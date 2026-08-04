import json
import logging
from typing import Dict, Any, Callable
import paho.mqtt.client as mqtt

logger = logging.getLogger("ecoverzz.iot.mqtt")


class EcoVerzzMQTTClient:
    """
    MQTT IoT Client for EcoVerzz AI.
    Subscribes to telemetry topics: ecoverzz/sensors, ecoverzz/devices, ecoverzz/vehicles, ecoverzz/environment.
    """

    TOPICS = [
        "ecoverzz/sensors",
        "ecoverzz/devices",
        "ecoverzz/vehicles",
        "ecoverzz/environment",
    ]

    def __init__(self, host: str = "broker.hivemq.com", port: int = 1883):
        self.host = host
        self.port = port
        self.client = mqtt.Client(client_id="EcoVerzz-AI-IoT-Hub")
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

    def on_connect(self, client, userdata, flags, rc, properties=None):
        logger.info(f"MQTT Client Connected to broker '{self.host}' with result code {rc}")
        for topic in self.TOPICS:
            client.subscribe(topic)
            logger.info(f"Subscribed to MQTT Topic: '{topic}'")

    def on_message(self, client, userdata, msg):
        try:
            payload_str = msg.payload.decode("utf-8")
            data = json.loads(payload_str)
            logger.info(f"MQTT Inbound Message [{msg.topic}]: {data}")
        except Exception as e:
            logger.warning(f"Failed to parse MQTT message on topic '{msg.topic}': {str(e)}")

    def start_loop(self):
        try:
            self.client.connect_async(self.host, self.port, keepalive=60)
            self.client.loop_start()
            logger.info("MQTT Background loop started.")
        except Exception as e:
            logger.warning(f"Could not connect MQTT broker async: {str(e)}")


mqtt_hub = EcoVerzzMQTTClient()
