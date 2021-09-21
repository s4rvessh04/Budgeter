import json

from database.schemas import MaxExpense

from .setup import client, handle_urls, test_user1_headers

URL = "api/v1/max_expense"

URL_ALL = "api/v1/max_expense/all"


def test_create_max_expense():
    """
    Creates and validates the recieved data to be of type MaxExpense

    REQUEST PARAMETERS:
        TYPE: POST

        URL: str (handled by handle_urls which includes the authorization header)

        DATA PARAMETER:
            amount : float
    """

    data = {"amount": 1000.21}
    response = client.post(
        **handle_urls(URL, headers=test_user1_headers), data=json.dumps(data)
    )
    assert response.status_code == 200
    assert isinstance(MaxExpense(**response.json()), MaxExpense)


def test_read_max_expenses():
    """
    Validates the recieved data to be of type List[MaxExpense]

    REQUEST PARAMETERS:
        TYPE: GET

        URL: str (handled by handle_urls which includes the authorization header)
    """

    response = client.get(**handle_urls(URL_ALL))
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert isinstance(MaxExpense(**response.json()[0]), MaxExpense)


def test_read_user_max_expense():
    """
    Validates the recieved data to be of type MaxExpense

    REQUEST PARAMETERS:
        TYPE: GET

        URL: str (handled by handle_urls which includes the authorization header)
    """

    response = client.get(**handle_urls(URL, headers=test_user1_headers))
    user_max_expense = MaxExpense(**response.json())
    assert isinstance(user_max_expense.amount, float)


def test_update_user_max_expense():
    """
    Updates and validates the recieved data to be of type MaxExpense

    REQUEST PARAMETERS:
        TYPE: PUT

        URL: str (handled by handle_urls which includes the authorization header)

        DATA PARAMETER:
            amount : float
    """

    data = {"amount": 9999.99}
    response = client.put(
        **handle_urls(URL, headers=test_user1_headers), data=json.dumps(data)
    )
    updated_user_max_expense = MaxExpense(**response.json())
    assert isinstance(updated_user_max_expense, MaxExpense)
    assert updated_user_max_expense.amount == data.get("amount")


def test_delete_user_max_expense():
    """
    Deletes user max expense and returns status code 200

    REQUEST PARAMETERS:
        TYPE: DELETE

        URL: str (handled by handle_urls which includes the authorization header)
    """

    response = client.delete(**handle_urls(URL, headers=test_user1_headers))
    assert response.status_code == 200
