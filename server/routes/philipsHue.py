from flask import Blueprint, Response, jsonify, request

from models.HueLight import HueLight
from services import philipsHueService

philips_hue_route = Blueprint('philipsHue', __name__, url_prefix = '/api/philipsHue')


@philips_hue_route.route('/connect')
def connect():
    ip = request.args.get('ip')
    print(request.args)
    connected = philipsHueService.connect(ip)
    return jsonify({"connected": connected})


@philips_hue_route.route('/groups')
def get_groups():
    return jsonify([x.__dict__ for x in philipsHueService.get_groups()])


@philips_hue_route.route('/toggleGroup', methods = ["POST"])
def toggle_group():
    group_id = request.args.get("id")
    light_on = philipsHueService.toggle_group(group_id)

    return jsonify({"lightOn": light_on}), 200 if light_on is not None else 400
