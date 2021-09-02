from datetime import datetime
from . import *

router = APIRouter()


@router.get("/{user_id}", response_model=List[schemas.Expense])
def read_user_expenses(user_id: int, db: Session = Depends(get_db)):
    raw_data = crud.Expense.get_expense_by_id(db=db, user_id=user_id)

    return raw_data


@router.get("/{user_id}/shared", response_model=List[schemas.SharedExpense])
def read_shared_expense(
    user_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):

    return crud.SharedExpense.read_shared_expense(
        db=db, user_id=user_id, skip=skip, limit=limit
    )


@router.post("/{user_id}", response_model=schemas.Expense)
def create_expense(
    user_id: int, data: schemas.ExpenseCreate, db: Session = Depends(get_db)
):
    main_expense = crud.Expense.create_expense(db=db, user_id=user_id, expense=data)

    if data.shared:
        crud.SharedExpense.create_shared_expense(
            db=db,
            user_id=user_id,
            data=data.shared_expense,
            expense_id=main_expense.id,
        )

    return main_expense


@router.put("/{user_id}", response_model=schemas.Expense)
def update_expense(
    user_id: int, id: int, data: schemas.ExpenseCreate, db: Session = Depends(get_db)
):
    return crud.Expense.update_expense(db=db, user_id=user_id, id=id, data=data)


@router.put("/{user_id}/shared/{expense_id}", response_model=schemas.SharedExpense)
def update_shared_expense(
    user_id: int,
    expense_id: int,
    data: schemas.SharedExpenseCreate,
    db: Session = Depends(get_db),
):
    return crud.SharedExpense.update_shared_expense(
        db=db, user_id=user_id, expense_id=expense_id, data=data
    )


@router.delete("/{user_id}", status_code=200)
def delete_expense(user_id: int, id_s: List[int], db: Session = Depends(get_db)):
    return crud.Expense.delete_expense(db=db, user_id=user_id, id_s=id_s)


@router.delete("/{user_id}/shared/{expense_id}", status_code=200)
def delete_shared_expenses(
    user_id: int,
    expense_id: int,
    shared_expense_id_s: List[int],
    db: Session = Depends(get_db),
):
    return crud.SharedExpense.delete_shared_expense(
        db=db,
        user_id=user_id,
        expense_id=expense_id,
        shared_expense_id_s=shared_expense_id_s,
    )
