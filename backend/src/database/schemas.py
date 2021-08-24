from datetime import datetime
from typing import List

from pydantic import BaseModel


class TagBase(BaseModel):
    name: str


class TagCreate(TagBase):
    user_id: int


class Tag(TagBase):
    id: int

    class Config:
        orm_mode = True


class FriendBase(BaseModel):
    user_id: int


class FriendCreate(FriendBase):
    friend_id: int


class Friend(FriendBase):
    friend_id: int

    class Config:
        orm_mode = True


class MaxExpenseBase(BaseModel):
    user_id: int


class MaxExpenseCreate(MaxExpenseBase):
    amount: float


class MaxExpense(MaxExpenseBase):
    id: int
    amount: float

    class Config:
        orm_mode = True


class ExpenseBase(BaseModel):
    user_id: int


class ExpenseCreate(ExpenseBase):
    amount: float
    tag_id: int


class Expense(ExpenseBase):
    id: int
    date: datetime
    amount: float
    tag_id: int

    class Config:
        orm_mode = True


class SavingBase(BaseModel):
    user_id: int


class SavingCreate(SavingBase):
    date: str
    amount: float


class Saving(SavingBase):
    id: int

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    name: str
    username: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool
    friends: List[Friend] = []
    expense: List[Expense] = []

    class Config:
        orm_mode = True
