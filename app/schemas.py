from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class DeviceCreate(BaseModel):
  name: str
  ip_address: str
  description: Optional[str] = None

class DeviceOut(BaseModel):
  id: int
  name: str
  ip_address: str
  description: Optional[str]
  is_online: bool
  last_checked: datetime
  
  class Config:
    from_attributes = True

# ==== User ====
class UserCreate(BaseModel):
  email: EmailStr
  password: str

class UserOut(BaseModel):
  id: int
  email: EmailStr
  class Config:
    from_attributes = True

class PingRecord(BaseModel):
  timestamp: datetime
  is_online: bool
  
  class Config:
    from_attributes = True