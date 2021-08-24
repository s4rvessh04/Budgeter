from . import *

router = APIRouter()


@router.post("/{user_id}", response_model=schemas.Friend)
def create_friend(user_id: int, friend_id: int, db: Session = Depends(get_db)):
    if user_id == friend_id:
        raise HTTPException(status_code=400, detail="Cannot assign same id as friend")
    if crud.Friend.check_friend_exists(db, user_id=user_id, friend_id=friend_id):
        raise HTTPException(status_code=400, detail="Friend already in friend list")
    data = schemas.FriendCreate(user_id=user_id, friend_id=friend_id)
    return crud.Friend.create_friend(db=db, data=data)


@router.get("/{user_id}", response_model=List[schemas.Friend])
def read_friends(user_id: int, db: Session = Depends(get_db)):
    friend_list = crud.Friend.get_friends_by_id(db, user_id=user_id)
    friend_name_list = [{"name": crud.User.get_user(db, item.friend_id).name, "user_id": item.friend_id}
                        for item in friend_list]

    return friend_name_list
