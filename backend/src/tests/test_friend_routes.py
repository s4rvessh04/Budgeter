import json

from database.schemas import Friend, FriendCreate, User

from .setup import client, handle_urls, test_user1_headers, test_user2_headers

URL = "api/v1/friends"


def test_create_friend():
    """
    Creates and validates the recieved data to be of type Friend

    REQUEST PARAMETERS:
        TYPE: POST

        URL: str (Authorized by token returned from handle_friend_auth method)

        DATA PARAMETER:
            friend_id : int
    """

    get_user = client.get(
        **handle_urls("api/v1/user", headers=test_user2_headers)
    ).json()
    friend_user = User(**get_user)
    data = {"friend_id": friend_user.id - 1}
    response = client.post(
        **handle_urls(url=URL, headers=test_user2_headers), data=json.dumps(data)
    )
    friend_relation = Friend(**response.json())
    assert isinstance(friend_relation, Friend)
    assert friend_relation.request_status == True


def test_friend_relation():
    """
    Validates the recieved data to be of type Friend,
    and checks the request status for test_user

    REQUEST PARAMETERS:
        TYPE: GET

        URL: str (Authorized by token returned from handle_friend_auth method)
    """

    response = client.get(**handle_urls(url=URL, headers=test_user1_headers))
    # Currently authenticated user
    # Not the created friend for authenticated user
    user_friend = Friend(**response.json()[0])
    # Checking the relation to be False,
    # Because the other user sent the request to this user,
    # unless this user accepts the request i.e
    # update the request_status to be True, they will not be considered friends.
    assert user_friend.request_status == False


def test_update_request():
    """
    Validates the updates the request status for the user

    REQUEST PARAMETERS:
        TYPE: PUT

        URL: str (Authorized by token returned from handle_friend_auth method)

        DATA PARAMETER:
            amount : float
    """

    get_user = client.get(
        **handle_urls("api/v1/user", headers=test_user2_headers)
    ).json()
    friend_user = User(**get_user)
    data = FriendCreate(friend_id=friend_user.id, request_status=True)
    response = client.put(
        **handle_urls(URL, headers=test_user1_headers), data=json.dumps(data.dict())
    )
    friend = Friend(**response.json())
    assert friend.request_status == True
