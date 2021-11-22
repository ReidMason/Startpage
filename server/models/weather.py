class Weather:
    def __init__(self, weather_response: dict):
        current = weather_response.get('current')
        self.temperature: float = current.get('temp')
        self.feelsLike: float = current.get('feels_like')

        weather = current.get('weather')[0]
        self.icon: str = weather.get('icon')
        self.description: str = weather.get('description')

        daily = weather_response.get('daily')[0]
        self.rainChance: float = daily.get('pop')
