from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime

def create_device(db: Session, device: schemas.DeviceCreate, user_id: int):
  db_device = models.Device(**device.model_dump(), owner_id=user_id)
  db.add(db_device)
  db.commit()
  db.refresh(db_device)
  return db_device

def get_device(db: Session):
  return db.query(models.Device).all()

def get_device_for_user(db: Session, user_id: int):
  return db.query(models.Device).filter(models.Device.owner_id == user_id).all()

def update_device_status(db: Session, device_id: int, status: bool):
  device = db.query(models.Device).filter(models.Device.id == device_id).first()
  if device:
    device.is_online = status
    device.last_checked = datetime.now(datetime.timezone.utc)
    db.commit()

