import os
import json
import uuid

from models.configModel import Config

CONFIG_LOCATION = '../data/config.json'


def add_ids(elements: list) -> list:
    for element in elements:
        if not element.get('id'):
            element['id'] = str(uuid.uuid4())

    return elements


def ensure_config_ids(config: dict) -> dict:
    for key, value in config.items():
        if isinstance(value, list):
            config[key] = add_ids(value)

    return config


def ensure_config_exists():
    if not os.path.exists(CONFIG_LOCATION):
        save_config({})


def save_config(new_config: dict) -> None:
    new_config = ensure_config_ids(new_config)
    with open(CONFIG_LOCATION, "w") as f:
        json.dump(new_config, f)


def load_config() -> Config:
    ensure_config_exists()

    with open(CONFIG_LOCATION, "r") as f:
        config_data = ensure_config_ids(json.load(f))
        config = Config(config_data)
        return config
