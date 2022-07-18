import os
from os import walk
from pathlib import Path

from backend.operations.library import LibraryOperation
from backend.shared.paths import component_path, storage_path
from crome_component.component import Component
from crome_component.component.component_spec import NAME_HEADER, _check_header, INPUTS_HEADER, OUTPUTS_HEADER, \
    ASSUMPTION_HEADER, GUARANTEES_HEADER, DESCRIPTION_HEADER


class ComponentOperation:

    @staticmethod
    def get_components(session_id) -> list:
        list_components = []

        # We get default components
        default_folder = storage_path / "s_default" / "components"
        if os.path.isdir(default_folder):
            _, _, filenames = next(walk(default_folder))
            for filename in filenames:
                component = Component.from_file(default_folder / filename)
                list_components.append({"name": component.name, "description": component.description,
                                        "inputs": component.spec.i, "outputs": component.spec.o,
                                        "assumptions": component.spec.a, "guarantees": component.spec.g,
                                        "default": True})

        # We get components of the current session
        component_folder = component_path(session_id)
        if os.path.isdir(component_folder):
            _, _, filenames = next(walk(component_folder))
            for filename in filenames:
                component = Component.from_file(component_folder / filename)
                list_components.append({"name": component.name, "description": component.description,
                                        "inputs": component.spec.i, "outputs": component.spec.o,
                                        "assumptions": component.spec.a, "guarantees": component.spec.g,
                                        "default": False})

        return list_components

    @staticmethod
    def save_component(data, old_name, session_id) -> None:
        component_folder = component_path(session_id)
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

        if old_name != data["name"]:
            LibraryOperation.name_component_changed(old_name, data["name"], session_id)

    @staticmethod
    def delete_component(name, session_id) -> bool:
        component_folder = component_path(session_id)

        _, _, filenames = next(walk(component_folder))
        for filename in filenames:
            with open(component_folder / filename) as file:
                if ComponentOperation.get_name_from_file(file).strip() == name:
                    os.remove(component_folder / filename)
                    LibraryOperation.component_removed(name, session_id)
                    return True
        return False

    @staticmethod
    def get_raw_component(name, session_id):
        component_folder = component_path(session_id)
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
    def save_component_file(component_file, session_id):
        component_folder = component_path(session_id)
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
