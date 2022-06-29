import os
import json
from os import walk

from backend.shared.paths import component_path
from crome_component.component import Component

HEADER_SYMBOL = "**"
NAME_HEADER = "**NAME**"
DESCRIPTION_HEADER = "**DESCRIPTION**"
INPUTS_HEADER = "**INPUTS**"
OUTPUTS_HEADER = "**OUTPUTS**"
ASSUMPTION_HEADER = "**ASSUMPTION**"
GUARANTEES_HEADER = "**GUARANTEES**"
COMMENT_CHAR = "#"


class ComponentOperation:

    @staticmethod
    def get_components(session_id) -> list:
        list_components = []
        # We get components of the current session
        component_folder = component_path(session_id)

        if os.path.isdir(component_folder):
            _, _, filenames = next(walk(component_folder))
            for filename in filenames:
                component = Component.from_file(component_folder / filename)
                list_components.append({"name": component.name, "description": component.description,
                                        "inputs": component.spec.i, "outputs": component.spec.o,
                                        "assumptions": component.spec.a, "guarantees": component.spec.g})

        return list_components

    @staticmethod
    def save_component(data, session_id) -> None:
        component_folder = component_path(session_id)
        if not os.path.exists(component_folder):
            os.makedirs(component_folder)
        # TODO : create the txt file and put all the information inside

    @staticmethod
    def delete_component(name, session_id) -> bool:
        component_folder = component_path(session_id)

        _, _, filenames = next(walk(component_folder))
        for filename in filenames:
            with open(component_folder / filename) as file:
                json_content = json.load(file)
                if json_content["name"] == name:
                    os.remove(component_folder / filename)
                    return True
        return False

    @staticmethod
    def _check_header(line: str) -> tuple[str, bool]:
        if line.startswith(HEADER_SYMBOL):
            return line.strip(), True
        return line.strip(), False
