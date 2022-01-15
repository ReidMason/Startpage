from phue import Light


class HueLight:
    def __init__(self, light: Light):
        self.id = light.light_id
        self.brightness = light.brightness
        self.colour_mode = light.colormode
        self.colour_temp = light.colortemp
        self.effect = light.effect
        self.hue = light.hue
        self.name: str = light.name
        self.on = light.on
        self.reachable = light.reachable
        self.saturation = light.saturation
        self.transition_time = light.transitiontime
