from . import *
from .auth import get_current_active_user

router = APIRouter()


@router.get("/all", response_model=List[schemas.Tag])
def read_tags(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return crud.Tag.get_tags(db=db, skip=skip, limit=limit)


@router.get("/", response_model=List[schemas.Tag])
def read_user_tags(
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud.Tag.get_user_tags(db=db, user_id=current_user.id)


@router.post("/", response_model=schemas.Tag)
def create_user_tag(
    data: schemas.TagCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud.Tag.create_tag(db=db, data=data, user_id=current_user.id)


@router.put("/", response_model=schemas.Tag)
def update_user_tag(
    tag_id: int,
    data: schemas.TagCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud.Tag.update_tag(db=db, user_id=current_user.id, tag_id=tag_id, data=data)


@router.delete("/", status_code=200)
def delete_user_tag(
    tag_id_s: List[int],
    current_user: schemas.User = Depends(get_current_active_user),
    all: bool = False,
    db: Session = Depends(get_db),
):
    if crud.Tag.delete_tags(db=db, user_id=current_user.id, tag_id_s=tag_id_s, all=all):
        return {"msg": "Successfully deleted."}
    raise HTTPException(404, detail="Nothing to delete for this user.")
