from . import *

router = APIRouter()


@router.get("/{user_id}", response_model=List[schemas.Expense])
def read_expenses(user_id: int, db: Session = Depends(get_db)):
    raw_data = crud.Expense.get_expense_by_id(db=db, user_id=user_id)

    return raw_data


@router.post("/", response_model=schemas.Expense)
def create_expense(data: schemas.ExpenseCreate, db=Depends(get_db)):
    return crud.Expense.create_expense(db=db, expense=data)


def create_members():
    ...
