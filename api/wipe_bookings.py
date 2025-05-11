# wipe_bookings.py

from app.database import SessionLocal
from app import models

def main():
    db = SessionLocal()
    try:
        # Delete all rows in the Booking table
        count = db.query(models.Booking).delete()
        db.commit()
        print(f"✅ Deleted {count} row(s) from Booking table.")
    except Exception as e:
        print("❌ Failed to clear Booking table:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
