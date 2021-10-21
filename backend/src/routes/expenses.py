from . import *
from .auth import get_current_active_user

router = APIRouter()


@router.get("/", response_model=List[schemas.Expense])
def read_user_expenses(
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud.Expense.get_expense_by_id(db=db, user_id=current_user.id)


@router.get("/shared", response_model=List[schemas.SharedExpense])
def read_shared_expense(
    skip: int = 0,
    limit: int = 100,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud.SharedExpense.read_shared_expense(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )


@router.get("/due", response_model=List[schemas.SharedExpense])
def read_due_expense(
    skip: int = 0,
    limit: int = 100,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud.SharedExpense.read_due_expense(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )


@router.post("/", response_model=schemas.Expense)
def create_expense(
    data: schemas.ExpenseCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    main_expense = crud.Expense.create_expense(
        db=db, user_id=current_user.id, expense=data
    )

    if data.shared:
        crud.SharedExpense.create_shared_expense(
            db=db,
            user_id=current_user.id,
            data=data.shared_expense,
            expense_id=main_expense.id,
        )

    return main_expense


@router.put("/", response_model=schemas.Expense)
def update_expense(
    data: schemas.ExpenseCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    expense_id: int = Query(None),
    db: Session = Depends(get_db),
):
    return crud.Expense.update_expense(
        db=db, user_id=current_user.id, expense_id=expense_id, data=data
    )


@router.put("/shared", response_model=schemas.SharedExpense)
def update_shared_expense(
    data: schemas.SharedExpenseCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    expense_id: int = Query(None),
    db: Session = Depends(get_db),
):
    return crud.SharedExpense.update_shared_expense(
        db=db, user_id=current_user.id, expense_id=expense_id, data=data
    )


@router.delete("/", status_code=200)
def delete_expense(
    expense_id_s: List[int],
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    deleted_rows = crud.Expense.delete_expense(
        db=db, user_id=current_user.id, expense_id_s=expense_id_s
    )
    if deleted_rows:
        return {"msg": "Successfully deleted."}
    raise HTTPException(404, detail="Nothing to delete for this user.")


@router.delete("/shared", status_code=200)
def delete_shared_expenses(
    expense_id: int,
    shared_expense_id_s: List[int],
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if crud.SharedExpense.delete_shared_expense(
        db=db,
        user_id=current_user.id,
        expense_id=expense_id,
        shared_expense_id_s=shared_expense_id_s,
    ):
        return {"msg": "Successfully deleted."}
    raise HTTPException(404, detail="Nothing to delete for this user.")
