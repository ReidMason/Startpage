import time
from typing import Callable
import json
import os

CACHE_LOCATION = '../data/cache.json'
CACHE_DURATION = 3600


def ensure_cache_exists():
    if not os.path.exists(CACHE_LOCATION):
        save_cache({})


def load_cache():
    ensure_cache_exists()

    with open(CACHE_LOCATION, 'r') as f:
        return json.load(f)


def save_cache(data: dict):
    with open(CACHE_LOCATION, 'w') as f:
        json.dump(data, f)


def create_cache_info(value: any):
    return {
        'timeCached'  : time.time(),
        'cachedResult': value
    }


def run_function(func: Callable, *args: any):
    cache_name = f'{func.__name__}-{"-".join(args)}'
    cache = load_cache()
    cache_info = cache.get(cache_name)

    if cache_info is None or time.time() - cache_info.get('timeCached') > CACHE_DURATION:
        value = func(*args)
        cache[cache_name] = create_cache_info(value)
        save_cache(cache)
        return value

    return cache_info.get('cachedResult')
