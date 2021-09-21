from .setup import client, delete_user, test_user1_token_dict, test_user2_token_dict


def test_delete_user1():
    response = delete_user(test_user1_token_dict)
    assert response.status_code == 200


def test_delete_user2():
    response = delete_user(test_user2_token_dict)
    assert response.status_code == 200
