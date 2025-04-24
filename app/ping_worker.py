from apscheduler.schedulers.background import BackgroundScheduler
from ping3 import ping
from sqlalchemy.orm import Session
from . import crud, models, database

def ping_device():
    db: Session = database.SessionLocal()
    devices = crud.get_devices(db)

    for device in devices:
        result = ping(device.ip_address, timeout=2)
        current_status = result is not None

        # Tylko jeśli status się zmienił
        if current_status != device.is_online:
            crud.update_device_status(db, device.id, current_status)
            crud.save_ping_result(db, device.id, current_status)

    db.close()


scheduler = BackgroundScheduler()
scheduler.add_job(ping_device, 'interval', minutes=1)
scheduler.start()

