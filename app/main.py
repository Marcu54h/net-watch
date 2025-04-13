from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud, database, auth
from .ping_worker import scheduler
from .users import router as user_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(user_router)

models.Base.metadata.create_all(bind=database.engine)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/devices/", response_model=schemas.DeviceOut)
def create_device(device: schemas.DeviceCreate, db: Session = Depends(get_db)):
    return crud.create_device(db=db, device=device)

@app.get("/devices/", response_model=list[schemas.DeviceOut])
def read_device(db: Session = Depends(get_db)):
    return crud.get_device(db)

@app.put("/devices/{device_id}", response_model=schemas.DeviceOut)
def update_device(device_id: int, device: schemas.DeviceCreate, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    updated = crud.update_device(db, device_id, device, user.id)
    if not updated:
        raise HTTPException(status_code=403, detail="Brak dostępu lub urządzenie nie istnieje")
    return updated

@app.delete("/devices/{device_id}")
def delete_device(device_id: int, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    success = crud.delete_device(db, device_id, user.id)
    if not success:
        raise HTTPException(status_code=403, detail="Brak dostępu lub urządzenie nie istnieje")
    return {"detail": "Usunięto urządzenie"}
  
@app.get("/devices/{device_id}/history", response_model=list[schemas.PingRecord])
def get_history(device_id: int, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    history = crud.get_ping_history(db, device_id, user.id)
    if history is None:
        raise HTTPException(status_code=403, detail="Brak dostępu do historii")
    return history
