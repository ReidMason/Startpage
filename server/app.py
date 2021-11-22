import os

from flask import Flask, jsonify, request, send_file, render_template
from flask_cors import CORS

from models.weather import Weather
from services import iconifyService
from utils import serialize
from services.weatherService import get_weather
from caching import run_function, clear_cache
from services.configService import load_config, save_config

app = Flask(__name__, static_folder = "static/", template_folder = "static")
CORS(app)
clear_cache()


# Serve the frontend
@app.route('/', defaults = {'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template("index.html")


@app.route('/static/<folder>/<file>')
def static_data(folder: str, file: str):
    return send_file(os.path.join('static/static/', folder, file))


@app.route('/static/<file>')
def data(file: str):
    return send_file(os.path.join('static/', file))


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

    return jsonify(serialize(Weather(weather_response)))


@app.route("/api/iconSearch")
def icon_search():
    icon_name = request.args.get('iconName')
    data = iconifyService.search_for_icon(icon_name)
    return jsonify(data)


if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 5003)
