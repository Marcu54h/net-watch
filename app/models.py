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
  history = relationship("PingHistory", back_populates="device", cascade="all, delete")

class User(Base):
  __tablename__ = "users"
  
  id = Column(Integer, primary_key=True, index=True)
  email = Column(String, unique=True, nullable=False)
  hashed_password = Column(String, nullable=False)
  devices = relationship("Device", back_populates="owner")

class PingHistory(Base):
  __tablename__ = "ping_history"
  
  id = Column(Integer, primary_key=True, index=True)
  device_id = Column(Integer, ForeignKey("devices.id"))
  timestamp = Column(DateTime, default=datetime.now(timezone.utc))
  is_online = Column(Boolean)
  
  device = relationship("Device", back_populates="history")