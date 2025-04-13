from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime

def create_device(db: Session, device: schemas.DeviceCreate, user_id: int):
  db_device = models.Device(**device.model_dump(), owner_id=user_id)
  db.add(db_device)
  db.commit()
  db.refresh(db_device)
  return db_device

def get_device_for_user(db: Session, user_id: int):
  return db.query(models.Device).filter(models.Device.owner_id == user_id).all()

def get_device_by_id(db: Session, device_id: int):
  return db.query(models.Device).filter(models.Device.id == device_id).first()

def get_devices(db: Session):
  return db.query(models.Device).all()

def update_device(db: Session, device_id: int, device_data: schemas.DeviceCreate, user_id: int):
  device = get_device_by_id(db, device_id)
  if not device or device.owner_id != user_id:
    return None
  device.name = device_data.name
  device.ip_address = device_data.ip_address
  device.description = device_data.description
  db.commit()
  db.refresh(device)
  return device

def delete_device(db: Session, device_id: int, user_id: int) -> bool:
  device = get_device_by_id(db, device_id)
  if not device or device.owner_id != user_id:
    return False
  db.delete(device)
  db.commit()
  return True

def update_device_status(db: Session, device_id: int, status: bool):
  device = db.query(models.Device).filter(models.Device.id == device_id).first()
  if device:
    device.is_online = status
    device.last_checked = datetime.now(datetime.timezone.utc)
    db.commit()

def save_ping_result(db: Session, device_id: int, status: bool):
    from .models import PingHistory
    record = PingHistory(device_id=device_id, is_online=status)
    db.add(record)
    db.commit()

def get_ping_history(db: Session, device_id: int, user_id: int):
    device = get_device_by_id(db, device_id)
    if not device or device.owner_id != user_id:
        return None
    return device.history  # lub posortowane: sorted(device.history, key=lambda x: x.timestamp)