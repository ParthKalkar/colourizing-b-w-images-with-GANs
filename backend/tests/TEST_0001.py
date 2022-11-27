import logging
import requests
import filecmp
import os

STATUS_OK = 200

def upload_image(filename, url):
    files = {'file': open(filename, 'rb')}
    return requests.post(url, files=files)

def clear_uploads():
    os.remove("test_image_downloaded.jpg")

def test_upload():
    logging.info("1. Upload image")
    post_request = upload_image("test_image.jpg", "http://127.0.0.1:5000/")
    assert post_request.status_code == STATUS_OK

    logging.info("2. Retrieve image")
    get_request = requests.get("http://127.0.0.1:5000/uploads/test_image.jpg")
    assert get_request.status_code == STATUS_OK

    logging.info("3. Compare uploaded and retrieved image")
    open("test_image_downloaded.jpg", "wb").write(get_request.content)
    assert filecmp.cmp('test_image.jpg', 'test_image_downloaded.jpg') == True

    logging.info("4. Remove uploaded images.")
    clear_uploads()