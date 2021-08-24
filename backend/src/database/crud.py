from sqlalchemy.orm import Session

from . import models, schemas


class User:

    def get_user(db: Session, user_id: int):
        return db.query(models.User).filter(models.User.id == user_id).first()

    def get_user_by_email(db: Session, email: str):
        return db.query(models.User).filter(models.User.email == email).first()

    def get_user_by_username(db: Session, username: str):
        return db.query(models.User).filter(models.User.username == username).first()

    def get_users(db: Session, skip: int = 0, limit: int = 100):
        return db.query(models.User).offset(skip).limit(limit).all()

    def create_user(db: Session, user: schemas.UserCreate):
        fake_hashed_password = user.password
        db_user = models.User(
            name=user.name,
            username=user.username,
            email=user.email,
            hashed_password=fake_hashed_password
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user


class Friend:
    def get_friends_by_id(db: Session, user_id: int):
        return db.query(models.Friend).filter(models.Friend.user_id == user_id).all()

        # Returns Only the friend_id column
        # return db.query(models.Friend).with_entities(models.Friend.friend_id).filter(models.Friend.user_id == user_id).all()

    def get_friends_by_username(db: Session, username: str):
        return db.query(models.Friend).filter(models.Friend.user_id == User.get_user_by_username(db, username).id).all()

    def check_friend_exists(db: Session, user_id: int, friend_id: int):
        statement = db.query(models.Friend).filter(
            models.Friend.user_id == user_id, models.Friend.friend_id == friend_id).all()
        if statement:
            return True
        return False

    def create_friend(db: Session, data: schemas.FriendCreate):
        db_friend_relation = models.Friend(user_id=data.user_id, friend_id=data.friend_id)

        db.add(db_friend_relation)
        db.commit()
        db.refresh(db_friend_relation)
        return db_friend_relation


class Expense:
    def get_expense_by_id(db: Session, user_id: int):
        return db.query(models.Expense).filter(models.Expense.user_id == user_id).all()

    def create_expense(db: Session, expense: schemas.ExpenseCreate):
        entry = models.Expense(**expense.dict())

        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry


class MaxExpense:
    def get_max_expenses(db: Session, skip: int = 0, limit: int = 100):
        return db.query(models.MaxExpense).offset(skip).limit(limit).all()

    def get_user_max_expense_by_id(db: Session, user_id: int):
        return db.query(models.MaxExpense).filter(models.MaxExpense.user_id == user_id).all()

    def create_max_expense(db: Session, data: schemas.MaxExpenseCreate):
        entry = models.MaxExpense(**data.dict())

        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

    def update_max_expense(db: Session, data: schemas.MaxExpenseCreate):
        user_max_expense = db.query(models.MaxExpense).filter(
            models.MaxExpense.user_id == data.user_id)
        user_max_expense.update({"amount": data.amount}, synchronize_session=False)

        db.commit()
        return db.query(models.MaxExpense).filter(models.MaxExpense.user_id == data.user_id).one_or_none()
