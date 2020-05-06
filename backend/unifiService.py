from pprint import pprint

from pyunifi.controller import Controller
from requests.exceptions import InvalidURL

from utils import shorten_bytes


class Unifi:
    def __init__(self, unifi_config: dict):
        self.config = unifi_config
        ip = self.config.get('ip')
        username = self.config.get('username')
        password = self.config.get('password')
        try:
            self.c = None
            self.c = Controller(ip, username, password, ssl_verify = False)
        except InvalidURL as e:
            print(f"Error connecting to Unifi service.\n{e}")

    def get_client_stats(self, hostnames: list):
        if self.c is None:
            return []

        clients = self.get_clients_from_hostnames(hostnames)
        return self.format_client_stats(clients)

    def get_all_client_stats(self):
        if self.c is None:
            return []
        
        clients = self.c.get_clients()
        return self.format_client_stats(clients)

    def format_client_stats(self, clients: list):
        return [{'name'    : self.get_client_name(x),
                 'ip'      : self.get_client_ip(x),
                 'download': self.get_client_download(x),
                 'upload'  : self.get_client_upload(x)
                 } for x in clients]

    @staticmethod
    def get_client_upload(client: dict) -> str:
        return shorten_bytes(client.get('wired-rx_bytes', 0) + client.get('rx_bytes', 0))

    @staticmethod
    def get_client_download(client: dict) -> str:
        return shorten_bytes(client.get('wired-tx_bytes', 0) + client.get('tx_bytes', 0))

    def get_clients_from_hostnames(self, hostnames: list) -> list:
        # Get all matching hostname clients
        matched_clients = []
        for client in self.c.get_clients():
            matched_clients.append(client)
            if self.get_client_name(client) in hostnames:
                matched_clients.append(client)

        # Reorder to match hostnames order
        clients = []
        for hostname in hostnames:
            for i, client in enumerate(matched_clients):
                if hostname == self.get_client_name(client):
                    clients.append(matched_clients.pop(i))
                    break

        return clients

    @staticmethod
    def get_client_name(client: dict) -> str:
        return client.get('name', client.get('hostname'))

    @staticmethod
    def get_client_ip(client: dict) -> str:
        return client.get('ip')

    def get_hostnames(self) -> list:
        return [x.get('hostname') for x in self.c.get_clients()]
