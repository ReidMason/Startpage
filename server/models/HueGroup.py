class HueGroup:
    def __init__(self, group: dict, group_id: str):
        self.name: str = group.get("name")
        self.id: str = group_id
        state = group.get("state")
        self.all_on: bool = state.get("all_on")
        self.any_on: bool = state.get("any_on")
        self.type: str = group.get("type")
