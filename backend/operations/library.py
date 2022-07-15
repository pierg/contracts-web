import os.path
from os import walk

from backend.shared.paths import library_path

HEADER_SYMBOL = "**"
NAME_HEADER = "**NAME**"
COMPONENT_HEADER = "**COMPONENTS**"
COMMENT_CHAR = "#"


class LibraryOperation:

    @staticmethod
    def get_library(session_id) -> dict[str, list]:
        result = {}
        list_session = ["default", session_id]

        for session in list_session:
            library_folder = library_path(session)
            if not os.path.exists(library_folder):
                continue
            _, _, filenames = next(walk(library_folder))
            for library in filenames:
                with open(library_folder / library) as file:
                    data = file.readlines()
                    library_name = LibraryOperation.get_name(data)
                    component_list = LibraryOperation.get_component(data)
                    result.update({library_name: component_list})

        return result

    @staticmethod
    def add_to_library(library_name, list_components, session_id) -> None:
        library_folder = library_path(session_id)
        component_to_add = list_components
        if not os.path.exists(library_folder):
            os.makedirs(library_folder)

        _, _, filenames = next(walk(library_folder))

        greatest_id = -1 if len(filenames) == 0 else int(max(filenames)[0:4])
        greatest_id += 1

        file_checked = LibraryOperation.check_if_library_exist(library_name, library_folder)
        if file_checked:
            file = library_folder / file_checked
            with open(file) as ifile:
                component_exits = LibraryOperation.get_component(ifile)
            for component in component_exits:
                if component not in component_to_add:
                    component_to_add.append(component)
        else:
            file = library_folder / f"{str(greatest_id).zfill(4)}.txt"

        with open(file, "w") as file:
            file.write(f"{NAME_HEADER}\n\n")
            file.write(f"\t{library_name}\n")

            file.write(f"\n{COMPONENT_HEADER}\n\n")
            for elt in component_to_add:
                file.write(f"\t{elt}\n")

    @staticmethod
    def remove_from_library(library_name, component_name, session_id):
        library_folder = library_path(session_id)

        _, _, filenames = next(walk(library_folder))
        for filename in filenames:
            with open(library_folder / filename, "r") as file:
                data = file.readlines()
            if LibraryOperation.get_name(data) == library_name:
                component_list = LibraryOperation.get_component(data)
                component_list.remove(component_name)

                with open(library_folder / filename, "w") as file:
                    file.write(f"{NAME_HEADER}\n\n")
                    file.write(f"\t{library_name}\n")

                    file.write(f"\n{COMPONENT_HEADER}\n\n")
                    for elt in component_list:
                        file.write(f"\t{elt}\n")
                    return True
        return False

    @staticmethod
    def get_component(file) -> list:
        line_header = ""
        component_list = []
        for line in file:
            line, header = _check_header(line)
            if not line:
                continue

            if header:
                if line == NAME_HEADER:
                    if line_header == "":
                        line_header = line
                    else:
                        Exception("File format not supported")
                elif line == COMPONENT_HEADER:
                    if line_header == NAME_HEADER:
                        line_header = line
                    else:
                        Exception("File format not supported")
            else:
                if line_header == COMPONENT_HEADER:
                    component_list.append(line.strip())
        return component_list

    @staticmethod
    def get_name(file) -> str:
        line_header = ""
        name = ""
        for line in file:
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
    def check_if_library_exist(name, folder):
        if not os.path.exists(folder):
            return ""
        _, _, filenames = next(walk(folder))

        for filename in filenames:
            with open(folder / filename) as file:
                name_found = LibraryOperation.get_name(file)
            if name_found == name:
                return filename

        return ""


def _check_header(line: str) -> tuple[str, bool]:
    """Returns a comment-free, tab-replaced line with no whitespace and the number of tabs"""
    line = line.split(COMMENT_CHAR, 1)[0]
    if line.startswith(HEADER_SYMBOL):
        return line.strip(), True
    return line.strip(), False
