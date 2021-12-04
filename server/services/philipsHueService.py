import time

from phue import Bridge, PhueRegistrationException
from models.configModel import Config


def create_connection() -> Bridge:
    max_attempts = 30
    attempts = 0
    while attempts <= max_attempts:
        try:
            config = Config()
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
            config = Config()
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


if __name__ == '__main__':
    main()
