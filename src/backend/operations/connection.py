import os.path
from os import walk
from pathlib import Path
from typing import Dict, List, TextIO, Tuple

from src.backend.shared.paths import connection_path, default_connection_path

HEADER_SYMBOL = "**"
NAME_HEADER = "**NAME**"
INSTANCE_HEADER = "**INSTANCES**"
CONNECTIONS_HEADER = "**CONNECTIONS**"
COMMENT_CHAR = "#"


class ConnectionOperation:
    """Class that contains all the useful method for the connection."""

    @staticmethod
    def save_connection(data: Dict, session_id: str, library_name: str) -> None:
        """Save a connection into a txt file.

        Arguments:
            data: The connection information.
            session_id: The id of the user session.
            library_name: The name of the library where the connection will be saved.
        """
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

    @staticmethod
    def save_connection_file(library_name: str, connection_file: str, session_id: str) -> bool:
        """Save a connection file. It checks if the file has the right
        structure.

        Arguments:
            session_id: The id of the session of the user.
            library_name: The library where the connection is saved.
            connection_file: The content of the txt file.

        Returns:
            A boolean that indicate if the connection has been saved.
        """

        connection_folder = connection_path(session_id, library_name)
        if not _check_structure_file(connection_file):
            return False

        if not os.path.exists(connection_folder):
            os.makedirs(connection_folder)

        _, _, filenames = next(walk(connection_folder))
        greatest_id = -1 if len(filenames) == 0 else int(max(filenames)[0:4])
        greatest_id += 1
        name = ConnectionOperation.get_name(connection_file.split("\n"))
        file_checked = ConnectionOperation._check_if_already_exist(connection_folder, name)
        if file_checked:
            file = connection_folder / file_checked
        else:
            file = connection_folder / f"{str(greatest_id).zfill(4)}.txt"
        with open(file, "w") as file:
            file.write(str(connection_file))
        return True

    @staticmethod
    def delete_connection(name: str, session_id: str, library_name: str) -> None:
        """Delete a connection from a library.

        Arguments:
            name: The name of the connection.
            session_id: The id of the session of the user.
            library_name: The library where the connection is saved.

        Returns:
            A boolean that indicate if the connection has been deleted.
        """
        connection_folder = connection_path(session_id, library_name)
        _, _, filenames = next(walk(connection_folder))

        for filename in filenames:
            with open(connection_folder / filename) as file:
                content_file = file.readlines()
            if name == ConnectionOperation.get_name(content_file):
                os.remove(connection_folder / filename)

    @staticmethod
    def check_connection_possible(component_list: str, session_id: str, library_name: str, default: str) -> List:
        """Check all the connection that are already saved and used the same
        component as the component_list.

        Arguments:
            component_list: List of the name of the components.
            session_id: The id of the session of the user.
            library_name: The library where the connections are.
            default: Boolean that indicates if we work with a default project.

        Returns:
            A list of all the connection possible.
        """
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
    def get_content(content_file: List[str] | TextIO) -> Dict:
        """Get the content of a txt file of a connection.

        Arguments:
            content_file: The content of the txt file, each line is one line of the table.

        Returns:
            A dict that contains all the information about the connection.
        """
        line_header = ""
        name = ""
        instances = {}
        connections = []
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

            else:
                if line_header == NAME_HEADER:
                    name += line + " "
                elif line_header == INSTANCE_HEADER:
                    split_line = line.split(": ")
                    instances.update({split_line[0].strip(): split_line[1].strip()})
                elif line_header == CONNECTIONS_HEADER:
                    connections.append(line.strip())

        return {"name": name[:-1], "instances": instances, "connections": connections}

    @staticmethod
    def get_name(content_file: List[str] | TextIO) -> str:
        """Retrieve the name of a connection from a txt file.

        Arguments:
            content_file: The content of the txt file, each line is one line of the table

        Returns:
            '' if the name has not been found, the name otherwise.
        """
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
    def get_instances(content_file: List[str] | TextIO) -> Dict[str, str]:
        """Retrieve the name of a connection from a txt file.

        Arguments:
            content_file: The content of the txt file, each line is one line of the table

        Returns:
            '' if the name has not been found, the name otherwise.
        """
        line_header = ""
        instances_list: Dict = {}
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
    def get_raw_connection(name: str, session_id: str, library_name: str) -> bool | str:
        """Get the content of the txt file of a connection.

        Arguments:
            name: The name of the connection.
            session_id: The id of the session of the user.
            library_name: The library where the connection is saved.

        Returns:
            A boolean that indicate if the component has not been found or the connection of the file.
        """
        connection_folder = connection_path(session_id, library_name)
        print(connection_folder)
        _, _, filenames = next(walk(connection_folder))
        for filename in filenames:
            with open(connection_folder / filename) as file:
                if ConnectionOperation.get_name(file) == name:
                    with open(connection_folder / filename, "r") as ifile:
                        reads = ifile.readlines()
                        data = "".join(reads)
                        return data
        return False

    @staticmethod
    def _check_if_already_exist(folder: Path, name: str) -> str:
        if not os.path.exists(folder):
            return ""
        _, _, filenames = next(walk(folder))

        for filename in filenames:
            with open(folder / filename, "r") as file:
                if ConnectionOperation.get_name(file.readlines()) == name:
                    return filename
        return ""


def _check_header(line: str) -> Tuple[str, bool]:
    """Returns a comment-free, tab-replaced line with no whitespace and the
    number of tabs."""
    line = line.split(COMMENT_CHAR, 1)[0]
    if line.startswith(HEADER_SYMBOL):
        return line.strip(), True
    return line.strip(), False


def _check_structure_file(connection_file: str) -> bool:
    line_header = ""
    for line in connection_file.split("\n"):
        line, header = _check_header(line)

        if not line:
            continue

        elif header:
            print(f"The Header is : {line}")
            if NAME_HEADER == line:
                if line_header == "":
                    line_header = line
                else:
                    return False

            elif INSTANCE_HEADER == line:
                if line_header == NAME_HEADER:
                    line_header = line
                else:
                    return False

            elif CONNECTIONS_HEADER == line:
                if line_header == INSTANCE_HEADER:
                    line_header = line
                else:
                    return False
    return True
