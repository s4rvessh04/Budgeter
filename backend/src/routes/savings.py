from datetime import datetime

from . import *

router = APIRouter()


@router.get("/", response_model=List[schemas.Saving])
def read_savings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.Saving.read_savings(db=db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=List[schemas.Saving])
def read_user_savings(user_id: int, db: Session = Depends(get_db)):
    return crud.Saving.read_saving(db=db, user_id=user_id)


@router.post("/", response_model=schemas.Saving)
def create_user_saving(data: schemas.SavingCreate, db: Session = Depends(get_db)):
    return crud.Saving.create_saving(db=db, data=data)


@router.put("/{user_id}", response_model=schemas.Saving)
def update_user_saving(
    user_id: int, data: schemas.Saving, db: Session = Depends(get_db)
):
    # All the user's savings will have an index in the returned list,
    # so take that index in order to update the date / amount or both.
    # Although only the amount updating makes more sense.
    return crud.Saving.update_saving(db=db, user_id=user_id, id=data.id, data=data)


@router.delete("/{user_id}", status_code=200)
def delete_user_savings(
    user_id: int, id: Tuple[int], all: bool = False, db: Session = Depends(get_db)
):
    # When all is True, delete all of the user savings,
    # When all is False, delete only the supplied id(s) saving
    return crud.Saving.delete_saving(db=db, user_id=user_id, id=id, all=all)