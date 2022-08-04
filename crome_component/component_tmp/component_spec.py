from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

HEADER_SYMBOL = "**"
NAME_HEADER = "**NAME**"
DESCRIPTION_HEADER = "**DESCRIPTION**"
INPUTS_HEADER = "**INPUTS**"
OUTPUTS_HEADER = "**OUTPUTS**"
ASSUMPTION_HEADER = "**ASSUMPTIONS**"
GUARANTEES_HEADER = "**GUARANTEES**"
COMMENT_CHAR = "#"


@dataclass
class ComponentSpec:
    a: Dict[str, List[str]]
    g: Dict[str, List[str]]
    i: List[Dict[str, str]]
    o: List[Dict[str, str]]

    @classmethod
    def from_file(cls, file_path: Path):
        i: List[Dict[str, str]] = []
        o: List[Dict[str, str]] = []
        a: Dict[str, List[str]] = {"LTL": [], "PL": []}
        g: Dict[str, List[str]] = {"LTL": [], "PL": []}

        line_header = ""
        type_ltl = ""

        with open(file_path, "r") as ifile:
            for line in ifile:
                line, header = _check_header(line)

                if not line:
                    continue

                elif header:

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
                            type_ltl = ""
                        else:
                            Exception("File format not supported")

                    elif GUARANTEES_HEADER == line:
                        if line_header == ASSUMPTION_HEADER:
                            line_header = line
                            type_ltl = ""
                        else:
                            Exception("File format not supported")

                else:

                    if INPUTS_HEADER == line_header:
                        split_line = line.strip().split(" ")
                        if len(split_line) != 2:
                            continue
                        name, input_type = split_line[0], split_line[1]
                        i.append({"name": name, "type": input_type[1:-1]})

                    elif OUTPUTS_HEADER == line_header:
                        split_line = line.strip().split(" ")
                        if len(split_line) != 2:
                            continue
                        name, output_type = split_line[0], split_line[1]
                        o.append({"name": name, "type": output_type[1:-1]})

                    elif ASSUMPTION_HEADER == line_header:
                        if type_ltl == "" and line.startswith("PL"):
                            type_ltl = "PL"
                            continue
                        elif type_ltl == "PL" and line.startswith("LTL"):
                            type_ltl = "LTL"
                            continue

                        a[type_ltl].append(line.strip())

                    elif GUARANTEES_HEADER == line_header:
                        if type_ltl == "" and line.startswith("PL"):
                            type_ltl = "PL"
                            continue
                        elif type_ltl == "PL" and line.startswith("LTL"):
                            type_ltl = "LTL"
                            continue

                        g[type_ltl].append(line.strip())

            return cls(a, g, i, o)


def _check_header(line: str) -> Tuple[str, bool]:
    """Returns a comment-free, tab-replaced line with no whitespace and the
    number of tabs."""
    line = line.split(COMMENT_CHAR, 1)[0]
    if line.startswith(HEADER_SYMBOL):
        return line.strip(), True
    return line.strip(), False
