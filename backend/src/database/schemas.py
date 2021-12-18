from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    name: str = None
    username: str = None
    email: EmailStr = None


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
    name: str
    username: str
    email: str

    class Config:
        orm_mode = True


class ExpenseBase(BaseModel):
    pass


class ExpenseCreate(ExpenseBase):
    description: str = None
    amount: float = None
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
