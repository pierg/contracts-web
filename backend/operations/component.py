import os
from os import walk
from pathlib import Path

from backend.shared.paths import component_path
from backend.shared.paths import storage_path
from crome_component.component import Component
from crome_component.component.component_spec import NAME_HEADER, _check_header


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
    def save_component(data, session_id) -> None:
        component_folder = component_path(session_id)
        if not os.path.exists(component_folder):
            os.makedirs(component_folder)

        _, _, filenames = next(walk(component_folder))

        greatest_id = -1 if len(filenames) == 0 else int(max(filenames)[0:4])
        greatest_id += 1

        file_checked = ComponentOperation.__check_if_component_exist(data["name"], component_folder)
        if file_checked:
            file = component_folder / file_checked
        else:
            file = component_folder / f"{str(greatest_id).zfill(4)}.txt"

        with open(file, "w") as file:
            file.write("**NAME**\n\n")
            file.write(f"\t{data['name']}\n")

            file.write("\n**DESCRIPTION**\n\n")
            file.write(f"\t{data['description']}\n")

            file.write("\n**INPUTS**\n\n")
            for elt in data["inputs"]:
                file.write(f"\t{elt['name']} ({elt['type']})\n")

            file.write("\n**OUTPUTS**\n\n")
            for elt in data["outputs"]:
                file.write(f"\t{elt['name']} ({elt['type']})\n")

            file.write("\n**ASSUMPTIONS**\n\n")
            file.write("\tPL:\n")
            for elt in data["assumptions"]["PL"]:
                file.write(f"\t\t{elt}\n")
            file.write("\tLTL:\n")
            for elt in data["assumptions"]["LTL"]:
                file.write(f"\t\t{elt}\n")

            file.write("\n**GUARANTEES**\n\n")
            file.write("\tPL:\n")
            for elt in data["guarantees"]["PL"]:
                file.write(f"\t\t{elt}\n")
            file.write("\tLTL:\n")
            for elt in data["guarantees"]["LTL"]:
                file.write(f"\t\t{elt}\n")

    @staticmethod
    def delete_component(name, session_id) -> bool:
        component_folder = component_path(session_id)

        _, _, filenames = next(walk(component_folder))
        for filename in filenames:
            print(ComponentOperation.__get_name_from_file(component_folder / filename))
            if ComponentOperation.__get_name_from_file(component_folder / filename).strip() == name:
                os.remove(component_folder / filename)
                return True
        return False

    @staticmethod
    def __get_name_from_file(file_path) -> str:
        if not os.path.exists(file_path):
            return ""

        with open(file_path, 'r') as ifile:
            line_header = ""
            name = ""
            for line in ifile:
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
            name_found = ComponentOperation.__get_name_from_file(component_folder / filename)
            if name_found == name:
                return filename
