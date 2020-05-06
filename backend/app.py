from flask import Flask, jsonify, request, render_template, send_file
from flask_cors import CORS

from caching import Cache
from config import Config
from unifiService import Unifi
from weatherService import WeatherService

DATA_PATH = "../data"


def get_config():
    return Config(f'{DATA_PATH}/config.json')


get_config()
cache = Cache(f"{DATA_PATH}/cache.json")
app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return send_file('../frontend/dist/index.html')


@app.route('/css/<path>')
def css(path: str):
    return send_file(f'../frontend/dist/css/{path}')


@app.route('/js/<path>')
def js(path: str):
    return send_file(f'../frontend/dist/js/{path}')


@app.route('/api/weather')
def city_weather():
    config = get_config()
    weather = WeatherService(config.get('weather'), cache)
    city = request.args.get('city')
    data = weather.get_weather(city)
    return jsonify(data), 200 if data != {} else 400


@app.route('/api/unifi/networkData')
def get_unifi_transfer_data():
    config = get_config()
    unifi = Unifi(config.get('unifi'))
    hostnames = request.args.getlist('hostname')
    data = unifi.get_client_stats(hostnames)
    return jsonify(data), 200 if data != [] else 400


@app.route('/api/unifi/networkData/all')
def get_all_unifi_transfer_data():
    config = get_config()
    unifi = Unifi(config.get('unifi'))
    data = unifi.get_all_client_stats()
    return jsonify(data), 200 if data != [] else 400


if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 5003, debug = True)
