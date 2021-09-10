import os

from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

load_dotenv()

SECRET_KEY = os.getenv("PASSWORD_SECRET")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")


def verify_password(plain_passoword: str, hashed_password: str):
    return pwd_context.verify(plain_passoword, hashed_password)


def get_password_hash(plain_password: str):
    return pwd_context.hash(plain_password)
