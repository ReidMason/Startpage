import json
import os


def shorten_bytes(size: int, decimal_places: int = 2):
    mapping = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

    if size is None:
        return f"0{mapping[0]}"

    reductions = 0
    while size > 1024 and reductions < len(mapping) - 1:
        size /= 1024
        reductions += 1

    return f'{round(size, decimal_places) if decimal_places is not None else size}{mapping[reductions]}'


def load_json(file_path: str):
    if not os.path.exists(file_path):
        save_json(file_path, {})

    with open(file_path, 'r') as f:
        return json.load(f)


def save_json(file_path: str, data: dict):
    with open(file_path, 'w') as f:
        json.dump(data, f)


def validate_json(schema: dict, data: dict):
    if data is None:
        return schema

    for k, v in schema.items():
        data_value = data.get(k)
        if data_value is None:
            data[k] = v

        if type(v) is dict:
            data[k] = validate_json(v, data.get(k))

    return data
