# app/crud.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from passlib.context import CryptContext
from datetime import date, datetime, time, timedelta
from app.schemas import BookingItem

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = models.User(
        username       = user.username,
        fullName       = user.fullName,
        email          = user.email,
        hashedPassword = hash_password(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def seed_rooms(db: Session):
    rooms_data = [
        ("room_1", "Classic Room", "..."),
        ("room_2", "Deluxe Suite", "..."),
        ("room_3", "Executive Suite", "..."),
    ]
    for type_id, name, desc in rooms_data:
        rt = db.get(models.RoomType, type_id) or models.RoomType(id=type_id)
        rt.name        = name
        rt.description = desc
        db.merge(rt)
    db.commit()

def seed_availability(db: Session):
    """
    Seed availability from May 12 to July 30, 2025,
    always stamped at 17:00 local time.
    """
    type_counts = [
        ("room_1", 20),
        ("room_2", 10),
        ("room_3", 5),
    ]
    start = date(2025, 5, 12)
    end   = date(2025, 7, 30)
    delta = timedelta(days=1)

    for type_id, total in type_counts:
        current = start
        while current <= end:
            # combine each pure date with 17:00:00
            dt = datetime.combine(current, time(17, 0, 0))
            exists = (
                db.query(models.RoomAvailability)
                  .filter_by(roomTypeId=type_id, date=dt)
                  .first()
            )
            if not exists:
                db.add(models.RoomAvailability(
                    roomTypeId=type_id,
                    date=dt,
                    remaining=total
                ))
            current += delta

    db.commit()

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    if not token.startswith("fake-token-for-"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    username = token.removeprefix("fake-token-for-")
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

def create_booking(
    db: Session,
    booking_item: BookingItem,    # ← use the BookingItem you already defined
    user_id: int
):
    # note: your model fields are userId, roomTypeId, checkinDate, checkoutDate, guests
    db_booking = models.Booking(
        userId       = user_id,
        roomTypeId   = booking_item.type_id,
        checkinDate  = booking_item.checkin,
        checkoutDate = booking_item.checkout,
        guests       = booking_item.guests,
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_bookings(db: Session, user_id: int):
    return db.query(models.Booking).filter(models.Booking.userId == user_id).all()
def delete_booking(db: Session, booking_id: int, user_id: int):
    booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id,
        models.Booking.userId == user_id
    ).first()
    if not booking:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Booking not found")
    
    db.delete(booking)
    db.commit()