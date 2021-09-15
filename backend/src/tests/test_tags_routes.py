import json

from database.schemas import Tag

from .setup import client, handle_urls

URL = "api/v1/tags"

URL_ALL = "api/v1/tags/all"


def test_create_user_tag():
    data = {"name": "name"}
    response = client.post(**handle_urls(URL), data=json.dumps(data))
    assert response.status_code == 200

    recieved_data = Tag(**(response.json()))
    assert isinstance(recieved_data, Tag)
    return recieved_data.id


tag_id = test_create_user_tag()


def test_tags():
    response = client.get(**handle_urls(URL_ALL))
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert isinstance(Tag(**(response.json()[0])), Tag)


def test_user_tags():
    response = client.get(**handle_urls(URL))
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert isinstance(Tag(**(response.json()[0])), Tag)


def test_update_user_tag():
    data = {"name": "new_name"}
    repsonse = client.put(
        **handle_urls(URL + f"?tag_id={tag_id}"), data=json.dumps(data)
    )

    Tag(**repsonse.json())

    assert repsonse.status_code == 200
