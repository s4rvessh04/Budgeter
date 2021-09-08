from . import *

router = APIRouter()


@router.get("/{user_id}", response_model=List[schemas.Friend])
def read_friends(user_id: int, db: Session = Depends(get_db)):
    friend_list = crud.Friend.get_friends_by_id(db, user_id=user_id)
    return friend_list


@router.post("/{user_id}", response_model=schemas.Friend)
def create_friend(
    user_id: int, data: schemas.FriendCreate, db: Session = Depends(get_db)
):
    if user_id == data.friend_id:
        raise HTTPException(status_code=400, detail="Cannot assign same id as friend")

    friend_exist = crud.Friend.check_friend_exists(
        db, user_id=user_id, friend_id=data.friend_id
    )

    if friend_exist:
        raise HTTPException(status_code=400, detail="Friend already in friend list")
    elif friend_exist is None:
        return crud.Friend.create_friend(db=db, user_id=user_id, data=data)
    return crud.Friend.update_friend(db=db, user_id=user_id, friend_id=data.friend_id)


@router.put("/{user_id}", response_model=schemas.Friend)
def update_friend(
    user_id: int, data: schemas.FriendCreate, db: Session = Depends(get_db)
):
    return crud.Friend.update_friend(db=db, user_id=user_id, friend_id=data.friend_id)


@router.delete("/{user_id}", status_code=200)
def delete_friend(user_id: int, friend_id_s: List[int], db: Session = Depends(get_db)):
    if crud.Friend.delete_friend(db=db, user_id=user_id, friend_id_s=friend_id_s):
        return {"msg": "Successfully deleted."}
    raise HTTPException(404, detail="Nothing to delete for this user.")
