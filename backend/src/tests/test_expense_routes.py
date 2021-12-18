import json

from database.schemas import Expense, SharedExpenseStructure, User

from .setup import client, handle_urls, test_user1_headers

URL = "api/v1/expenses"

URL_SHARED = "api/v1/expenses/shared"


def test_create_user_expense():
    data = {"description": "New expense 1", "amount": 2000.21, "shared": False}
    response = client.post(
        **handle_urls(URL, headers=test_user1_headers), data=json.dumps(data)
    )
    recieved_data = Expense(**response.json())
    assert isinstance(recieved_data, Expense)
    assert recieved_data.description == data.get("description")
    assert recieved_data.amount == data.get("amount")
    assert recieved_data.shared == data.get("shared")


def test_get_user_expenses():
    response = client.get(**handle_urls(URL, headers=test_user1_headers))
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_create_shared_expense():
    user = User(
        **client.get(**handle_urls("api/v1/user", headers=test_user1_headers)).json()
    )
    data = {
        "description": "New expense 2",
        "amount": 2000.21,
        "shared": True,
        "shared_expense": {
            "description": "New Shared 1",
            "members_and_amount": {user.id + 1: 1000.21},
        },
    }
    response = client.post(
        **handle_urls(URL, headers=test_user1_headers), data=json.dumps(data)
    )
    expense = Expense(**response.json())
    assert expense.amount == 2000.21
    assert expense.shared == True
    assert (
        expense.shared_expenses[0].member_id
        == expense.shared_expenses[0].main_user_id + 1
    )
    assert expense.shared_expenses[0].amount == 1000.21


def test_update_expense():
    expense = Expense(
        **client.get(**handle_urls(URL, headers=test_user1_headers)).json()[0]
    )
    data = {
        "description": "Updated Description",
        "amount": 3000.21,
    }
    response = client.put(
        **handle_urls(URL + f"?expense_id={expense.id}", headers=test_user1_headers),
        data=json.dumps(data),
    )
    updated_expense = Expense(**response.json())
    assert updated_expense.description == data["description"]
    assert updated_expense.amount == data["amount"]


def test_update_shared_expense():
    expense = Expense(
        **client.get(**handle_urls(URL, headers=test_user1_headers)).json()[1]
    )
    shared_expense = expense.shared_expenses[0]
    data = {
        "members_and_amount": {shared_expense.member_id: 2000.21},
        "description": "Updated Description",
    }

    response = client.put(
        **handle_urls(
            URL_SHARED + f"?expense_id={expense.id}", headers=test_user1_headers
        ),
        data=json.dumps(data),
    )
    updated_expense = SharedExpenseStructure(**response.json())
    assert updated_expense.description == data["description"]
    assert updated_expense.amount == 2000.21


def test_delete_expense():
    expense = Expense(
        **client.get(**handle_urls(URL, headers=test_user1_headers)).json()[0]
    )
    response = client.delete(
        **handle_urls(URL, headers=test_user1_headers), data=json.dumps([expense.id])
    )
    assert response.status_code == 200


def test_delete_shared_expense():
    expense = Expense(
        **client.get(**handle_urls(URL, headers=test_user1_headers)).json()[0]
    )
    response = client.delete(
        **handle_urls(
            URL_SHARED + f"?expense_id={expense.id}", headers=test_user1_headers
        ),
        data=json.dumps([expense.shared_expenses[0].id]),
    )
    assert response.status_code == 200
