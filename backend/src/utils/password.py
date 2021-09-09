from typing_extensions import ParamSpecKwargs
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("PASSWORD_SECRET")
ALGORITH = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_passoword: str, hashed_password: str):
    return pwd_context.verify(plain_passoword, hashed_password)


def get_password_hash(plain_password: str):
    return pwd_context.hash(plain_password)
