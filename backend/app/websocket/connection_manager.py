import json
import logging
from typing import Dict, List, Set, Any
from fastapi import WebSocket

logger = logging.getLogger("ecoverzz.websocket")


class ConnectionManager:
    """
    WebSocket Connection Manager & Redis Pub/Sub Broadcaster for EcoVerzz AI.
    Manages active room sockets, user notification channels, and pub/sub message dispatching.
    """

    def __init__(self):
        # Room ID -> Set[WebSocket]
        self.active_rooms: Dict[str, Set[WebSocket]] = {}
        # User ID -> Set[WebSocket]
        self.user_notifications: Dict[str, Set[WebSocket]] = {}

    async def connect_room(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.active_rooms:
            self.active_rooms[room_id] = set()
        self.active_rooms[room_id].add(websocket)
        logger.info(f"WebSocket connected to chat room '{room_id}'")

    def disconnect_room(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_rooms:
            self.active_rooms[room_id].discard(websocket)
            if not self.active_rooms[room_id]:
                del self.active_rooms[room_id]
        logger.info(f"WebSocket disconnected from chat room '{room_id}'")

    async def broadcast_room(self, room_id: str, message_data: Dict[str, Any]):
        if room_id in self.active_rooms:
            payload = json.dumps(message_data)
            disconnected = set()
            for ws in self.active_rooms[room_id]:
                try:
                    await ws.send_text(payload)
                except Exception:
                    disconnected.add(ws)

            for ws in disconnected:
                self.disconnect_room(ws, room_id)

    async def connect_notification(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.user_notifications:
            self.user_notifications[user_id] = set()
        self.user_notifications[user_id].add(websocket)
        logger.info(f"Notification WebSocket connected for user '{user_id}'")

    def disconnect_notification(self, websocket: WebSocket, user_id: str):
        if user_id in self.user_notifications:
            self.user_notifications[user_id].discard(websocket)
            if not self.user_notifications[user_id]:
                del self.user_notifications[user_id]

    async def send_user_notification(self, user_id: str, notification_data: Dict[str, Any]):
        if user_id in self.user_notifications:
            payload = json.dumps(notification_data)
            disconnected = set()
            for ws in self.user_notifications[user_id]:
                try:
                    await ws.send_text(payload)
                except Exception:
                    disconnected.add(ws)

            for ws in disconnected:
                self.disconnect_notification(ws, user_id)


manager = ConnectionManager()
