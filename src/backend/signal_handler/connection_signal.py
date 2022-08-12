from __main__ import socketio
from flask import request
from flask_socketio import emit

from src.backend.app import send_message_to_user  # NOQA
from src.backend.operations.connection import ConnectionOperation


@socketio.on("save-connection")
def save_connection(data) -> None:
    """Save a connection created by the user.

    Arguments:
        data: A dictionary containing the connection and the name of the library.
    """
    session_id = str(request.args.get("id"))
    ConnectionOperation.save_connection(data, session_id, data["library_name"])
    emit("save-connection-done", True, room=request.sid)


@socketio.on("delete-connection")
def delete_connection(data) -> None:
    """Save a connection created by the user.

    Arguments:
        data: A dictionary containing the name of the connection and the name of the library.
    """
    session_id = str(request.args.get("id"))
    ConnectionOperation.delete_connection(data["name"], session_id, data["library_name"])
    emit("delete-connection-done", True, room=request.sid)


@socketio.on("get-possible-connection")
def get_possible_connection(data) -> None:
    """Get all the possible connection already created by the user given the
    components chosen.

    Arguments:
        data: A dictionary containing the list of the connections chosen and the name of the library.
    """
    session_id = str(request.args.get("id"))
    possible_list = ConnectionOperation.check_connection_possible(
        data["components"], session_id, data["library_name"], data["default"]
    )
    emit("receive-possible-connection", possible_list, room=request.sid)


@socketio.on("upload-connection")
def upload_connection(data) -> None:
    """Upload a connection using a txt file.

    Arguments:
        data: A dictionary containing the txt file and the name of the library.
    """

    session_id = str(request.args.get("id"))
    upload_done = ConnectionOperation.save_connection_file(data["library_name"], data["connection_file"], session_id)
    emit("upload-done-connection", upload_done, room=request.sid)
    if not upload_done:
        send_message_to_user("The file does not have the right structure", request.sid, "error")
    else:
        send_message_to_user("The connection has been uploaded", request.sid, "success")


@socketio.on("download-connections")
def download_connections(data):
    """Download the txt file of connection(s)

    Arguments:
        data: A dictionary containing the names of the connections to download and the library name where they are saved.
    """
    list_connections = []
    session_id = "default" if data["is_default"] else request.args.get("id")
    print(data["names"])
    for name in data["names"]:
        raw = ConnectionOperation.get_raw_connection(name, session_id, data["library_name"])
        if raw:
            tmp = {"name": name, "file": raw}
            list_connections.append(tmp)
    emit("connections-downloaded", list_connections, room=request.sid)
