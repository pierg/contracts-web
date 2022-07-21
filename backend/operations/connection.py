import os.path
from os import walk

from backend.shared.paths import default_connection_path
from backend.shared.paths import connection_path

HEADER_SYMBOL = "**"
NAME_HEADER = "**NAME**"
INSTANCE_HEADER = "**INSTANCES**"
CONNECTIONS_HEADER = "**CONNECTIONS**"
ENTRY_HEADER = "**ENTRY**"
COMMENT_CHAR = "#"


class ConnectionOperation:

    @staticmethod
    def save_connection(data, session_id, library_name) -> None:
        connection_folder = connection_path(session_id, library_name)
        if not os.path.isdir(connection_folder):
            os.makedirs(connection_folder)

        file_check = ConnectionOperation._check_if_already_exist(connection_folder, data["name"])
        if file_check:
            filename = file_check
        else:
            _, _, filenames = next(walk(connection_folder))

            greatest_id = -1 if len(filenames) == 0 else int(max(filenames)[0:4])
            greatest_id += 1
            filename = str(greatest_id).zfill(4) + ".txt"

        with open(connection_folder / f"{filename}", "w") as file:
            file.write(f"{NAME_HEADER}\n\n")
            file.write(f"\t{data['name']}\n\n")

            file.write(f"{INSTANCE_HEADER}\n\n")
            for name in data["instances"]:
                file.write(f"\t{name}: {data['instances'][name]}\n")

            file.write(f"\n{CONNECTIONS_HEADER}\n\n")
            for elt in data["connections"]:
                file.write(f"\t{elt}\n")

            file.write(f"\n{ENTRY_HEADER}\n\n")
            file.write(f"\t{data['entry']}\n\n")

    @staticmethod
    def check_connection_possible(component_list, session_id, library_name, default) -> list:
        if default:
            connection_folder = default_connection_path(library_name)
        else:
            connection_folder = connection_path(session_id, library_name)
        list_possible_connection = []
        _, _, filenames = next(walk(connection_folder))
        filenames.sort()

        for filename in filenames:
            with open(connection_folder / filename) as file:
                content_file = file.readlines()
            tmp = ConnectionOperation.get_instances(content_file)
            instances = []
            for key in tmp:
                if tmp[key] not in instances:
                    instances.append(tmp[key])
            all_inside = True
            for elt in instances:
                if elt not in component_list:
                    all_inside = False
                    break
            if all_inside:
                list_possible_connection.append(ConnectionOperation.get_content(content_file))

        return list_possible_connection

    @staticmethod
    def get_content(content_file) -> dict:
        line_header = ""
        name = ""
        instances = {}
        connections = []
        entry = False
        for line in content_file:
            line, header = _check_header(line)
            if not line:
                continue

            if header:
                if line == NAME_HEADER:
                    if line_header == "":
                        line_header = line
                    else:
                        Exception("File format not supported")
                elif line == INSTANCE_HEADER:
                    if line_header == NAME_HEADER:
                        line_header = line
                    else:
                        Exception("File format not supported")
                elif line == CONNECTIONS_HEADER:
                    if line_header == INSTANCE_HEADER:
                        line_header = line
                    else:
                        Exception("File format not supported")
                elif line == ENTRY_HEADER:
                    if line_header == CONNECTIONS_HEADER:
                        line_header = line
                    else:
                        Exception("File format not supported")

            else:
                if line_header == NAME_HEADER:
                    name += line + " "
                elif line_header == INSTANCE_HEADER:
                    split_line = line.split(": ")
                    instances.update({split_line[0].strip(): split_line[1].strip()})
                elif line_header == CONNECTIONS_HEADER:
                    connections.append(line.strip())
                elif line_header == ENTRY_HEADER:
                    entry = line.strip()

        return {"name": name[:-1], "instances": instances, "connections": connections, "entry": entry}

    @staticmethod
    def get_name(content_file) -> str:
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
    def get_instances(content_file) -> dict[str, str]:
        line_header = ""
        instances_list = {}
        for line in content_file:
            line, header = _check_header(line)
            if not line:
                continue

            if header:
                if line == CONNECTIONS_HEADER:
                    return instances_list
                elif line == INSTANCE_HEADER:
                    line_header = line
            else:
                if line_header == INSTANCE_HEADER:
                    split_line = line.split(": ")
                    instances_list.update({split_line[0].strip(): split_line[1].strip()})
        return instances_list

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
