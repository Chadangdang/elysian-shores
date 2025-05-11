from fastapi import FastAPI
from starlette.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, rooms, bookings
from app.database import engine, Base, SessionLocal, get_db
from app import models, crud
import app.crud as crud

app = FastAPI()
Base.metadata.create_all(bind=engine)

models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://elysian-shores.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(rooms.router)
app.include_router(bookings.router)

app.mount("/", StaticFiles(directory="app/static", html=True), name="static")

@app.get("/")
def read_root():
    return { "message": "Welcome to Elysian Shores API" }

@app.on_event("startup")
def seed_database():
    db = SessionLocal()
    try:
        if not db.query(models.RoomType).first():
            crud.seed_rooms(db)
        if not db.query(models.RoomAvailability.id).first():
            crud.seed_availability(db)
    finally:
        db.close()