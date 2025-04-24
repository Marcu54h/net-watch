from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from . import schemas, crud, auth
from .database import get_db

router = APIRouter()


@router.post("/devices/", response_model=schemas.DeviceOut)
def create_device(device: schemas.DeviceCreate, db: Session = Depends(get_db)):
    return crud.create_device(db=db, device=device)

@router.get("/devices/", response_model=list[schemas.DeviceOut])
def read_device(db: Session = Depends(get_db)):
    return crud.get_devices(db)

@router.get("/devices/{device_id}/history", response_model=list[schemas.PingRecord])
def get_history(device_id: int, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    history = crud.get_ping_history(db, device_id, user.id)
    if history is None:
        raise HTTPException(status_code=403, detail="Brak dostępu do historii")
    return history

@router.get("/devices/{device_id}", response_model=schemas.DeviceOut)
def get_device(device_id: int, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    device = crud.get_device_by_id(db, device_id, user.id)
    if device is None:
        raise HTTPException(status_code=403, detail="Brak dostępu do urządzenia")
    return device

@router.put("/devices/{device_id}", response_model=schemas.DeviceOut)
def update_device(device_id: int, device: schemas.DeviceCreate, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    updated = crud.update_device(db, device_id, device, user.id)
    if not updated:
        raise HTTPException(status_code=403, detail="Brak dostępu lub urządzenie nie istnieje")
    return updated


@router.delete("/devices/{device_id}")
def delete_device(device_id: int, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    success = crud.delete_device(db, device_id, user.id)
    if not success:
        raise HTTPException(status_code=403, detail="Brak dostępu lub urządzenie nie istnieje")
    return {"detail": "Usunięto urządzenie"}
  