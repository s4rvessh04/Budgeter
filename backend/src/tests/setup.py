import json

from fastapi.testclient import TestClient

from server import app

client = TestClient(app)


def create_test_client():
    data = {
        "name": "test user",
        "email": "test_user@example.com",
        "username": "test_user",
        "password": "test_password",
    }
    client.post("/api/v1/user/", data=json.dumps(data))
    return data


def return_token():
    data = create_test_client()
    response = client.post("/api/v1/auth/token", data=data)
    data = response.json()
    return data


def delete_test_client():
    token = return_token()["access_token"]
    token_type: str = return_token()["token_type"]

    headers = {"Authorization": f"{token_type.capitalize()} {token}"}
    response = client.delete(
        "api/v1/user",
        headers=headers,
        allow_redirects=True,
    )
    return response.status_code
