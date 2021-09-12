import json

from .setup import client, handle_urls, delete_test_client


def test_read_user():
    response = client.get(**handle_urls("/api/v1/user"))
    assert response.status_code == 200


def test_update_user():
    to_update_data = {"name": "new_test_user", "email": "new_test_user@example.com"}
    update_response = client.put(
        **handle_urls("/api/v1/user"),
        data=json.dumps(to_update_data),
    )
    update_recieved_data = update_response.json()
    assert update_response.status_code == 200
    assert update_recieved_data["name"] == to_update_data["name"]
    assert update_recieved_data["email"] == to_update_data["email"]

    to_revert_data = {"name": "test_user", "email": "test_user@example.com"}
    revert_response = client.put(
        **handle_urls("/api/v1/user"),
        data=json.dumps(to_revert_data),
    )
    update_revert_data = revert_response.json()
    assert revert_response.status_code == 200
    assert update_revert_data["name"] == to_revert_data["name"]
    assert update_revert_data["email"] == to_revert_data["email"]


def test_delete_user():
    assert delete_test_client() == 200
