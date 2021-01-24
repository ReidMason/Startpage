from flask import Flask, jsonify, request
from flask_cors import CORS

from utils import serialize
from services.weatherService import get_weather
from caching import run_function
from services.configService import load_config, save_config

app = Flask(__name__)
CORS(app)


@app.route("/api/config", methods = ["GET", "PUT"])
def get_config():
    if request.method == 'PUT':
        save_config(request.json)
        return jsonify(True)

    return jsonify(serialize(load_config()))


@app.route("/api/weather")
def get_weather_info():
    weather_config = load_config().weather
    weather_response = run_function(get_weather, weather_config.location)

    if weather_response.get('cod') != 200:
        return jsonify(None)

    weather = weather_response.get('weather')[0]
    data = {'temperature': weather_response.get('main').get('temp'),
            'icon'       : weather.get('icon'),
            'description': weather.get('description')}

    return jsonify(data)


app.run(debug = True)
