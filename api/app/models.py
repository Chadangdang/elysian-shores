from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, Date
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime
from sqlalchemy.types import TypeDecorator, String

class ISODateTime(TypeDecorator):
    """Stores a Python datetime as an ISO-8601 string (YYYY-MM-DDTHH:MM:SSZ)."""
    impl = String

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        # ensure it's a datetime, then ISO-format + 'Z'
        return value.isoformat() + "Z"

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        # parse the ISO string back to datetime
        return datetime.fromisoformat(value.rstrip("Z"))

class User(Base):
    __tablename__ = "User"
    id             = Column(Integer, primary_key=True, index=True)
    username       = Column(String, unique=True, index=True, nullable=False)
    fullName       = Column(String, nullable=False)
    email          = Column(String, unique=True, index=True, nullable=False)
    hashedPassword = Column(String, nullable=False)

    bookings = relationship("Booking", back_populates="user")

class RoomType(Base):
    __tablename__ = "RoomType"

    id          = Column(String, primary_key=True, index=True)
    name        = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    capacity    = Column(Integer, nullable=False)

    availability = relationship(
        "RoomAvailability",
        back_populates="room_type",
        cascade="all, delete-orphan",
    )
    bookings = relationship("Booking", back_populates="roomType")

class RoomAvailability(Base):
    __tablename__ = "RoomAvailability"
    __table_args__ = (UniqueConstraint("roomTypeId", "date"),)

    id         = Column(Integer, primary_key=True, index=True)
    roomTypeId = Column(String, ForeignKey("RoomType.id"), nullable=False)
    date       = Column(Integer,  nullable=False)
    remaining = Column(Integer, nullable=False, default=0)

    room_type = relationship("RoomType", back_populates="availability")

class Booking(Base):
    __tablename__ = "Booking"

    id           = Column(Integer, primary_key=True, autoincrement=True)
    userId       = Column(Integer, ForeignKey("User.id"), nullable=False)
    roomTypeId   = Column(String,  ForeignKey("RoomType.id"), nullable=False)

    # Use ISODateTime here, NOT String or DateTime
    checkinDate  = Column(ISODateTime, nullable=False)
    checkoutDate = Column(ISODateTime, nullable=False)
    createdAt    = Column(ISODateTime, default=lambda: datetime.utcnow(), nullable=False)

    guests       = Column(Integer, nullable=False)

    user     = relationship("User",     back_populates="bookings")
    roomType = relationship("RoomType", back_populates="bookings")