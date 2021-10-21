from . import *
from .auth import get_current_active_user

router = APIRouter()


@router.get("/", response_model=List[schemas.Friend])
def read_friends(
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud.Friend.get_friends_by_id(db, user_id=current_user.id)


@router.get("/addFriends/", response_model=List[schemas.UserBase])
def read_potential_friends(
    skip: int = 0,
    limit: int = 100,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud.Friend.get_potential_friends(
        db=db, user_id=current_user.id, limit=limit, skip=skip
    )


@router.post("/", response_model=schemas.Friend)
def create_friend(
    data: schemas.FriendCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if current_user.id == data.friend_id:
        raise HTTPException(status_code=400, detail="Cannot assign same id as friend")

    friend_exist = crud.Friend.check_friend_exists(
        db, user_id=current_user.id, friend_id=data.friend_id
    )
    if friend_exist:
        raise HTTPException(status_code=400, detail="Friend already in friend list")
    elif friend_exist is None:
        return crud.Friend.create_friend(db=db, user_id=current_user.id, data=data)

    return crud.Friend.update_friend(
        db=db, user_id=current_user.id, friend_id=data.friend_id
    )


@router.put("/", response_model=schemas.Friend)
def update_friend(
    data: schemas.FriendCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud.Friend.update_friend(
        db=db, user_id=current_user.id, friend_id=data.friend_id
    )


@router.delete("/", status_code=200)
def delete_friend(
    friend_id_s: List[int],
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if crud.Friend.delete_friend(
        db=db, user_id=current_user.id, friend_id_s=friend_id_s
    ):
        return {"msg": "Successfully deleted."}
    raise HTTPException(404, detail="Nothing to delete for this user.")
