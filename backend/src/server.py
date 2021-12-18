from functools import lru_cache

import uvicorn
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

import config
from database.database import SessionLocal
from routes import auth, expenses, friends, max_expense, tags, users

app = FastAPI()

origins = ["http://localhost:3000", "localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


app.include_router(
    users.router,
    prefix=handle_url("/user"),
    tags=["user"],
)
app.include_router(
    friends.router,
    prefix=handle_url("/friends"),
    tags=["friends"],
)
app.include_router(
    expenses.router,
    prefix=handle_url("/expenses"),
    tags=["expenses"],
)
app.include_router(
    max_expense.router,
    prefix=handle_url("/max_expense"),
    tags=["max_expense"],
)
app.include_router(
    tags.router,
    prefix=handle_url("/tags"),
    tags=["tags"],
)

app.include_router(auth.router, prefix=handle_url("/auth"), tags=["auth"])


@lru_cache()
def get_settings():
    return config.Settings()


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
