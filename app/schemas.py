from pydantic import BaseModel
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
    orm_mode = True

# ==== User ====
class UserCreate(BaseModel):
  email: str
  password: str

class UserOut(BaseModel):
  id: int
  email: str
  class Config:
    orm_mode = True
    