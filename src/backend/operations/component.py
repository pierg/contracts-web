import os
from os import walk
from pathlib import Path

from crome_component.component_tmp.component_spec import (
    ASSUMPTION_HEADER,
    DESCRIPTION_HEADER,
    GUARANTEES_HEADER,
    INPUTS_HEADER,
    NAME_HEADER,
    OUTPUTS_HEADER,
    _check_header,
)
from src.backend.shared.paths import component_path


class ComponentOperation:
    """Class that contains all the useful method for the component."""

    @staticmethod
    def save_component(data, old_name, session_id, library_name) -> None:
        """Save a component into a txt file.

        Arguments:
            data: The component information.
            old_name: The old name of the component, if it is a modified component.
            session_id: The id of the user session.
            library_name: The name of the library where the component will be saved.
        """
        component_folder = component_path(session_id, library_name)
        if not os.path.exists(component_folder):
            os.makedirs(component_folder)

        _, _, filenames = next(walk(component_folder))

        greatest_id = -1 if len(filenames) == 0 else int(max(filenames)[0:4])
        greatest_id += 1

        file_checked = ComponentOperation.__check_if_component_exist(old_name, component_folder)
        if file_checked:
            file = component_folder / file_checked
        else:
            file = component_folder / f"{str(greatest_id).zfill(4)}.txt"

        with open(file, "w") as file:
            file.write(f"{NAME_HEADER}\n\n")
            file.write(f"\t{data['name']}\n")

            file.write(f"\n{DESCRIPTION_HEADER}\n\n")
            file.write(f"\t{data['description']}\n")

            file.write(f"\n{INPUTS_HEADER}\n\n")
            for elt in data["inputs"]:
                file.write(f"\t{elt['name']} ({elt['type']})\n")

            file.write(f"\n{OUTPUTS_HEADER}\n\n")
            for elt in data["outputs"]:
                file.write(f"\t{elt['name']} ({elt['type']})\n")

            file.write(f"\n{ASSUMPTION_HEADER}\n\n")
            file.write("\tPL:\n")
            for elt in data["assumptions"]["PL"]:
                file.write(f"\t\t{elt}\n")
            file.write("\tLTL:\n")
            for elt in data["assumptions"]["LTL"]:
                file.write(f"\t\t{elt}\n")

            file.write(f"\n{GUARANTEES_HEADER}\n\n")
            file.write("\tPL:\n")
            for elt in data["guarantees"]["PL"]:
                file.write(f"\t\t{elt}\n")
            file.write("\tLTL:\n")
            for elt in data["guarantees"]["LTL"]:
                file.write(f"\t\t{elt}\n")

    @staticmethod
    def delete_component(name, session_id, library_name) -> bool:
        """Delete a component from a library.

        Arguments:
            name: The name of the component.
            session_id: The id of the session of the user.
            library_name: The library where the component is saved.

        Returns:
            A boolean that indicate if the component has been deleted.
        """
        component_folder = component_path(session_id, library_name)

        _, _, filenames = next(walk(component_folder))
        for filename in filenames:
            with open(component_folder / filename) as file:
                if ComponentOperation.get_name_from_file(file).strip() == name:
                    os.remove(component_folder / filename)
                    return True
        return False

    @staticmethod
    def get_raw_component(name, session_id, library_name):
        """Get the content of the txt file of a component.

        Arguments:
            name: The name of the component.
            session_id: The id of the session of the user.
            library_name: The library where the component is saved.

        Returns:
            A boolean that indicate if the component has not been found or the content of the file.
        """
        component_folder = component_path(session_id, library_name)
        _, _, filenames = next(walk(component_folder))
        for filename in filenames:
            with open(component_folder / filename) as file:
                if ComponentOperation.get_name_from_file(file) == name:
                    with open(component_folder / filename, "r") as ifile:
                        reads = ifile.readlines()
                        data = "".join(reads)
                        return data
        return False

    @staticmethod
    def save_component_file(component_file, session_id, library_name):
        """Save a component directly using the txt file and not attributes.

        Arguments:
            component_file: The content of the file.
            session_id: The id of the session of the user.
            library_name: The library where the component is saved.

        Returns:
            A boolean that indicate if the component has been saved.
        """
        component_folder = component_path(session_id, library_name)
        try:
            _check_structure_file(component_file)
        except:
            return False
        if not os.path.exists(component_folder):
            os.makedirs(component_folder)

        _, _, filenames = next(walk(component_folder))
        greatest_id = -1 if len(filenames) == 0 else int(max(filenames)[0:4])
        greatest_id += 1
        name = ComponentOperation.get_name_from_file(component_file.split("\n"))
        file_checked = ComponentOperation.__check_if_component_exist(name, component_folder)
        if file_checked:
            file = component_folder / file_checked
        else:
            file = component_folder / f"{str(greatest_id).zfill(4)}.txt"
        with open(file, "w") as file:
            file.write(str(component_file))
        return True

    @staticmethod
    def get_name_from_file(file) -> str:
        """Retrieve the name of a component from a txt file.

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
    def __check_if_component_exist(name: str, component_folder: Path) -> str:
        if not os.path.exists(component_folder):
            return ""
        _, _, filenames = next(walk(component_folder))
        for filename in filenames:
            with open(component_folder / filename) as file:
                name_found = ComponentOperation.get_name_from_file(file)
            if name_found == name:
                return filename
        return ""


def _check_structure_file(component_file):
    line_header = ""
    for line in component_file.split("\n"):
        line, header = _check_header(line)

        if not line:
            continue

        elif header:
            print(f"The Header is : {line}")
            if INPUTS_HEADER == line:
                if line_header == "":
                    line_header = line
                else:
                    Exception("File format not supported")

            elif OUTPUTS_HEADER == line:
                if line_header == INPUTS_HEADER:
                    line_header = line
                else:
                    Exception("File format not supported")

            elif ASSUMPTION_HEADER == line:
                if line_header == OUTPUTS_HEADER:
                    line_header = line
                else:
                    Exception("File format not supported")

            elif GUARANTEES_HEADER == line:
                if line_header == ASSUMPTION_HEADER:
                    line_header = line
                else:
                    Exception("File format not supported")
