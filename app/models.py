from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class Device(Base):
  __tablename__ = "devices"
  
  id = Column(Integer, primary_key=True, index=True)
  name = Column(String, nullable=False)
  ip_address = Column(String, unique=True, nullable=False)
  description = Column(String, nullable=True)
  is_online = Column(Boolean, default=False)
  last_checked = Column(DateTime, default=datetime.now(timezone.utc))
  
  owner_id = Column(Integer, ForeignKey("users.id"))
  owner = relationship("User", back_populates="devices")

class User(Base):
  __tablename__ = "users"
  
  id = Column(Integer, primary_key=True, index=True)
  email = Column(String, unique=True, nullable=False)
  hashed_password = Column(String, nullable=False)
  devices = relationship("Device", back_populates="owner")