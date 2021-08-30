from . import *

router = APIRouter()


@router.get("/{user_id}", response_model=List[schemas.Expense])
def read_expenses(user_id: int, db: Session = Depends(get_db)):
    raw_data = crud.Expense.get_expense_by_id(db=db, user_id=user_id)

    return raw_data


@router.post("/{user_id}")
# @router.post("/{user_id}", response_model=List[schemas.SharedExpense])
# @router.post("/{user_id}", response_model=schemas.Expense)
def create_expense(
    user_id: int, data: schemas.ExpenseCreate, db: Session = Depends(get_db)
):
    main_expense = crud.Expense.create_expense(db=db, user_id=user_id, expense=data)

    if data.shared:
        shared_obj = {}

        shared_expense = crud.SharedExpense.create_shared_expense(
            db=db,
            user_id=user_id,
            data=data.shared_expense,
            expense_id=main_expense.id,
        )
        # TODO: Add this logic in crud create_expense, make seperate function.
        # members_and_amount = dict()

        # for obj in shared_expense:
        #     members_and_amount[obj.member_id] = obj.amount

        # shared_obj["members_and_amount"] = members_and_amount
        # shared_obj.update(shared_expense[0])

        # return shared_obj
        return shared_expense

    return main_expense


@router.put("/{user_id}", response_model=schemas.Expense)
def update_expense(
    user_id: int, id: int, data: schemas.ExpenseCreate, db: Session = Depends(get_db)
):
    return crud.Expense.update_expense(db=db, user_id=user_id, data=data)


@router.delete("/{user_id}", status_code=200)
def delete_expense(user_id: int, id: int, db: Session = Depends(get_db)):
    return crud.Expense.delete_expense(db=db, user_id=user_id, id=id)
