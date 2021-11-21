class Weather:
    def __init__(self, weather_response: dict):
        current = weather_response.get('current')
        self.temperature: float = current.get('temp')
        self.feelsLike: float = current.get('feels_like')

        weather = current.get('weather')[0]
        self.icon: str = weather.get('icon')
        self.description: str = weather.get('description')

        hourly = weather_response.get('hourly')[0]
        self.rainChance: float = hourly.get('pop')
