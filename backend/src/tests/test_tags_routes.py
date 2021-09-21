import json

from database.schemas import Tag

from .setup import client, handle_urls, test_user1_headers

URL = "api/v1/tags"

URL_ALL = "api/v1/tags/all"


def test_create_user_tag():
    """
    Creates and validates the recieved data to be of type Tag

    REQUEST PARAMETERS:
        TYPE: POST

        URL: str (handled by handle_urls which includes the authorization header)

        DATA PARAMETER:
            name : str

    RETURNS:
        tag.id: int
    """

    data = {"name": "name"}
    response = client.post(
        **handle_urls(URL, headers=test_user1_headers), data=json.dumps(data)
    )
    assert response.status_code == 200

    recieved_data = Tag(**(response.json()))
    assert isinstance(recieved_data, Tag)
    return recieved_data.id


tag_id = test_create_user_tag()


def test_read_tags():
    """
    Validates the recieved data to be of type List[Tag]

    REQUEST PARAMETERS:
        TYPE: GET

        URL: str (handled by handle_urls which includes the authorization header)
    """

    response = client.get(**handle_urls(URL_ALL))
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert isinstance(Tag(**(response.json()[0])), Tag)


def test_read_user_tags():
    """
    Validates the recieved data to be of type Tag

    REQUEST PARAMETERS:
        TYPE: GET

        URL: str (handled by handle_urls which includes the authorization header)
    """

    response = client.get(**handle_urls(URL, headers=test_user1_headers))
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert isinstance(Tag(**(response.json()[0])), Tag)


def test_update_user_tag():
    """
    Updates the existing tag data and validated the recieved data type to be Tag

    REQUEST PARAMETERS:
        TYPE: UPDATE

        URL: str (handled by handle_urls which includes the authorization header)

        QUERY:
            tag_id:  int

        DATA PARAMETER:
            name : str
    """

    data = {"name": "new_name"}
    repsonse = client.put(
        **handle_urls(URL + f"?tag_id={tag_id}", headers=test_user1_headers),
        data=json.dumps(data),
    )

    Tag(**repsonse.json())

    assert repsonse.status_code == 200


def test_delete_user_tag():
    """
    Deletes the user tag for the id(s) provided

    REQUEST PARAMETERS:
        TYPE: DELETE

        URL: str (handled by handle_urls which includes the authorization header)

        DATA PARAMETER:
            tag_id : List[int]
    """

    tag_id_s = [tag_id]
    response = client.delete(
        **handle_urls(URL, headers=test_user1_headers), data=json.dumps(tag_id_s)
    )
    assert response.status_code == 200
