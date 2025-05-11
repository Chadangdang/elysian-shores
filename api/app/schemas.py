from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional
from typing import List

# ------------------ USER SCHEMAS ------------------
class User(BaseModel):
    id: int
    username: str
    fullName: str
    email: EmailStr

    model_config = { "from_attributes": True }

class UserCreate(BaseModel):
    username: str
    fullName: str
    email: EmailStr
    password: str

    class Config:
        alias_generator = lambda s: ''.join(
            word.capitalize() if i else word for i, word in enumerate(s.split('_'))
        )
        populate_by_name = True

# ------------------ AUTH / TOKEN ------------------
class Token(BaseModel):
    access_token: str
    token_type: str

# ------------------ ROOM SCHEMAS ------------------
class RoomBase(BaseModel):
    type_id: str
    type: str
    description: str

    class Config:
        from_attributes = True

# Response with availability count
class RoomAvailabilityResponse(BaseModel):
    type_id:     str
    type:        str
    description: Optional[str] = None
    remaining:   int

    class Config:
        from_attributes = True

# ------------------ ROOM AVAILABILITY / FILTER ------------------
class RoomAvailabilityBase(BaseModel):
    date: date
    type_id: str
    remaining: int
    guests: int
    checkin: date
    checkout: date

class RoomFilter(BaseModel):
    checkin: date
    checkout: date
    guests: int

# ------------------ Booking ------------------
class BookingItem(BaseModel):
    type_id:  str
    checkin:  datetime
    checkout: datetime
    guests:   int

class BookingConfirmRequest(BaseModel):
    items: List[BookingItem]

class BookingResponse(BaseModel):
    id:           int
    userId:       int
    roomTypeId:   str
    checkinDate:  datetime
    checkoutDate: datetime
    guests:       int
    createdAt:    datetime

    model_config = { "from_attributes": True }