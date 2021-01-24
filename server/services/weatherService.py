import requests
import json
import os

WEATHER_APIKEY = os.environ.get('WEATHER_APIKEY', "")

def get_weather(location: str) -> dict:
    url = f'https://api.openweathermap.org/data/2.5/weather?q={location}&units=metric&appid={WEATHER_APIKEY}'
    print("Requesting weather data")
    return json.loads(requests.get(url).content)