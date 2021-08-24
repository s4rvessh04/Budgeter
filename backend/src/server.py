from functools import lru_cache

import config
import uvicorn
from database.database import SessionLocal
from fastapi import FastAPI, Request, Response
from routes import expenses, friends, max_expense, users

app = FastAPI()


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    response = Response("Internal server error", status_code=500)
    try:
        request.state.db = SessionLocal()
        response = await call_next(request)
    finally:
        request.state.db.close()
    return response


def handle_url(path: str):
    return "/api/v1" + path


app.include_router(users.router, prefix=handle_url("/users"), tags=["users"])
app.include_router(friends.router, prefix=handle_url("/friends"), tags=["friends"])
app.include_router(expenses.router, prefix=handle_url("/expenses"), tags=["expenses"])
app.include_router(max_expense.router, prefix=handle_url("/max_expense"), tags=["max_expense"])


@lru_cache()
def get_settings():
    return config.Settings()


@app.get("/")
async def get():
    return {"Hello": "World"}


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
