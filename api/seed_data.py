# api/seed_data.py
from app.database import SessionLocal
from app.crud import seed_rooms, seed_availability

def main():
    db = SessionLocal()
    try:
        print("Seeding rooms…")
        seed_rooms(db)
        print("Seeding availability…")
        seed_availability(db)
        print("Done.")
    finally:
        db.close()

if __name__ == "__main__":
    main()
