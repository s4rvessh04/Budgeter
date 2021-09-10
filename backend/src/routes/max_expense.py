from . import *
from .auth import get_current_active_user

router = APIRouter()


@router.get("/all", response_model=List[schemas.MaxExpense])
def read_max_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.MaxExpense.get_max_expenses(db=db, skip=skip, limit=limit)


@router.get("/", response_model=schemas.MaxExpense)
def read_user_max_expense(
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if crud.User.get_user(db=db, user_id=current_user.id):
        return crud.MaxExpense.get_user_max_expense_by_id(
            db=db, user_id=current_user.id
        )
    raise HTTPException("404", detail="User id not found.")


@router.post("/", response_model=schemas.MaxExpense)
def create_max_expense(
    data: schemas.MaxExpenseCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if data.amount == 0:
        raise HTTPException(400, detail="Amount must be greater than 0.")

    if crud.MaxExpense.get_user_max_expense_by_id(db=db, user_id=current_user.id):
        return crud.MaxExpense.update_max_expense(
            db=db, user_id=current_user.id, data=data
        )

    return crud.MaxExpense.create_max_expense(db=db, data=data, user_id=current_user.id)


@router.put("/", response_model=schemas.MaxExpense)
def update_max_expense(
    data: schemas.MaxExpenseCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud.MaxExpense.update_max_expense(db=db, user_id=current_user.id, data=data)


@router.delete("/", status_code=200)
def delete_max_expenese(
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if crud.MaxExpense.delete_max_expense(db=db, user_id=current_user.id):
        return {"msg": "Successfully deleted."}
    raise HTTPException(404, detail="Nothing to delete for this user.")
