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
        try:
            return json.load(f)
        except json.decoder.JSONDecodeError:
            return {}


def save_json(file_path: str, data: dict):
    if not os.path.exists(file_path):
        os.makedirs(os.path.dirname(file_path), exist_ok = True)

    with open(file_path, 'w') as f:
        json.dump(data, f)


def validate_json(schema: dict, data: dict):
    change_made = False
    if data is None:
        return schema, True

    for k, v in schema.items():
        data_value = data.get(k)
        if data_value is None:
            change_made = True
            data[k] = v

        if type(v) is dict:
            data[k], child_change_made = validate_json(v, data.get(k))
            change_made = child_change_made if not change_made else change_made

    return data, change_made
