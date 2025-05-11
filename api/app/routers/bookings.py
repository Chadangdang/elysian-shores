from typing      import List
from datetime    import timedelta
from fastapi     import APIRouter, Depends, HTTPException, status
from sqlalchemy  import func
from sqlalchemy.orm import Session

from app.database import get_db
from app          import models, schemas, crud
from app.crud     import get_current_user

router = APIRouter(prefix="/bookings", tags=["bookings"])

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.get(
    "/",
    response_model=List[schemas.BookingResponse],
    status_code=status.HTTP_200_OK,
)
def list_bookings(
    db: Session            = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Return all bookings for the current user.
    """
    return crud.get_bookings(db, user_id=current_user.id)

@router.post(
    "/confirm",
    response_model=List[schemas.BookingResponse],
    status_code=status.HTTP_201_CREATED,
)
def confirm_bookings(
    req: schemas.BookingConfirmRequest,
    db: Session            = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    created = []

    for item in req.items:
        nights = (item.checkout - item.checkin).days
        for offset in range(nights):
            day = (item.checkin + timedelta(days=offset)).date()
            avail = (
                db.query(models.RoomAvailability)
                  .filter(
                    models.RoomAvailability.roomTypeId == item.type_id,
                    func.date(models.RoomAvailability.date) == day.isoformat()
                  )
                  .first()
            )
            if not avail or avail.remaining < 1:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST,
                    f"No {item.type_id} rooms left on {day}"
                )
            avail.remaining -= 1

        booking = models.Booking(
            userId       = current_user.id,
            roomTypeId   = item.type_id,
            checkinDate  = item.checkin,
            checkoutDate = item.checkout,
            guests       = item.guests,
        )
        db.add(booking)
        created.append(booking)

    db.commit()
    for b in created:
        db.refresh(b)

    return created

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    """
    Cancel a booking by ID: remove the booking and restore availability for each night.
    """
    booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id,
        models.Booking.userId == current_user.id
    ).first()
    if not booking:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Booking not found")

    # restore availability for each night
    nights = (booking.checkoutDate - booking.checkinDate).days
    for offset in range(nights):
        day = (booking.checkinDate + timedelta(days=offset)).date()
        avail = (
            db.query(models.RoomAvailability)
              .filter(
                  models.RoomAvailability.roomTypeId == booking.roomTypeId,
                  func.date(models.RoomAvailability.date) == day.isoformat()
              )
              .first()
        )
        if avail:
            avail.remaining += 1

    db.delete(booking)
    db.commit()
    return