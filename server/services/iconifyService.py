from typing import List

import requests


def search_for_icon(icon_name: str) -> List[str]:
    url = f"https://api.iconify.design/search?query={icon_name}&limit=96"
    r = requests.get(url)
    data = r.json()
    return data.get('icons')
