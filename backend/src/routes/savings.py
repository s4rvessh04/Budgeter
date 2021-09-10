from . import *
from .auth import get_current_active_user

router = APIRouter()


@router.get("/all", response_model=List[schemas.Saving])
def read_savings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.Saving.read_savings(db=db, skip=skip, limit=limit)


@router.get("/", response_model=List[schemas.Saving])
def read_user_savings(
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud.Saving.read_saving(db=db, user_id=current_user.id)


@router.post("/", response_model=schemas.Saving)
def create_user_saving(
    data: schemas.SavingCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud.Saving.create_saving(db=db, user_id=current_user.id, data=data)


@router.put("/", response_model=schemas.Saving)
def update_user_saving(
    data: schemas.SavingCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    saving_id: int = Query(None),
    db: Session = Depends(get_db),
):
    saving = crud.Saving.update_saving(
        db=db, user_id=current_user.id, saving_id=saving_id, data=data
    )
    if saving is None:
        raise HTTPException(404, detail="No savings found for this user.")
    return saving


@router.delete("/", status_code=200)
def delete_user_savings(
    saving_id_s: List[int],
    current_user: schemas.User = Depends(get_current_active_user),
    all: bool = False,
    db: Session = Depends(get_db),
):
    if crud.Saving.delete_saving(
        db=db, user_id=current_user.id, saving_id_s=saving_id_s, all=all
    ):
        return {"msg": "Successfully deleted."}
    raise HTTPException(404, detail="Nothing to delete for this user.")
