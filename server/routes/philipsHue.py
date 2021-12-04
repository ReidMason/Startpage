from flask import Blueprint, jsonify, request

from services import philipsHueService

philips_hue_route = Blueprint('philipsHue', __name__, url_prefix = '/api/philipsHue')


@philips_hue_route.route('/connect')
def connect():
    ip = request.args.get('ip')
    print(request.args)
    connected = philipsHueService.connect(ip)
    return jsonify({"connected": connected})
