def serialize(obj):
    serialized_types = (str, int, str, float, bool)

    # Type is already serialized so we can just use that
    if type(obj) in serialized_types or obj is None:
        return obj

    # Each item in a list needs to be serialized
    if type(obj) == list:
        return [serialize(x) for x in obj]

    # Each key and value in a dict needs to be serialized
    if type(obj) == dict:
        return {serialize(k): serialize(v) for k, v in obj.items()}

    data = {}
    for prop in obj.__dict__:
        value = getattr(obj, prop)
        data[prop] = serialize(value)

    return data