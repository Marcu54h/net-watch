from apscheduler.schedulers.background import BackgroundScheduler
from ping3 import ping
from sqlalchemy.orm import Session
from . import crud, models, database

def ping_device():
  db: Session = database.SessionLocal()
  devices = crud.get_device(db)
  for device in devices:
    result = ping(device.ip_address, timeout=2)
    status = result is not None
    crud.update_device_status(db, device.id, status)
  db.close()

scheduler = BackgroundScheduler()
scheduler.add_job(ping_device, 'interval', minutes=1)
scheduler.start()
