import argparse
import threading
import time
from os import walk
from time import strftime
from typing import Any

from flask import Flask, Response, request
from flask_socketio import SocketIO, emit

from backend.operations.component import ComponentOperation
from backend.shared.paths import (
    build_path,
    storage_path,
)

parser = argparse.ArgumentParser(description="Launching Flask Backend")
parser.add_argument(
    "--serve", default=False, type=bool, help="indicate if serving the pages"
)
args = parser.parse_args()

if args.serve:
    print("Serving the web pages from the build folder")
    app = Flask(__name__, static_folder=str(build_path), static_url_path="/")
else:
    print("Launching Backend")
    app = Flask(__name__)

socketio = SocketIO(app, cors_allowed_origins="*")

users: dict[str, Any] = {}
# String dictionary associating the id of the request to talk to the user with the session id given by the frontend.

cookies: dict[str, str] = {}


# String dictionary association the id of the session with that of the cookie that can open it.

# HOW TO SEND A NOTIFICATION :
# emit("send-notification", {"crometypes": "error", "content": "message appearing"}, room=users[data['session']])
# crometypes : error = red,
#         success = green,
#         warning = yellow,
#         info = blue


@socketio.on("connect")
def connected() -> None:
    """
    Establish the connection between the front and the back
    while checking that the session is not already in use.
    """
    print("Connected")
    print(f'ID {request.args.get("id")}')
    lock = threading.Lock()
    lock.acquire()
    session_id = str(request.args.get("id"))
    cookie = str(request.args.get("cookie"))
    tab_id = str(request.args.get("tabId"))
    if session_id in users:  # Check if this session is already open
        if cookie != cookies[session_id]:
            emit(
                "is-connected",
                False,
                room=request.sid
            )
            return
    else:
        users[session_id] = {}
    users[session_id][tab_id] = request.sid
    cookies[session_id] = cookie
    now = time.localtime(time.time())
    emit(
        "send-message",
        strftime("%H:%M:%S", now) + f" Connected to session {request.args.get('id')}",
        room=request.sid
    )
    emit(
        "is-connected",
        True,
        room=request.sid
    )
    lock.release()


@socketio.on("session-existing")
def check_if_session_exist(data) -> None:
    """
    Check if a session is free and if the user can enter it.
    """
    session_id = str(data["session"])
    tab_id = str(request.args.get("tabId"))
    cookie = str(request.args.get("cookie"))
    print("check if following session exists : " + session_id)
    dir_path, dir_names, filenames = next(walk(storage_path))
    found = False
    sessions_folder = f"s_" + session_id
    for dir_name in dir_names:
        if dir_name == sessions_folder:
            found = True
    if session_id == "default" or session_id == "contracts":
        found = False

    if found:
        if session_id in users and cookie != cookies[session_id]:
            found = False
    print(f"users : {users}")
    emit("receive-answer", found, room=users[str(request.args.get("id"))][tab_id])


@socketio.on("disconnect")
def disconnected() -> None:
    """
    It disconnects the user of the session he was attached to.
    """
    print("Disconnected")
    print(request.args)
    print(f'ID {request.args.get("id")}')

    session_id = str(request.args.get("id"))
    tab_id = str(request.args.get("tabId"))

    if session_id in users and tab_id in users[session_id]:
        now = time.localtime(time.time())
        emit(
            "send-message",
            f"{strftime('%H:%M:%S', now)} Session {request.args.get('id')} disconnected",
            room=request.sid
        )
        del users[session_id][tab_id]


@app.route("/")
def index() -> Response:
    return app.send_static_file("index.html")


@app.route("/time")
def get_current_time() -> dict[str, float]:
    return {"time": time.time()}


def send_message_to_user(content: str, room_id: str, crometype: str) -> None:
    """
    Simplified version to send a notification and a message to a user.
    """
    now = time.localtime(time.time())
    emit(
        "send-notification",
        {"crometypes": crometype, "content": content},
        room=room_id
    )
    emit(
        "send-message",
        f"{strftime('%H:%M:%S', now)} - {content}",
        room=room_id
    )


@socketio.on("get-components")
def get_components() -> None:
    """
        get the synthesis created by the user and the examples.
    """
    session_id = str(request.args.get("id"))
    list_examples = ComponentOperation.get_components(session_id)

    emit("receive-components", list_examples, room=request.sid)


@socketio.on("save-component")
def save_component(data) -> None:
    """
        get the synthesis created by the user and the examples.
    """
    print("I'm here !")
    print(data)
    print(len(data["inputs"]))
    session_id = str(request.args.get("id"))
    now = time.localtime(time.time())
    name: str = data["name"]

    # Detection error
    error = 0
    if len(data["inputs"]) == 0 and len(data["outputs"]) == 0:
        error = 1
        emit(
            "send-message",
            strftime("%H:%M:%S", now) + ' The component "' + name + '" has not been saved. There are no inputs and '
                                                                    'outputs',
            room=request.sid,
        )

    if error == 1:
        emit(
            "send-notification",
            {"crometypes": "error", "content": "The component can't be added, see console for more information"},
            room=request.sid
        )
    else:
        emit("component-saved", True, room=request.sid)

        try:
            ComponentOperation.save_component(data, session_id)
            send_message_to_user(content='The component "' + name + '" has been saved.',
                                 room_id=request.sid, crometype="success")
        except KeyError as keyError:
            emit(
                "send-message",
                strftime("%H:%M:%S", now) + ' The component "' + name + '" has not been saved. Error with the entry of the '
                                                                   f'LTL/Pattern \n KeyError : {keyError}',
                room=request.sid,
            )


@socketio.on("delete-component")
def delete_component(name) -> None:
    """
    We delete the json file related to the component id given by the frontend.
    """
    session_id = str(request.args.get("id"))

    is_deleted = ComponentOperation.delete_component(name, session_id)
    if is_deleted:
        send_message_to_user(f"The component '{name}' has been deleted.", request.sid, "success")
    else:
        send_message_to_user(f"The component '{name}' has not been deleted", request.sid, "error")
    emit("component-deleted", is_deleted, room=request.sid)


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0")
