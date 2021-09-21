from datetime import datetime

from sqlalchemy import DECIMAL, Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    username = Column(String(100), unique=True)
    name = Column(String(100), index=True)
    hashed_password = Column(String(100))
    is_active = Column(Boolean, default=True)

    expenses = relationship("Expense", back_populates="user", passive_deletes=True)
    savings = relationship("Saving", back_populates="user", passive_deletes=True)
    tags = relationship("Tag", back_populates="user", passive_deletes=True)
    max_expense = relationship(
        "MaxExpense", back_populates="user", passive_deletes=True
    )
    friends = relationship(
        "Friend",
        backref="Friend.friend_id",
        primaryjoin="User.id==Friend.user_id",
        lazy="joined",
        passive_deletes=True,
    )


class Friend(Base):
    __tablename__ = "friends"

    request_status = Column(Boolean, default=False)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    friend_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )


class MaxExpense(Base):
    __tablename__ = "max_expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(DECIMAL(19, 4), default=0.00)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    user = relationship("User", back_populates="max_expense")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow, index=True)
    amount = Column(DECIMAL(19, 4), default=0.00)
    description = Column(String(200))
    shared = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    tag_id = Column(Integer, ForeignKey("tags.id", ondelete="SET NULL"), nullable=True)

    user = relationship("User", back_populates="expenses")
    shared_expenses = relationship(
        "SharedExpense", back_populates="expense", passive_deletes=True
    )


class SharedExpense(Base):
    __tablename__ = "shared_expenses"

    id = Column(Integer, index=True, primary_key=True)
    date = Column(DateTime, default=datetime.utcnow)
    amount = Column(DECIMAL(19, 4), default=0.00)
    description = Column(String(200))
    member_id = Column(Integer, ForeignKey("users.id"))
    tag_id = Column(Integer, ForeignKey("tags.id", ondelete="SET NULL"), nullable=True)
    expense_id = Column(
        Integer, ForeignKey("expenses.id", ondelete="CASCADE"), index=True
    )
    # A user will not be able to delete his/her account,
    # provided there is related shared expense with other user.
    main_user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True
    )

    expense = relationship("Expense", back_populates="shared_expenses")


class Saving(Base):
    __tablename__ = "savings"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, index=True)
    amount = Column(DECIMAL(19, 4), default=0.00)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    user = relationship("User", back_populates="savings")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    user = relationship("User", back_populates="tags")
