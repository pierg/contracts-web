from flask import request
from flask_socketio import emit

from src.backend.app import send_message_to_user
from src.backend.operations.library import LibraryOperation

try:
    from __main__ import socketio
except ImportError:
    from src.backend.app import socketio


# The signal for the library
@socketio.on("get-library")
def get_library() -> None:
    """
        Get all the library that exists in the session folder
    """
    session_id = str(request.args.get("id"))
    list_library = LibraryOperation.get_library(session_id)
    emit("receive-library", list_library, room=request.sid)


@socketio.on("add-components-to-library")
def add_components_to_library(data) -> None:
    """
        Add components to the library wanted
    """
    session_id = str(request.args.get("id"))
    LibraryOperation.add_to_library(data["name"], data["components"], session_id)

    emit("add-to-library-done", True, room=request.sid)
    send_message_to_user(f"The components have been added to the library {data['name']}", request.sid, "success")


@socketio.on("remove-component-from-library")
def remove_component_from_library(data) -> None:
    """
        Remove a component from a library
    """
    session_id = str(request.args.get("id"))
    is_deleted = LibraryOperation.remove_from_library(data["name"], data["component"], session_id)

    emit("remove-from-library-done", is_deleted, room=request.sid)


@socketio.on("remove-library")
def remove_library(library_name) -> None:
    """
        Remove a library
    """
    session_id = str(request.args.get("id"))
    is_deleted = LibraryOperation.remove_library(library_name, session_id)
    emit("remove-library-done", is_deleted, room=request.sid)
    if is_deleted:
        send_message_to_user(f"The library {library_name} has been deleted.", request.sid, "success")
    else:
        send_message_to_user(f"The library {library_name} has not been deleted.", request.sid, "error")
