from typing import Tuple

import requests
import json
import os
import caching
from models.coordinates import Coordinates

WEATHER_APIKEY = os.environ.get('WEATHER_APIKEY', "")


def get_weather(location: str) -> dict:
    print("Using weather api")
    coords = get_lat_lon(location)
    url = f'https://api.openweathermap.org/data/2.5/onecall?lat={coords.lat}&lon={coords.lon}&exclude=minutely&units=metric&appid={WEATHER_APIKEY}'
    return json.loads(requests.get(url).content)


def get_lat_lon(location: str) -> Coordinates:
    url = f'https://api.openweathermap.org/data/2.5/weather?q={location}&units=metric&appid={WEATHER_APIKEY}'
    data = json.loads(requests.get(url).content)
    coord = data.get('coord')
    return Coordinates(coord.get('lat'), coord.get('lon'))
