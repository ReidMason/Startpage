from caching import Cache


class WeatherService:
    def __init__(self, weather_config: dict, cache: Cache):
        self.config = weather_config
        self.api_key = self.config.get('apiKey')
        self.cache = cache
        self.cache_duration = self.config.get('cacheDuration')

    def get_weather(self, city: str, get_cached: bool = False):
        if self.api_key.strip() == '':
            return {}

        url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={self.api_key}'
        return self.cache.get(url, self.cache_duration, get_cached)
