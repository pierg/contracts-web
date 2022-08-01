from dataclasses import dataclass
from pathlib import Path

from crome_component.component_tmp.component_spec import DESCRIPTION_HEADER, NAME_HEADER, ComponentSpec, _check_header


@dataclass
class Component:
    name: str = ""
    description: str = ""
    spec: ComponentSpec = None

    @classmethod
    def from_file(cls, file_path: Path):
        spec = ComponentSpec.from_file(file_path)
        name = ""
        description = ""
        with open(file_path, "r") as ifile:

            line_header = ""

            for line in ifile:
                line, header = _check_header(line)

                if not line:
                    continue

                elif header:

                    if line_header == DESCRIPTION_HEADER:
                        break

                    if line == NAME_HEADER:
                        if line_header == "":
                            line_header = line
                        else:
                            Exception("File format not supported")
                    elif line == DESCRIPTION_HEADER:
                        if line_header == NAME_HEADER:
                            line_header = line
                        else:
                            Exception("File format not supported")

                else:

                    if line_header == NAME_HEADER:
                        name += line.strip() + " "
                    elif line_header == DESCRIPTION_HEADER:
                        description += line.strip() + " "

        return cls(name=name[:-1], description=description[:-1], spec=spec)
