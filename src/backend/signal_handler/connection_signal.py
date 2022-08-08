from __main__ import socketio
from flask import request
from flask_socketio import emit

from src.backend.app import send_message_to_user  # NOQA
from src.backend.operations.connection import ConnectionOperation


@socketio.on("save-connection")
def save_connection(data) -> None:
    """
        Save a connection created by the user.

        Arguments:
            data: A dictionary containing the connection and the name of the library.

    """
    session_id = str(request.args.get("id"))
    ConnectionOperation.save_connection(data, session_id, data["library_name"])
    emit("save-connection-done", True, room=request.sid)


@socketio.on("delete-connection")
def delete_connection(data) -> None:
    """
        Save a connection created by the user.
        
        Arguments:
            data: A dictionary containing the name of the connection and the name of the library.
    """
    session_id = str(request.args.get("id"))
    ConnectionOperation.delete_connection(data["name"], session_id, data["library_name"])
    emit("delete-connection-done", True, room=request.sid)


@socketio.on("get-possible-connection")
def get_possible_connection(data) -> None:
    """
        Get all the possible connection already created by the user given the components chosen.

        Arguments:
            data: A dictionary containing the list of the connections chosen and the name of the library.
    """
    session_id = str(request.args.get("id"))
    possible_list = ConnectionOperation.check_connection_possible(
        data["components"], session_id, data["library_name"], data["default"]
    )
    emit("receive-possible-connection", possible_list, room=request.sid)
