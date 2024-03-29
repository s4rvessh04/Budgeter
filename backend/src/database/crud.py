from typing import List

from sqlalchemy import extract
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import and_, or_

from utils.password import get_password_hash

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
        hashed_password = get_password_hash(user.password)

        db_user = models.User(
            name=user.name,
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def update_user(user_id: int, data: schemas.UserCreate, db: Session):
        user = db.query(models.User).filter(models.User.id == user_id)

        if data.password != None:
            hashed_password = {"hashed_password": get_password_hash(data.password)}
            data = data.copy(update=hashed_password)

        user.update(
            data.dict(exclude={"password"}, exclude_unset=True, exclude_none=True),
            synchronize_session="fetch",
        )

        db.commit()
        return user.one_or_none()

    def delete_user(user_id: int, db: Session):
        deleted_rows_count = (
            db.query(models.User)
            .filter(models.User.id == user_id)
            .delete(synchronize_session="fetch")
        )
        db.commit()
        return deleted_rows_count


class Friend:
    def get_all_friends_by_id(db: Session, user_id: int):
        return (
            db.query(
                models.Friend.request_status,
                models.Friend.friend_id,
                models.User.username,
                models.User.name,
                models.User.email,
            )
            .filter(models.Friend.user_id == user_id)
            .join(
                models.User,
                models.Friend.friend_id == models.User.id,
            )
            .all()
        )

    def get_pending_friend_request_by_id(db: Session, user_id: int):
        return (
            db.query(
                models.Friend.request_status,
                models.Friend.friend_id,
                models.User.username,
                models.User.name,
                models.User.email,
            )
            .filter(
                models.Friend.user_id == user_id, models.Friend.request_status == False
            )
            .join(
                models.User,
                models.Friend.friend_id == models.User.id,
            )
            .all()
        )

    def get_friends_by_id(db: Session, user_id: int):

        return (
            db.query(
                models.Friend.request_status,
                models.Friend.friend_id,
                models.User.username,
                models.User.name,
                models.User.email,
            )
            .filter(
                models.Friend.user_id == user_id, models.Friend.request_status == True
            )
            .join(
                models.User,
                models.Friend.friend_id == models.User.id,
            )
            .all()
        )

    def get_potential_friends(db: Session, user_id: int, limit: int, skip: int):
        user_friend_id_s = db.query(models.Friend.friend_id).filter_by(user_id=user_id)
        return (
            db.query(
                models.User.id,
                models.User.username,
                models.User.name,
                models.User.email,
            )
            .filter(models.User.id.notin_(user_friend_id_s), models.User.id != user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def check_friend_exists(db: Session, user_id: int, friend_id: int):
        friend = (
            db.query(models.Friend)
            .filter(
                models.Friend.user_id == user_id, models.Friend.friend_id == friend_id
            )
            .one_or_none()
        )
        if friend is None:
            return friend
        return True if friend.request_status == True else False

    def create_friend(db: Session, user_id: int, data: schemas.FriendCreate):
        db_user_relation = models.Friend(
            user_id=user_id, friend_id=data.friend_id, request_status=True
        )
        db.add(db_user_relation)
        db.commit()
        db.refresh(db_user_relation)

        db_friend_relation = models.Friend(user_id=data.friend_id, friend_id=user_id)
        db.add(db_friend_relation)
        db.commit()
        db.refresh(db_friend_relation)

        return db_user_relation

    def update_friend(db: Session, user_id: int, friend_id: int):
        friend = db.query(models.Friend).filter(
            models.Friend.user_id == user_id,
            models.Friend.friend_id == friend_id,
        )
        friend.update(
            {"request_status": False if friend.one_or_none().request_status else True},
            synchronize_session="fetch",
        )
        db.commit()
        return friend.one_or_none()

    def delete_friend(db: Session, user_id: int, friend_id_s: List[int]):
        deleted_user_row_count = (
            db.query(models.Friend)
            .filter(
                models.Friend.user_id == user_id,
                models.Friend.friend_id.in_(friend_id_s),
            )
            .delete(synchronize_session="fetch")
        )
        deleted_friend_row_count = (
            db.query(models.Friend)
            .filter(
                models.Friend.friend_id == user_id,
                models.Friend.user_id.in_(friend_id_s),
            )
            .delete(synchronize_session="fetch")
        )
        db.commit()
        return deleted_user_row_count + deleted_friend_row_count


class Expense:
    def get_expense_by_id(
        db: Session,
        user_id: int,
        year: str,
        month: str,
        day: str,
        skip: int,
        limit: int,
    ):
        if not year and not month and not day:
            return (
                db.query(models.Expense)
                .filter(models.Expense.user_id == user_id)
                .offset(skip)
                .limit(limit)
                .all()
            )
        if day:
            return (
                db.query(models.Expense)
                .filter(models.Expense.user_id == user_id)
                .filter(
                    and_(
                        extract("year", models.Expense.date) == year,
                        extract("month", models.Expense.date) == month,
                        extract("day", models.Expense.date) == day,
                    )
                )
                .offset(skip)
                .limit(limit)
                .all()
            )
        return (
            db.query(models.Expense)
            .filter(models.Expense.user_id == user_id)
            .filter(
                or_(
                    extract("year", models.Expense.date) == year,
                    extract("month", models.Expense.date) == month,
                )
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_expense(db: Session, user_id: int, expense: schemas.ExpenseCreate):
        entry = models.Expense(
            **expense.dict(exclude_unset=True, exclude={"shared_expense"}),
            user_id=user_id,
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

    def update_expense(
        db: Session,
        user_id: int,
        expense_id: int,
        data: schemas.ExpenseCreate,
    ):
        expense = db.query(models.Expense).filter(
            models.Expense.user_id == user_id, models.Expense.id == expense_id
        )
        expense.update(data.dict(exclude_unset=True), synchronize_session="fetch")
        db.commit()
        return expense.one_or_none()

    def delete_expense(db: Session, user_id: int, expense_id_s: List[int]):
        deleted_rows_count = (
            db.query(models.Expense)
            .filter(
                models.Expense.user_id == user_id, models.Expense.id.in_(expense_id_s)
            )
            .delete(synchronize_session="fetch")
        )
        db.commit()
        return deleted_rows_count


class SharedExpense:
    def create_shared_expense(
        db: Session, user_id: int, expense_id: int, data: schemas.SharedExpenseCreate
    ):
        members_and_amount = data.members_and_amount

        def enter_all():
            for member in members_and_amount:
                entry = models.SharedExpense(
                    **data.dict(
                        exclude_unset=True,
                        exclude={"shared_expense", "members_and_amount"},
                    ),
                    member_id=member,
                    amount=members_and_amount[member],
                    expense_id=expense_id,
                    main_user_id=user_id,
                )
                yield entry

        entries = list(enter_all())
        for model_instance in entries:
            db.add(model_instance)
            db.commit()
            db.refresh(model_instance)
        return True

    def read_shared_expense(
        db: Session,
        user_id: int,
        day: int,
        month: int,
        year: int,
        skip: int,
        limit: int,
    ):
        # This is where "owing data" is showed.
        # Meaning when a main user creates an expense, and there are some "n" members associated with the expense,
        # the "n" members owes "x" amount of money to main user.

        if not year and not month and not day:
            return (
                db.query(
                    models.SharedExpense,
                    models.User.name,
                    models.User.username,
                    models.User.email,
                )
                .filter(models.SharedExpense.member_id == user_id)
                .join(models.User, models.User.id == models.SharedExpense.member_id)
                .offset(skip)
                .limit(limit)
                .all()
            )
        if day:
            return (
                db.query(
                    models.SharedExpense,
                    models.User.name,
                    models.User.username,
                    models.User.email,
                )
                .filter(models.SharedExpense.member_id == user_id)
                .filter(
                    and_(
                        extract("year", models.SharedExpense.date) == year,
                        extract("month", models.SharedExpense.date) == month,
                        extract("day", models.SharedExpense.date) == day,
                    )
                )
                .join(models.User, models.User.id == models.SharedExpense.member_id)
                .offset(skip)
                .limit(limit)
                .all()
            )
        return (
            db.query(
                models.SharedExpense,
                models.User.name,
                models.User.username,
                models.User.email,
            )
            .filter(models.SharedExpense.member_id == user_id)
            .filter(
                or_(
                    extract("year", models.SharedExpense.date) == year,
                    extract("month", models.SharedExpense.date) == month,
                )
            )
            .join(models.User, models.User.id == models.SharedExpense.member_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def read_due_expense(db: Session, user_id: int, skip: int, limit: int):
        return (
            db.query(models.SharedExpense)
            .filter(models.SharedExpense.main_user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update_shared_expense(
        db: Session, user_id: int, expense_id: int, data: schemas.SharedExpenseCreate
    ):
        shared_expense = db.query(models.SharedExpense).filter(
            models.SharedExpense.main_user_id == user_id,
            models.SharedExpense.expense_id == expense_id,
        )
        if data.members_and_amount:
            for member in data.members_and_amount:
                member_expense = db.query(models.SharedExpense).filter(
                    models.SharedExpense.main_user_id == user_id,
                    models.SharedExpense.member_id == member,
                )
                member_expense.update(
                    {"amount": data.members_and_amount[member]},
                    synchronize_session="fetch",
                )

        shared_expense.update(
            data.dict(exclude_unset=True, exclude={"members_and_amount"}),
            synchronize_session="fetch",
        )
        db.commit()
        return shared_expense.one_or_none()

    def delete_shared_expense(
        db: Session, user_id: int, expense_id: int, shared_expense_id_s: List[int]
    ):
        main_expense = db.query(models.SharedExpense).filter(
            models.SharedExpense.main_user_id == user_id,
            models.SharedExpense.expense_id == expense_id,
        )
        deleted_rows_count = main_expense.filter(
            models.SharedExpense.id.in_(shared_expense_id_s)
        ).delete(synchronize_session="fetch")
        db.commit()
        return deleted_rows_count


class MaxExpense:
    def get_max_expenses(db: Session, skip: int = 0, limit: int = 100):
        return db.query(models.MaxExpense).offset(skip).limit(limit).all()

    def get_user_max_expense_by_id(db: Session, user_id: int):
        return (
            db.query(models.MaxExpense)
            .filter(models.MaxExpense.user_id == user_id)
            .one_or_none()
        )

    def create_max_expense(db: Session, data: schemas.MaxExpenseCreate, user_id: int):
        entry = models.MaxExpense(**data.dict(), user_id=user_id)
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

    def update_max_expense(db: Session, user_id: int, data: schemas.MaxExpenseCreate):
        user_max_expense = db.query(models.MaxExpense).filter(
            models.MaxExpense.user_id == user_id
        )
        user_max_expense.update({"amount": data.amount}, synchronize_session="fetch")
        db.commit()
        return user_max_expense.one_or_none()

    def delete_max_expense(db: Session, user_id: int):
        deleted_rows_count = (
            db.query(models.MaxExpense)
            .filter(models.MaxExpense.user_id == user_id)
            .delete(synchronize_session="fetch")
        )
        db.commit()
        return deleted_rows_count


class Tag:
    def get_tags(db: Session, skip: int = 0, limit: int = 100):
        return db.query(models.Tag).offset(skip).limit(limit).all()

    def get_user_tags(db: Session, user_id: int):
        return db.query(models.Tag).filter(models.Tag.user_id == user_id).all()

    def create_tag(db: Session, user_id: int, data: schemas.TagCreate):
        entry = models.Tag(**data.dict(exclude_unset=True), user_id=user_id)
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

    def update_tag(db: Session, user_id: int, tag_id: int, data: schemas.TagCreate):
        user_tag = db.query(models.Tag).filter(
            models.Tag.user_id == user_id, models.Tag.id == tag_id
        )
        user_tag.update(data.dict(), synchronize_session="fetch")
        db.commit()
        return user_tag.one_or_none()

    def delete_tags(db: Session, user_id: int, tag_id_s: List[int], all: bool = False):
        if all:
            deleted_rows_count = (
                db.query(models.Tag)
                .filter(models.Tag.user_id == user_id)
                .delete(synchronize_session=False)
            )
        else:
            deleted_rows_count = (
                db.query(models.Tag)
                .filter(models.Tag.user_id == user_id, models.Tag.id.in_(tag_id_s))
                .delete(synchronize_session="fetch")
            )

        db.commit()
        return deleted_rows_count
