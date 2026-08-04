import uuid
import json
from typing import Optional, List
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, UploadFile, File, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.chat_service import ChatService
from app.websocket.connection_manager import manager
from app.schemas.chat import (
    StandardResponse,
    ChatRoomCreate,
    MessageCreate,
)

router = APIRouter(
    prefix="/chat",
    tags=["Citizen & Admin Real-Time Chat & WebSockets"]
)


@router.post(
    "/room",
    response_model=StandardResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create One-to-One or Community Chat Room",
    description="Creates a chat room for Citizen-to-Admin messaging or Community discussions."
)
def create_chat_room(
    payload: ChatRoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ChatService(db)
    room = service.create_chat_room(current_user, payload.name, payload.room_type, payload.members)
    return StandardResponse(
        success=True,
        message="Chat room created successfully",
        data={
            "id": str(room.id),
            "name": room.name,
            "room_type": room.room_type,
            "created_by": str(room.created_by),
            "created_at": room.created_at.isoformat(),
        }
    )


@router.get(
    "/rooms",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Available Chat Rooms List",
    description="Returns list of available community and admin chat rooms."
)
def get_chat_rooms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ChatService(db)
    rooms = service.get_chat_rooms()
    return StandardResponse(
        success=True,
        message="Chat rooms retrieved successfully",
        data=[
            {
                "id": str(r.id),
                "name": r.name,
                "room_type": r.room_type,
                "created_by": str(r.created_by),
                "created_at": r.created_at.isoformat(),
            }
            for r in rooms
        ]
    )


@router.get(
    "/messages/{room_id}",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Chat Room Message History",
    description="Returns chronological message history for a target chat room by UUID."
)
def get_room_messages(
    room_id: uuid.UUID,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ChatService(db)
    messages = service.get_messages(room_id, limit)
    return StandardResponse(
        success=True,
        message="Messages retrieved successfully",
        data=[
            {
                "id": str(m.id),
                "room_id": str(m.room_id),
                "sender_id": str(m.sender_id),
                "sender_name": m.sender_name,
                "content": m.content,
                "media_url": m.media_url,
                "message_type": m.message_type,
                "is_read": m.is_read,
                "created_at": m.created_at.isoformat(),
            }
            for m in messages
        ]
    )


@router.post(
    "/send",
    response_model=StandardResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Send Chat Message (REST Endpoint)",
    description="Sends a text or media message into a chat room via REST API."
)
def send_chat_message(
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ChatService(db)
    msg = service.send_message(
        current_user=current_user,
        room_id=payload.room_id,
        content=payload.content,
        media_url=payload.media_url,
        message_type=payload.message_type,
    )
    return StandardResponse(
        success=True,
        message="Message sent successfully",
        data={
            "id": str(msg.id),
            "room_id": str(msg.room_id),
            "sender_id": str(msg.sender_id),
            "sender_name": msg.sender_name,
            "content": msg.content,
            "media_url": msg.media_url,
            "message_type": msg.message_type,
            "created_at": msg.created_at.isoformat(),
        }
    )


@router.post(
    "/upload",
    response_model=StandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload Chat Media / Image Attachment",
    description="Uploads an image attachment for chat sharing, compresses, and generates thumbnail URL."
)
def upload_chat_attachment(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = ChatService(db)
    res = service.upload_chat_media(file)
    return StandardResponse(
        success=True,
        message="Attachment uploaded successfully",
        data={"media_url": res["photo_url"], "thumbnail_url": res["thumbnail_url"]}
    )


# =========================================================================
# WEBSOCKET REAL-TIME ENDPOINTS
# =========================================================================

@router.websocket("/ws/chat/{room_id}")
async def websocket_chat_endpoint(websocket: WebSocket, room_id: str):
    """
    Real-time WebSocket endpoint for room chat messages and typing indicators.
    """
    await manager.connect_room(websocket, room_id)
    try:
        while True:
            data_text = await websocket.receive_text()
            try:
                data_json = json.loads(data_text)
            except Exception:
                data_json = {"content": data_text, "message_type": "text"}

            data_json["room_id"] = room_id
            await manager.broadcast_room(room_id, data_json)
    except WebSocketDisconnect:
        manager.disconnect_room(websocket, room_id)


@router.websocket("/ws/notifications")
async def websocket_notifications_endpoint(websocket: WebSocket, user_id: str = "guest"):
    """
    Real-time WebSocket streaming endpoint for user notifications and emergency alerts.
    """
    await manager.connect_notification(websocket, user_id)
    try:
        while True:
            _ = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect_notification(websocket, user_id)
