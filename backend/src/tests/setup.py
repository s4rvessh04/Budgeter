import json
import os

from dotenv import load_dotenv
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database.database import Base
from routes import get_db
from server import app

load_dotenv()

db_username = os.getenv("DB_USERNAME")
db_password = os.getenv("DB_PASSWORD")
db_server = os.getenv("DB_SERVER")
db_name = os.getenv("DB_NAME_TESTING")

SQLALCHEMY_DATABASE_URL = (
    f"mysql+mysqlconnector://{db_username}:{db_password}@{db_server}/{db_name}"
)
print(SQLALCHEMY_DATABASE_URL)
engine = create_engine(SQLALCHEMY_DATABASE_URL)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

client = TestClient(app)

Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

test_user1_data = {
    "name": "test user1",
    "email": "test_user1@example.com",
    "username": "test_user1",
    "password": "test_password",
}


test_user2_data = {
    "name": "test user2",
    "email": "test_user2@example.com",
    "username": "test_user2",
    "password": "test_password",
}


def create_user(data: dict):
    data = client.post("/api/v1/user/", data=json.dumps(data)).json()
    return data


def return_token(data: dict):
    response = client.post("/api/v1/auth/token", data=data)
    token_dict = response.json()
    return token_dict


def handle_urls(url: str, headers: dict = None):
    return {"url": url, "headers": headers, "allow_redirects": True}


def delete_user(token_dict: dict):
    token: str = token_dict["access_token"]
    token_type: str = token_dict["token_type"]

    headers = {"Authorization": f"{token_type.capitalize()} {token}"}
    response = client.delete(
        "api/v1/user",
        headers=headers,
        allow_redirects=True,
    )
    return response


test_user1 = create_user(test_user1_data)
test_user1_token_dict = return_token(test_user1_data)
test_user1_token: str = test_user1_token_dict["access_token"]
test_user1_token_type: str = test_user1_token_dict["token_type"]
test_user1_headers = {
    "Authorization": f"{test_user1_token_type.capitalize()} {test_user1_token}"
}

test_user2 = create_user(test_user2_data)
test_user2_token_dict = return_token(test_user2_data)
test_user2_token: str = test_user2_token_dict["access_token"]
test_user2_token_type: str = test_user2_token_dict["token_type"]
test_user2_headers = {
    "Authorization": f"{test_user2_token_type.capitalize()} {test_user2_token}"
}
