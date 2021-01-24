from flask import Flask, jsonify, request, send_file, render_template
from flask_cors import CORS

from utils import serialize
from services.weatherService import get_weather
from caching import run_function
from services.configService import load_config, save_config

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return send_file('../client/build/index.html')

@app.route('/static/js/<path>')
def data(path: str):
    return send_file(f'../client/build/static/js/{path}')


@app.route('/static/css/<path>')
def css(path: str):
    return send_file(f'../client/build/static/css/{path}')

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

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 5003)
