from . import *

router = APIRouter()


@router.get("/", response_model=List[schemas.Saving])
def read_savings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.Saving.read_savings(db=db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=List[schemas.Saving])
def read_user_savings(user_id: int, db: Session = Depends(get_db)):
    return crud.Saving.read_saving(db=db, user_id=user_id)


@router.post("/{user_id}", response_model=schemas.Saving)
def create_user_saving(
    user_id: int, data: schemas.SavingCreate, db: Session = Depends(get_db)
):
    return crud.Saving.create_saving(db=db, user_id=user_id, data=data)


@router.put("/{user_id}", response_model=schemas.Saving)
def update_user_saving(
    user_id: int, data: schemas.Saving, db: Session = Depends(get_db)
):
    return crud.Saving.update_saving(db=db, user_id=user_id, id=data.id, data=data)


@router.delete("/{user_id}", status_code=200)
def delete_user_savings(
    user_id: int, id_s: List[int], all: bool = False, db: Session = Depends(get_db)
):
    if crud.Saving.delete_saving(db=db, user_id=user_id, id_s=id_s, all=all):
        return {"msg": "Successfully deleted."}
    return HTTPException(404, detail="Nothing to delete for this user.")
