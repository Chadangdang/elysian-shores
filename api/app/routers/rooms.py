# app/routers/rooms.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.post("/filter", response_model=list[schemas.RoomAvailabilityResponse])
def filter_rooms(f: schemas.RoomFilter, db: Session = Depends(get_db)):
    nights = (f.checkout - f.checkin).days

    q = (
        db.query(
            models.RoomType.id.label("type_id"),
            models.RoomType.name.label("type"),
            models.RoomType.description,
            func.min(models.RoomAvailability.remaining).label("remaining"),
            func.count(models.RoomAvailability.id).label("days_count"),
            models.RoomType.capacity.label("capacity"),
        )
        .join(
            models.RoomAvailability,
            models.RoomAvailability.roomTypeId == models.RoomType.id
        )
        .filter(
            # 1. only dates in the requested range
            func.date(models.RoomAvailability.date) >= f.checkin,
            func.date(models.RoomAvailability.date) <  f.checkout,
            # 2. **new**: only rooms whose capacity >= requested guests
            models.RoomType.capacity >= f.guests,
        )
        .group_by(
            models.RoomType.id,
            models.RoomType.name,
            models.RoomType.description,
            models.RoomType.capacity,
        )
    )

    results = []
    for row in q:
        # ensure every night is present
        if row.days_count != nights:
            continue
        # capacity already guaranteed by the filter page
        results.append({
            "type_id":   row.type_id,
            "type":      row.type,
            "description": row.description,
            "remaining": row.remaining,
        })

    return results