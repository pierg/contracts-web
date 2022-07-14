import os.path
from os import walk

from backend.shared.paths import component_path
from crome_component.component import Component


class LibraryOperation:

    @staticmethod
    def get_library(session_id) -> dict[str, list]:
        result = {}
        list_session = ["default", session_id]

        for session in list_session:
            component_folder = component_path(session)
            if not os.path.exists(component_folder):
                continue
            _, dir_names, _ = next(walk(component_folder))
            for library in dir_names:
                library_name = library[2:]
                _, _, filenames = next(walk(component_folder / library))
                dict_library = {library_name: []}
                for component_file in filenames:
                    component = Component.from_file(component_folder / library / component_file)
                    dict_library[library_name].append({"name": component.name, "description": component.description,
                                                       "inputs": component.spec.i, "outputs": component.spec.o,
                                                       "assumptions": component.spec.a, "guarantees": component.spec.g,
                                                       "default": True})
                result.update(dict_library)

        return result
