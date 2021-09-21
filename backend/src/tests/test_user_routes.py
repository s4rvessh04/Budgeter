import json

from database.schemas import User, UserBase

from .setup import client, handle_urls, test_user1_headers


def test_read_users():
    response = client.get("api/v1/user/all")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert isinstance(User(**response.json()[0]), User)


def test_read_user():
    response = client.get(**handle_urls("/api/v1/user", headers=test_user1_headers))
    assert response.status_code == 200
    assert isinstance(User(**response.json()), User)


def test_update_user():
    test_user_data = {
        "name": "New Test User",
        "email": "new_test_user@example.com",
    }
    test_user = UserBase(**test_user_data)
    update_response = client.put(
        **handle_urls("/api/v1/user", headers=test_user1_headers),
        data=json.dumps(test_user_data),
    )
    updated_test_user = User(**update_response.json())
    assert update_response.status_code == 200
    assert updated_test_user.name == test_user.name
    assert updated_test_user.email == test_user.email

    # Changing the user data to default values
    test_user_data = {
        "name": "Test User",
        "email": "test_user@example.com",
    }
    test_user = UserBase(**test_user_data)
    revert_response = client.put(
        **handle_urls("/api/v1/user", headers=test_user1_headers),
        data=json.dumps(test_user_data),
    )
    updated_test_user = User(**revert_response.json())
    assert revert_response.status_code == 200
    assert updated_test_user.name == test_user.name
    assert updated_test_user.email == test_user.email
