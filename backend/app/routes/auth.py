from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.user import User

from app.schemas.user import UserRegister
from app.schemas.login import UserLogin, TokenResponse

from app.repositories.user_repository import (
    get_user_by_email,
    create_user,
)

from app.core.security import (
    hash_password,
    verify_password,
)

from app.core.auth import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


# ===========================
# REGISTER
# ===========================
@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    existing_user = get_user_by_email(
        db,
        user.email
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hash_password(
            user.password
        ),
        phone=user.phone,
        role=user.role
    )

    create_user(
        db,
        new_user
    )

    access_token = create_access_token(
        {
            "sub": new_user.email,
            "role": new_user.role
        }
    )

    return {
        "message": "Registration Successful",
        "access_token": access_token,
        "user": {
            "id": str(new_user.id),
            "name": new_user.full_name,
            "email": new_user.email,
            "role": new_user.role
        }
    }


# ===========================
# LOGIN
# ===========================
@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):

    user = get_user_by_email(
        db,
        credentials.email
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    if not verify_password(
        credentials.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    access_token = create_access_token(
        {
            "sub": user.email,
            "role": user.role
        }
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer"
    )