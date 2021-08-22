from sqlalchemy import (Boolean, Column, Date, DateTime,
                        ForeignKey, Integer, String, Float)

from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    username = Column(String(100), unique=True)
    email = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(50))
    is_active = Column(Boolean, default=True)

    expense = relationship("Expense", back_populates="user")


class Friend(Base):
    __tablename__ = "friends"

    user_id = Column(Integer, ForeignKey("users.id"),
                     index=True, primary_key=True)
    friend_id = Column(Integer, ForeignKey("users.id"),
                       index=True, primary_key=True)

    user = relationship("User", foreign_keys="Friend.user_id")
    friend = relationship("User", foreign_keys="Friend.friend_id")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow, index=True)
    amount = Column(Float, default=0.00)
    tag_id = Column(Integer, ForeignKey("tags.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    # user = relationship("User", backref="expenses")
    user = relationship("User", back_populates="expense")
    tag = relationship("Tag", backref="expenses")


class Saving(Base):
    __tablename__ = "savings"

    id = Column(Integer, primary_key=True, index=True)
    # No default: Will be populated every end of the month
    date = Column(Date, index=True)
    amount = Column(Float, default=0.00)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", backref="savings")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True, default=["owned", "due"])
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", backref="tags")


class MaxExpense(Base):
    __tablename__ = "max_expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, default=0.00)
    user_id = Column(Integer, ForeignKey("users.id"))
