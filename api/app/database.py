# app/database.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1) Build the correct path to prisma/dev.db
#    Assuming your structure is:
#      elysian-shores/
#        prisma/dev.db
#        api/app/database.py
BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # .../api/app
PRISMA_DB = os.path.abspath(os.path.join(BASE_DIR, "..", "prisma", "dev.db"))

SQLALCHEMY_DATABASE_URL = f"sqlite:///{PRISMA_DB}"

# 2) Single engine and session
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},  # SQLite-specific
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 3) Base for your models
Base = declarative_base()

# 4) Create tables in Prisma DB if they don’t already exist
Base.metadata.create_all(bind=engine)

# 5) Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()