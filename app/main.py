from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud, database, auth
from .database import get_db
from .ping_worker import scheduler
from .users import router as user_router
from .devices import router as device_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

models.Base.metadata.create_all(bind=database.engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # <-- frontend Vite działa tu domyślnie
    allow_credentials=True,
    allow_methods=["*"],  # <-- pozwól na wszystkie metody, łącznie z OPTIONS
    allow_headers=["*"],  # <-- pozwól na wszystkie nagłówki
)
app.include_router(user_router)
app.include_router(device_router)
