import mimetypes
from urllib import response
import requests
import mimetypes

j = {"a": 1, "b": {'r': 1}, "c": {"approved", 1}}

response = requests.put("http://127.0.0.1:5000/api/test", j)

print(response.json())
