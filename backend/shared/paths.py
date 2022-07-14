from __future__ import annotations

import os
from collections.abc import Callable
from pathlib import Path

output_path: Path = Path(os.path.dirname(__file__)).parent / "output"

build_path: Path = Path(os.path.dirname(__file__)).parent.parent / "frontend" / "build"

storage_path: Path = output_path / "storage"

persistence_path: Path = output_path / "persistence"

# Usage: session_path(_SESSION_ID_)
session_path: Callable[[str], Path] = lambda s: storage_path / f"s_{s}"

# Usage: component_path(_SESSION_ID_)
component_path: Callable[str, Path] = (
    lambda s: storage_path / f"s_{s}" / "components"
)

# Usage: library_path(_SESSION_ID_, _LIBRARY_NAME_)
library_path: Callable([[str, str], Path]) = (
    lambda s, n: component_path(s) / f"l_{n}"
)
