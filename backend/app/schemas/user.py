from pydantic import BaseModel, EmailStr, field_validator


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: str | None = None
    role: str = "Investor"

    @field_validator("role")

    def validate_role(cls, v: str) -> str:
        allowed = ["Admin", "Analyst", "Investor"]
        normalized = v.capitalize() if v else "Investor"
        if normalized not in allowed:
            raise ValueError(f"Role must be one of: {', '.join(allowed)}")
        return normalized



class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone: str | None
    role: str

    class Config:
        from_attributes = True