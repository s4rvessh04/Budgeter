from . import *

router = APIRouter()


@router.get("/", response_model=List[schemas.MaxExpense])
def read_max_expenses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.MaxExpense.get_max_expenses(db=db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=List[schemas.MaxExpense])
def read_user_max_expense(user_id: int, db: Session = Depends(get_db)):
    if not crud.User.get_user(db=db, user_id=user_id):
        raise HTTPException("404", detail="User id not found.")
    return crud.MaxExpense.get_user_max_expense_by_id(db=db, user_id=user_id)


@router.post("/", response_model=schemas.MaxExpense)
def create_max_expense(data: schemas.MaxExpenseCreate, db: Session = Depends(get_db)):
    if data.amount == 0:
        raise HTTPException(400, detail="Amount must be greater than 0.")

    if crud.MaxExpense.get_user_max_expense_by_id(db=db, user_id=data.user_id):
        return crud.MaxExpense.update_max_expense(db=db, data=data)

    return crud.MaxExpense.create_max_expense(db=db, data=data)
