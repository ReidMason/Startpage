import time
from typing import Optional

from phue import Bridge, PhueRegistrationException

from models.HueGroup import HueGroup
from models.HueLight import HueLight
from services.configService import load_config


def create_connection() -> Optional[Bridge]:
    max_attempts = 30
    attempts = 0
    while attempts <= max_attempts:
        try:
            config = load_config()
            ip = config.philipsHue.ip
            if ip == "":
                return None
            return Bridge(config.philipsHue.ip)
        except PhueRegistrationException:
            attempts += 1
            time.sleep(1)
            print(f"Connecting to Hue attempt: {attempts}")
            pass


def main():
    connection_successful = try_connect()
    print(connection_successful)


def connect(ip = None) -> bool:
    try:
        if ip is None:
            config = load_config()
            ip = config.philipsHue.ip

        Bridge(ip)
        return True
    except Exception:
        return False


def try_connect():
    b = create_connection()

    max_attempts = 5
    attempts = 0
    while attempts < max_attempts:
        try:
            b.connect()
            return True
        except PhueRegistrationException:
            attempts += 1
            time.sleep(1)
            pass

    return False


def get_lights():
    bridge = create_connection()
    return [HueLight(x) for x in bridge.lights]


def get_groups():
    bridge = create_connection()
    g = bridge.get_group()
    groups = [HueGroup(data, group_id) for group_id, data in bridge.get_group().items()]
    return groups


def get_light(light: str) -> HueLight:
    return next((x for x in get_lights() if x.name.lower() == light.lower()), None)


def get_group(group_id: str):
    groups = get_groups()
    return next((x for x in get_groups() if x.id == group_id), None)


def toggle_group(group_id: str) -> Optional[bool]:
    group = get_group(group_id)

    if group is None:
        return None

    bridge = create_connection()
    if group.any_on:
        bridge.set_group(group.name, 'on', False)
        return False
    else:
        bridge.set_group(group.name, 'on', True)
        return True

    return x


def toggle_light(light: str):
    bridge = create_connection()
    light = get_light(light)

    if light is None:
        return

    if light.on:
        bridge.set_light(light.name, 'on', False)
    else:
        bridge.set_light(light.name, 'on', True)


def turn_lights_on(light: str):
    bridge = create_connection()
    if bridge:
        bridge.set_light(light, 'on', True)


if __name__ == '__main__':
    main()
