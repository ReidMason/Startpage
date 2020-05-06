import utils


class Config:
    config_schema = {
        "general": {
            "searchUrl": "https://www.google.com/search?q="
        },
        "weather": {
            "enabled" : False,
            "apiKey"  : "",
            "location": "London"
        },
        "unifi"  : {
            "enabled"       : False,
            "ip"            : "",
            "username"      : "",
            "password"      : "",
            "hostnames"     : [],
            "showAllClients": False
        }
    }

    def __init__(self, config_path: str):
        self.config_path = config_path
        self.config = None
        self.reload_config()

    def reload_config(self):
        self.validate_config_structure()

    def validate_config_structure(self):
        new_config = utils.validate_json(self.config_schema, utils.load_json(self.config_path))
        print("validation")
        if new_config != self.config:
            print("Saving config")
            self.config = new_config
            self.save_config()

    def save_config(self):
        utils.save_json(self.config_path, self.config)

    def get(self, item: str, default = None):
        return self.config.get(item, default)
