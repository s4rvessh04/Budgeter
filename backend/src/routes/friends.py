from sqlalchemy.sql.functions import user
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
    """
    Whenever a request is recieved both the id's of the respecitve users are validated to check if they are not the same,
    and check the request_status to be false for the second user by default,
    if the friend exist in other's list but request_status is false,
    then it is updated to true for the second user which will allow both the users to share their expenses.
    """

    if user_id == data.friend_id:
        raise HTTPException(status_code=400, detail="Cannot assign same id as friend")

    friend_exist = crud.Friend.check_friend_exists(
        db, user_id=user_id, friend_id=data.friend_id
    )

    if friend_exist is None:
        return crud.Friend.create_friend(db=db, data=data)

    if friend_exist:
        raise HTTPException(status_code=400, detail="Friend already in friend list")
    return crud.Friend.update_friend(db=db, user_id=user_id, data=data)


@router.put("/{user_id}", response_model=schemas.Friend)
def update_friend(
    user_id: int, data: schemas.FriendCreate, db: Session = Depends(get_db)
):
    return crud.Friend.update_friend(db=db, user_id=user_id, data=data)


@router.delete("/{user_id}", status_code=200)
def delete_friend(
    user_id: int, data: schemas.FriendCreate, db: Session = Depends(get_db)
):
    ...


# TODO: Add a pending friends method.
