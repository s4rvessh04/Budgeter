from datetime import datetime
from typing import List, Dict, Optional

from pydantic import BaseModel, EmailStr


class TagBase(BaseModel):
    name: str


class TagCreate(TagBase):
    user_id: int


class Tag(TagBase):
    id: int

    class Config:
        orm_mode = True


class FriendBase(BaseModel):
    pass


class FriendCreate(FriendBase):
    friend_id: int
    request_status: bool = False


class Friend(FriendBase):
    user_id: int
    friend_id: int
    request_status: bool

    class Config:
        orm_mode = True


class SavingBase(BaseModel):
    pass


class SavingCreate(SavingBase):
    date: datetime = None
    amount: float


class Saving(SavingBase):
    id: int
    user_id: int
    date: datetime = None
    amount: float

    class Config:
        orm_mode = True


class MaxExpenseBase(BaseModel):
    pass


class MaxExpenseCreate(MaxExpenseBase):
    amount: float


class MaxExpense(MaxExpenseBase):
    id: int
    user_id: int
    amount: float

    class Config:
        orm_mode = True


class SharedExpenseBase(BaseModel):
    pass


class SharedExpenseCreate(SharedExpenseBase):
    members_and_amount: Dict[int, float]
    description: Optional[str] = None
    tag_id: int = None


class SharedExpense(SharedExpenseBase):
    id: int
    expense_id: int
    main_user_id: int
    member_id: int
    amount: float
    description: str
    date: datetime
    tag_id: int = None

    class Config:
        orm_mode = True


class ExpenseBase(BaseModel):
    pass


class ExpenseCreate(ExpenseBase):
    description: str = None
    amount: float
    tag_id: Optional[int] = None
    shared: bool = False
    shared_expense: SharedExpenseCreate = None


class Expense(ExpenseBase):
    id: int
    user_id: int
    date: datetime
    description: str = None
    amount: float
    tag_id: int = None
    shared: bool
    shared_expenses: List[SharedExpense] = []

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    name: str = None
    username: str = None
    email: EmailStr = None


class UserCreate(UserBase):
    password: str = None


class User(UserBase):
    id: int
    is_active: bool
    friends: List[Friend] = []
    expenses: List[Expense] = []
    savings: List[Saving] = []
    tags: List[Tag] = []
    max_expense: List[MaxExpense] = []

    class Config:
        orm_mode = True
