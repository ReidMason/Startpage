import uuid
from typing import List


class Config:
    def __init__(self, data: dict = None):
        if data is None:
            data = {}

        self.version: float = data.get('version') or 1
        self.general: GeneralConfig = GeneralConfig(data.get('general'))
        self.apps: List[App] = [App(x) for x in data.get('apps', [])]
        self.providers: List[Provider] = [Provider(x) for x in data.get('providers', [])]
        self.weather: WeatherConfig = WeatherConfig(data.get('weather'))


class GeneralConfig:
    def __init__(self, data: dict = None):
        if data is None:
            data = {}

        self.searchUrl: str = data.get('searchUrl') or "https://www.google.com/search?q="
        self.calendarUrl: str = data.get('calendarUrl') or "https://calendar.google.com/calendar/"
        self.searchPlaceholder: str = data.get('searchPlaceholder') or "Search..."


class App:
    def __init__(self, data: dict = None):
        if data is None:
            data = {}

        self.id: str = data.get('id') or uuid.uuid4()
        self.name: str = data.get('name') or ''
        self.url: str = data.get('url') or ''
        self.icon: str = data.get('icon') or ''


class Provider:
    def __init__(self, data: dict = None):
        if data is None:
            data = {}

        self.id: str = data.get('id') or uuid.uuid4()
        self.baseUrl: str = data.get('baseUrl') or ''
        self.name: str = data.get('name') or ''
        self.prefix: str = data.get('prefix') or ''
        self.searchUrl: str = data.get('searchUrl') or ''


class WeatherConfig:
    def __init__(self, data: dict = None):
        if data is None:
            data = {}

        self.enabled: bool = data.get('enabled') or False
        self.location: str = data.get('location') or ''
        