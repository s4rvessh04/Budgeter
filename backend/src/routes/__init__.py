from typing import List

from database import crud, models, schemas
from database.database import SessionLocal, engine
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
