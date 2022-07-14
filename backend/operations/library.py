import os.path
from os import walk

from backend.operations.component import ComponentOperation
from backend.shared.paths import component_path, library_path
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

    @staticmethod
    def add_to_library(library_name, list_components, session_id) -> None:
        library_folder = library_path(session_id, library_name)
        if not os.path.exists(library_folder):
            os.makedirs(library_folder)

        for component in list_components:
            ComponentOperation.save_component(component, library_folder)

    @staticmethod
    def remove_from_library(library_name, component_name, session_id):
        library_folder = library_path(session_id, library_name)
        if not os.path.exists(library_folder):
            return

        _, _, filenames = next(walk(library_folder))

        for filename in filenames:
            with open(library_folder / filename) as file:
                if ComponentOperation.get_name_from_file(file).strip() == component_name:
                    os.remove(library_folder / filename)
                    return
