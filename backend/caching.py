import json
import os
import time

import requests


class Cache:
    def __init__(self, cache_path: str):
        self.CACHE_PATH = cache_path
        self.create_cache_file()
        self.cache = self.load_cache_file()

    def save_cache_file(self) -> None:
        with open(self.CACHE_PATH, 'w') as f:
            json.dump(self.cache, f)

    def load_cache_file(self) -> dict:
        # Load cache file
        with open(self.CACHE_PATH, 'r') as f:
            return json.load(f)

    def create_cache_file(self) -> None:
        # Create cache file
        if not os.path.exists(self.CACHE_PATH):
            with open(self.CACHE_PATH, 'w') as f:
                json.dump({}, f)

    def get_cache_time_obtained(self, url: str) -> int:
        return int(self.cache.get(url).get('obtained'))

    def get_cache_time_left(self, url: str, cache_duration: int) -> int:
        return int(self.get_cache_time_obtained(url) + cache_duration - time.time())

    def is_cached(self, url: str) -> bool:
        return url in self.cache.keys()

    def make_request(self, url: str) -> dict:
        print(f"SENT REQUEST: {url}")
        r = json.loads(requests.get(url).content)
        self.update_cache(url, r)
        return r

    def run_function(self, func, cache_duration: int, *args, force_run = False, **kwargs):
        cache_url = func.__name__

        if not force_run and self.cache_data_valid(cache_url, 3600):
            print(f"Got cached: {cache_url}. Time left: {self.get_cache_time_left(cache_url, cache_duration)}")
            return self.get_cached_data(cache_url)

        print(f"FUNCTION RUN: {cache_url}")
        data = func(*args, **kwargs)
        self.update_cache(cache_url, data)
        return data

    def update_cache(self, url: str, data, update_obtained = True):
        cache_data = self.cache.get(url, {})
        cache_data['data'] = data
        cache_data['obtained'] = time.time() if update_obtained else cache_data.get('obtained')
        self.cache[url] = cache_data
        self.save_cache_file()

    def get_cached_data(self, url: str) -> dict:
        return self.cache[url].get('data')

    def cache_data_valid(self, url: str, cache_duration: int):
        return self.is_cached(url) and self.get_cache_time_left(url, cache_duration) > 0

    def get(self, url: str, cache_duration: int):
        if self.cache_data_valid(url, cache_duration):
            print(f"Got cached: {url}. Time left: {self.get_cache_time_left(url, cache_duration)}")
            return self.get_cached_data(url)

        return self.make_request(url)
