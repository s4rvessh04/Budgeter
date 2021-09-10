from . import *
from .auth import get_current_active_user

router = APIRouter()


@router.get("/all", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.User.get_users(db, skip=skip, limit=limit)
    if not users:
        raise HTTPException(status_code=404, detail="No entries found")
    return users


@router.get("/", response_model=schemas.User)
def read_user(
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    db_user = crud.User.get_user(db, user_id=current_user.id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# Sign up route
@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.User.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.User.create_user(db=db, user=user)


@router.put("/", response_model=schemas.User)
def update_user(
    data: schemas.UserCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud.User.update_user(user_id=current_user.id, data=data, db=db)


@router.delete("/", status_code=200)
def delete_user(
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if crud.User.delete_user(user_id=current_user.id, db=db):
        return {"msg": "Successfully deleted."}
    raise HTTPException(404, detail="Nothing to delete for this user.")
