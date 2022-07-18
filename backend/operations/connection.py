import os.path
from os import walk

from backend.shared.paths import connection_path

HEADER_SYMBOL = "**"
NAME_HEADER = "**NAME**"
INSTANCE_HEADER = "**INSTANCES**"
CONNECTIONS_HEADER = "**CONNECTIONS**"
COMMENT_CHAR = "#"


class ConnectionOperation:

    @staticmethod
    def save_connection(data, session_id) -> None:
        connection_folder = connection_path(session_id)
        if not os.path.isdir(connection_folder):
            os.makedirs(connection_folder)

        file_check = ConnectionOperation._check_if_already_exist(connection_folder, data["name"])
        if file_check:
            filename = file_check
        else:
            _, _, filenames = next(walk(connection_folder))

            greatest_id = -1 if len(filenames) == 0 else int(max(filenames)[0:4])
            greatest_id += 1
            filename = str(greatest_id).zfill(4)+".txt"

        with open(connection_folder / f"{filename}", "w") as file:
            file.write(f"{NAME_HEADER}\n\n")
            file.write(f"\t{data['name']}\n\n")

            file.write(f"{INSTANCE_HEADER}\n\n")
            for name in data["instances"]:
                file.write(f"\t{name}: {data['instances'][name]}\n")

            file.write(f"\n{CONNECTIONS_HEADER}\n\n")
            for name in data["connections"]:
                file.write(f"\t{name}: {data['connections'][name]}\n")

    @staticmethod
    def get_name(content_file):
        line_header = ""
        name = ""
        for line in content_file:
            line, header = _check_header(line)
            if not line:
                continue

            if header:
                if line_header == NAME_HEADER:
                    return name[:-1].strip()
                if line == NAME_HEADER:
                    line_header = line
            else:
                if line_header == NAME_HEADER:
                    name += line.strip() + " "
        return ""

    @staticmethod
    def _check_if_already_exist(folder, name) -> str:
        if not os.path.exists(folder):
            return ""
        _, _, filenames = next(walk(folder))

        for filename in filenames:
            with open(folder / filename, "r") as file:
                if ConnectionOperation.get_name(file.readlines()) == name:
                    return filename
        return ""


def _check_header(line: str) -> tuple[str, bool]:
    """Returns a comment-free, tab-replaced line with no whitespace and the number of tabs"""
    line = line.split(COMMENT_CHAR, 1)[0]
    if line.startswith(HEADER_SYMBOL):
        return line.strip(), True
    return line.strip(), False
