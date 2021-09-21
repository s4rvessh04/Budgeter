import json
from datetime import datetime

from database.schemas import Saving

from .setup import client, handle_urls, test_user1_headers

URL = "api/v1/savings"


def test_create_user_savings():
    """
    Creates and validates the recieved data to be of type Saving

    REQUEST PARAMETERS:
        TYPE: POST

        URL: str (handled by handle_urls which includes the authorization header)

        DATA PARAMETER:
            amount : float
            date: str (Default is utcnow)

    RETURNS:
        saving.id: int
    """

    data = {"amount": 10000.21, "date": str(datetime.utcnow())}
    response = client.post(
        **handle_urls(URL, headers=test_user1_headers), data=json.dumps(data)
    )
    user_saving = Saving(**(response.json()))
    assert user_saving.amount == data.get("amount")
    return user_saving.id


saving_id = test_create_user_savings()


def test_read_user_savings():
    """
    Validates the recieved data to be of type List[Saving]

    REQUEST PARAMETERS:
        TYPE: GET

        URL: str (handled by handle_urls which includes the authorization header)
    """

    response = client.get(**handle_urls(URL, headers=test_user1_headers))
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert isinstance(Saving(**response.json()[0]), Saving)


def test_update_user_savings():
    """
    Updated and validates the recieved data to be of type Saving and matching the supplied values

    REQUEST PARAMETERS:
        TYPE: PUT

        URL: str (handled by handle_urls which includes the authorization header)

        DATA PARAMETER:
            amount : float
            date: str (Default is utcnow)
    """

    data = {"amount": 999.99, "date": str(datetime.utcnow())}
    response = client.put(
        **handle_urls(URL + f"?saving_id={saving_id}", headers=test_user1_headers),
        data=json.dumps(data),
    )
    assert isinstance(Saving(**response.json()), Saving)
    assert Saving(**response.json()).amount == data.get("amount")
    assert Saving(**response.json()).amount != data.get("date")


def test_delete_user_savings():
    """
    Deletes the user savings for the List[id] provided and returns a status code of 200

    REQUEST PARAMETERS:
        TYPE: DELETE

        URL: str (handled by handle_urls which includes the authorization header)

        DATA PARAMETER:
            amount : float
            date: str (Default is utcnow)
    """

    saving_id_s = [saving_id]
    response = client.delete(
        **handle_urls(URL, headers=test_user1_headers), data=json.dumps(saving_id_s)
    )
    assert response.status_code == 200
