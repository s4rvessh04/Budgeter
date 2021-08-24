from datetime import datetime

from sqlalchemy import (Boolean, Column, DateTime, Float, ForeignKey, Integer,
                        String)
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    username = Column(String(100), unique=True)
    email = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(50))
    is_active = Column(Boolean, default=True)

    max_expense = relationship("MaxExpense", back_populates="user")
    expenses = relationship("Expense", back_populates="user")
    savings = relationship("Saving", back_populates="user")
    tags = relationship("Tag", back_populates="user")
    friends = relationship("Friend", backref="Friend.friend_id",
                           primaryjoin="User.id==Friend.user_id", lazy="joined")


class Friend(Base):
    __tablename__ = "friends"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    friend_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    request_status = Column(Boolean, default=False)
    # Other user must accept request in order to reflect the user in friend list


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow, index=True)
    amount = Column(Float, default=0.00)
    tag_id = Column(Integer, ForeignKey("tags.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="expenses")
    tag = relationship("Tag", backref="expenses")


class Saving(Base):
    __tablename__ = "savings"

    id = Column(Integer, primary_key=True, index=True)
    # No default: Will be populated every end of the month
    date = Column(DateTime, index=True)
    amount = Column(Float, default=0.00)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="savings")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True, default=["owned", "due"])
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="tags")


class MaxExpense(Base):
    __tablename__ = "max_expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, default=0.00)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="max_expense")
