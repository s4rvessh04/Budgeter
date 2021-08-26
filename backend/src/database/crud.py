from typing import Tuple

from pydantic.schema import schema
from sqlalchemy.orm import Session

from . import models, schemas


class User:
    # Read methods
    def get_user(db: Session, user_id: int):
        return db.query(models.User).filter(models.User.id == user_id).first()

    def get_user_by_email(db: Session, email: str):
        return db.query(models.User).filter(models.User.email == email).first()

    def get_user_by_username(db: Session, username: str):
        return db.query(models.User).filter(models.User.username == username).first()

    def get_users(db: Session, skip: int = 0, limit: int = 100):
        return db.query(models.User).offset(skip).limit(limit).all()

    # Create methods
    def create_user(db: Session, user: schemas.UserCreate):
        fake_hashed_password = user.password
        db_user = models.User(
            name=user.name,
            username=user.username,
            email=user.email,
            hashed_password=fake_hashed_password,
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    # Update methods

    # Delete methods


class Friend:
    # Read methods
    def get_friends_by_id(db: Session, user_id: int):
        return db.query(models.Friend).filter(models.Friend.user_id == user_id).all()

        # Returns Only the friend_id column
        # return db.query(models.Friend).with_entities(models.Friend.friend_id).filter(models.Friend.user_id == user_id).all()

    def get_friends_by_username(db: Session, username: str):
        return (
            db.query(models.Friend)
            .filter(models.Friend.user_id == User.get_user_by_username(db, username).id)
            .all()
        )

    def check_friend_exists(db: Session, user_id: int, friend_id: int):
        statement = (
            db.query(models.Friend)
            .filter(
                models.Friend.user_id == user_id, models.Friend.friend_id == friend_id
            )
            .all()
        )
        if statement:
            return True
        return False

    # Create methods
    def create_friend(db: Session, data: schemas.FriendCreate):
        db_friend_relation = models.Friend(
            user_id=data.user_id, friend_id=data.friend_id
        )

        db.add(db_friend_relation)
        db.commit()
        db.refresh(db_friend_relation)
        return db_friend_relation

    # Update methods

    # Delete methods


class Expense:
    # Read methods
    def get_expense_by_id(db: Session, user_id: int):
        return db.query(models.Expense).filter(models.Expense.user_id == user_id).all()

    # Create methods
    def create_expense(db: Session, expense: schemas.ExpenseCreate):
        entry = models.Expense(**expense.dict())

        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

    # Update methods

    # Delete methods


class MaxExpense:
    # Read methods
    def get_max_expenses(db: Session, skip: int = 0, limit: int = 100):
        return db.query(models.MaxExpense).offset(skip).limit(limit).all()

    def get_user_max_expense_by_id(db: Session, user_id: int):
        return (
            db.query(models.MaxExpense)
            .filter(models.MaxExpense.user_id == user_id)
            .one_or_none()
        )

    # Create methods
    def create_max_expense(db: Session, data: schemas.MaxExpenseCreate, user_id: int):
        entry = models.MaxExpense(**data.dict(), user_id=user_id)

        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

    # Update methods
    def update_max_expense(db: Session, user_id: int, data: schemas.MaxExpenseCreate):
        user_max_expense = db.query(models.MaxExpense).filter(
            models.MaxExpense.user_id == user_id
        )
        user_max_expense.update({"amount": data.amount}, synchronize_session=False)

        db.commit()
        return (
            db.query(models.MaxExpense)
            .filter(models.MaxExpense.user_id == user_id)
            .one_or_none()
        )

    # Delete methods
    def delete_max_expense(db: Session, user_id: int):
        query = (
            db.query(models.MaxExpense)
            .filter(models.MaxExpense.user_id == user_id)
            .delete(synchronize_session=False)
        )
        db.commit()
        return query


class Tag:
    # Read methods
    def get_tags(db: Session, skip: int = 0, limit: int = 100):
        return db.query(models.Tag).offset(skip).limit(limit).all()

    def get_user_tags(db: Session, user_id: int):
        return db.query(models.Tag).filter(models.Tag.user_id == user_id).all()

    # Create methods
    def create_tag(db: Session, user_id: int, data: schemas.TagCreate):
        entry = models.Tag(**data.dict())

        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

    # Update methods
    def update_tag(db: Session, user_id: int, id: int, data: schemas.TagCreate):
        user_tag = db.query(models.Tag).filter(
            models.Tag.user_id == user_id, models.Tag.id == id
        )
        user_tag.update(data.dict(), synchronize_session=False)

        db.commit()
        return user_tag.one_or_none()

    # Delete methods
    def delete_tags(db: Session, user_id: int, id: Tuple[int], all: bool = False):
        if all:
            user_tags = (
                db.query(models.Tag)
                .filter(models.Tag.user_id == user_id)
                .delete(synchronize_session=False)
            )
        else:
            user_tags = (
                db.query(models.Tag)
                .filter(models.Tag.user_id == user_id, models.Tag.id.in_(id))
                .delete(synchronize_session=False)
            )

        db.commit()
        return user_tags


class Saving:
    # Read methods
    def read_savings(db: Session, skip: int = 0, limit: int = 100):
        return db.query(models.Saving).offset(skip).limit(limit).all()

    def read_saving(db: Session, user_id: int):
        return db.query(models.Saving).filter(models.Saving.user_id == user_id).all()

    # Create methods
    def create_saving(db: Session, data: schemas.SavingCreate):
        entry = models.Saving(**data.dict())

        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

    # Update methods
    def update_saving(db: Session, user_id: int, id: int, data: schemas.SavingCreate):
        user_saving = db.query(models.Saving).filter(
            models.Saving.user_id == user_id, models.Saving.id == id
        )
        user_saving.update(data.dict(), synchronize_session=False)

        db.commit()
        return user_saving.one_or_none()

    # Delete methods
    def delete_saving(db: Session, user_id: int, id: Tuple[int], all: bool):
        # if all:
        #     user_savings = (
        #         db.query(models.Tag)
        #         .filter(models.Tag.user_id == user_id)
        #         .delete(synchronize_session=False)
        #     )
        # else:
        user_savings = db.query(models.Saving).filter(
            models.Saving.user_id == user_id, models.Saving.id.in_(id) if all else None
        )
        user_savings.delete(synchronize_session=False)

        db.commit()
        return user_savings
