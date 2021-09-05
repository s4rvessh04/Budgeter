from . import *

router = APIRouter()


@router.get("/", response_model=List[schemas.Tag])
def read_tags(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.Tag.get_tags(db=db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=List[schemas.Tag])
def read_user_tags(user_id: int, db: Session = Depends(get_db)):
    return crud.Tag.get_user_tags(db=db, user_id=user_id)


@router.post("/{user_id}", response_model=schemas.Tag)
def create_user_tag(
    user_id: int, data: schemas.TagCreate, db: Session = Depends(get_db)
):
    return crud.Tag.create_tag(db=db, data=data, user_id=user_id)


@router.put("/{user_id}", response_model=schemas.Tag)
def update_user_tag(
    user_id: int, id: int, data: schemas.TagCreate, db: Session = Depends(get_db)
):
    return crud.Tag.update_tag(db=db, user_id=user_id, id=id, data=data)


@router.delete("/{user_id}", status_code=200)
def delete_user_tag(
    user_id: int, id_s: List[int], all: bool = False, db: Session = Depends(get_db)
):
    if crud.Tag.delete_tags(db=db, user_id=user_id, id_s=id_s, all=all):
        return {"msg": "Successfully deleted."}
    return HTTPException(404, detail="Nothing to delete for this user.")
