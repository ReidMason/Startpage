import utils


class Config:
    config_schema = {
        "general": {
            "searchUrl": "https://www.google.com/search?q="
        },
        "weather": {
            "enabled"      : False,
            "apiKey"       : "",
            "location"     : "London",
            "cacheDuration": 3600
        },
        "unifi"  : {
            "enabled"       : False,
            "ip"            : "",
            "username"      : "",
            "password"      : "",
            "hostnames"     : [],
            "showAllClients": False,
            "cacheDuration" : 0
        }
    }

    apps_schema = {'apps': [
        {
            "name": "Google",
            "url" : "https://www.google.com",
            "icon": "ant-design:google-circle-filled"
        },
        {
            "name": "Amazon",
            "url" : "https://www.amazon.co.uk",
            "icon": "ant-design:amazon-circle-filled"
        }
    ]}

    providers_schema = {'providers': [
        {
            "name"     : "Reddit",
            "baseUrl"  : "https://www.reddit.com/",
            "searchUrl": "https://www.reddit.com/r/",
            "prefix"   : "r"
        },
        {
            "name"     : "Amazon",
            "baseUrl"  : "https://www.amazon.co.uk/",
            "searchUrl": "https://www.amazon.co.uk/s?k=",
            "prefix"   : "a"
        }
    ]}

    def __init__(self, data_path: str):
        self.config_path = f'{data_path}/config.json'
        self.apps_path = f'{data_path}/apps.json'
        self.providers_path = f'{data_path}/providers.json'
        self.config = None
        self.reload_config()

    def reload_config(self):
        self.config = utils.load_json(self.config_path)
        self.validate_config_structure()

    def validate_config_structure(self):
        new_config, change_made = utils.validate_json(self.config_schema, self.config)
        if change_made:
            print("Updating config.json")
            self.save_config()
        print("Config validation done")

    def validate_data_files(self):
        # Validate apps.json
        new_data, change_made = utils.validate_json(self.apps_schema, utils.load_json(self.apps_path))
        if change_made:
            print("Updating apps.json")
            utils.save_json(self.apps_path, new_data)
        print("Apps validation done")

        # Validate providers.json
        new_data, change_made = utils.validate_json(self.providers_schema, utils.load_json(self.providers_path))
        if change_made:
            print("Updating providers.json")
            utils.save_json(self.providers_path, new_data)
        print("Providers validation done")

    def save_config(self):
        utils.save_json(self.config_path, self.config)

    def get(self, item: str, default = None):
        return self.config.get(item, default)
