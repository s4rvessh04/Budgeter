from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    name: str = None
    username: str = None
    email: EmailStr = None

    class Config:
        orm_mode = True


class UserCreate(UserBase):
    password: str = None


class TagBase(BaseModel):
    name: str


class TagCreate(TagBase):
    pass


class Tag(TagBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True


class FriendBase(BaseModel):
    pass


class FriendCreate(FriendBase):
    friend_id: int
    request_status: bool = False


class Friend(UserBase):
    friend_id: int
    request_status: bool

    class Config:
        orm_mode = True


class AddFriend(UserBase):
    id: int

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


class SharedExpenseStructure(SharedExpenseBase):
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


class SharedExpense(SharedExpenseBase):
    SharedExpense: SharedExpenseStructure = None
    User: UserBase = None

    class Config:
        orm_mode = True
        fields = {"User": "MemberUser"}  # Used for defining alias for a field
        allow_population_by_field_name = (
            True  # Is required if we have user defined dataclasses
        )


class ExpenseBase(BaseModel):
    id: int = None
    user_id: int = None
    date: datetime = None
    description: str = None
    amount: float = None
    tag_id: Optional[int] = None
    shared: bool = None

    class Config:
        orm_mode = True


class ExpenseCreate(ExpenseBase):
    shared_expense: SharedExpenseCreate = None


class Expense(ExpenseBase):
    shared_expenses: List[SharedExpenseStructure] = []

    class Config:
        orm_mode = True


class User(UserBase):
    id: int
    is_active: bool
    friends: List[Friend] = []
    expenses: List[Expense] = []
    tags: List[Tag] = []
    max_expense: List[MaxExpense] = []
    shared_expenses: List[SharedExpenseStructure] = []

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
