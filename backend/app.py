from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

from caching import Cache
from config import Config
from unifiService import Unifi
from weatherService import WeatherService

DATA_PATH = "../data"


def get_config():
    return Config(DATA_PATH)


config = get_config()
config.validate_data_files()
cache = Cache(f"{DATA_PATH}/cache.json")
app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    global config
    config = get_config()
    config.validate_data_files()

    return send_file('../frontend/dist/index.html')


@app.route('/api/data/<path>')
def data(path: str):
    return send_file(f'{DATA_PATH}/{path}')


@app.route('/api/weather')
def city_weather():
    get_cached = request.args.get('cached', '').lower() == 'true'
    city = request.args.get('city')

    weather = WeatherService(config.get('weather'), cache)

    data = weather.get_weather(city, get_cached)
    return jsonify(data), 200 if data != {} else 400


@app.route('/api/unifi/networkData')
def get_unifi_transfer_data():
    unifi = Unifi(config.get('unifi'), cache)
    hostnames = request.args.getlist('hostname')
    data = unifi.get_client_stats(hostnames)
    return jsonify(data), 200 if data != [] else 400


@app.route('/api/unifi/networkData/all')
def get_all_unifi_transfer_data():
    unifi = Unifi(config.get('unifi'), cache)
    hostnames = request.args.getlist('hostname')
    data = unifi.get_all_client_stats(hostnames)
    return jsonify(data), 200 if data != [] else 400


if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 80, debug = True)
