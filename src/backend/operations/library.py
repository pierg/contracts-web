import os.path
import shutil
from os import walk
from typing import Dict, List, Tuple

from crome_component.component_tmp import Component
from src.backend.shared.paths import component_path, library_description_file, library_path, session_path  # NOQA

HEADER_SYMBOL = "**"
NAME_HEADER = "**NAME**"
COMPONENT_HEADER = "**COMPONENTS**"
COMMENT_CHAR = "#"


class LibraryOperation:
    """Class that contains all the useful method for the library."""

    @staticmethod
    def get_library(session_id: str) -> List[Dict]:
        """Get all the library create inside the session folder and the default
        session.

        Arguments:
            session_id: The id of the session of the user.

        Returns:
            A list of all the library. Each library is a dictionary with all the useful information inside.
        """
        result = []
        list_session = ["default", session_id]

        for session in list_session:
            is_default = session == "default"
            session_folder = session_path(session)
            if not os.path.exists(session_folder):
                continue
            _, dir_names, _ = next(walk(session_folder))
            for dir_name in dir_names:
                if dir_name[:2] == "l_":
                    library_name = dir_name[2:]
                    component_folder = component_path(session, library_name)
                    component_list = []
                    if os.path.isdir(component_folder):
                        _, _, filenames = next(walk(component_folder))
                        filenames.sort()
                        for filename in filenames:
                            component = Component.from_file(component_folder / filename)
                            component_list.append(
                                {
                                    "name": component.name,
                                    "description": component.description,
                                    "inputs": component.spec.i,
                                    "outputs": component.spec.o,
                                    "assumptions": component.spec.a,
                                    "guarantees": component.spec.g,
                                }
                            )

                    result.append({"name": library_name, "components": component_list, "default": is_default})

        return result

    @staticmethod
    def add_to_library(library_name: str, list_components: List, session_id: str) -> None:
        """Add a component inside the description file of a library.

        Arguments:
            library_name: The name of the library.
            list_components: A list of the names of the components to be added.
            session_id: The id of the session where the library is.
        """
        library_folder = library_path(session_id, library_name)
        component_to_add = list_components
        description_file = library_description_file(session_id, library_name)
        if not os.path.exists(library_folder):
            os.makedirs(library_folder)
        else:
            with open(description_file) as ifile:
                component_exits = LibraryOperation.get_component(ifile)
            for component in component_exits:
                if component not in component_to_add:
                    component_to_add.append(component)

        with open(description_file, "w") as file:
            file.write(f"{NAME_HEADER}\n\n")
            file.write(f"\t{library_name}\n")

            file.write(f"\n{COMPONENT_HEADER}\n\n")
            for elt in component_to_add:
                file.write(f"\t{elt}\n")

    @staticmethod
    def remove_from_library(library_name: str, component_name: str, session_id: str) -> bool:
        description_file = library_description_file(session_id, library_name)

        if not os.path.exists(description_file):
            return False

        with open(description_file, "r") as file:
            data = file.readlines()

        component_list = LibraryOperation.get_component(data)
        component_list.remove(component_name)
        with open(description_file, "w") as file:
            file.write(f"{NAME_HEADER}\n\n")
            file.write(f"\t{library_name}\n")

            file.write(f"\n{COMPONENT_HEADER}\n\n")
            for elt in component_list:
                file.write(f"\t{elt}\n")
            return True

    @staticmethod
    def remove_library(library_name, session_id) -> bool:
        """Remove a library from a session folder.

        Arguments:
            library_name: The name of the library
            session_id: The id of the session where the library is.
        """
        library_folder = library_path(session_id, library_name)
        if os.path.exists(library_folder):
            shutil.rmtree(library_folder)
            return True
        return False

    @staticmethod
    def get_component(file) -> list:
        """Get all the component from the description file of a library.

        Arguments:
            file: The content of the txt file, each line is one line of the table

        Returns:
            A list of all the name of the components.
        """
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
        """Retrieve the name of a library from a txt file.

        Arguments:
            file: The content of the txt file, each line is one line of the table

        Returns:
            '' if the name has not been found, the name otherwise.
        """
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
    def check_if_library_exist(name, folder) -> str:
        if not os.path.exists(folder):
            return ""
        _, _, filenames = next(walk(folder))

        for filename in filenames:
            with open(folder / filename) as file:
                name_found = LibraryOperation.get_name(file)
            if name_found == name:
                return filename

        return ""


def _check_header(line: str) -> Tuple[str, bool]:
    """Returns a comment-free, tab-replaced line with no whitespace and the
    number of tabs."""
    line = line.split(COMMENT_CHAR, 1)[0]
    if line.startswith(HEADER_SYMBOL):
        return line.strip(), True
    return line.strip(), False
