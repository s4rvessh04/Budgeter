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


token = return_token()
user_token = token["access_token"]
token_type = token["token_type"]
headers = {"Authorization": f"{token_type.capitalize()} {user_token}"}


def handle_urls(url):
    return {"url": url, "headers": headers, "allow_redirects": True}
