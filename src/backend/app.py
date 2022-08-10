import argparse
import threading
import time
from os import walk
from time import strftime
from typing import Any, Dict

from flask import Flask, Response, request
from flask_socketio import SocketIO, emit

from src.backend.operations.connection import ConnectionOperation  # NOQA
from src.backend.operations.library import LibraryOperation  # NOQA
from src.backend.shared.paths import build_path, storage_path  # NOQA

parser = argparse.ArgumentParser(description="Launching Flask Backend")
parser.add_argument("--serve", default=False, type=bool, help="indicate if serving the pages")
parser.add_argument("--dev", default=False, type=bool, help="indicate if we are in a development mode")
args = parser.parse_args()

if args.serve:
    print("Serving the web pages from the build folder")
    app = Flask(__name__, static_folder=str(build_path), static_url_path="/")
else:
    print("Launching Backend")
    app = Flask(__name__)

socketio = SocketIO(app, cors_allowed_origins="*")

users: Dict[str, Any] = {}
# String dictionary associating the id of the request to talk to the user with the session id given by the frontend.

cookies: Dict[str, str] = {}


# String dictionary association the id of the session with that of the cookie that can open it.

# HOW TO SEND A NOTIFICATION :
# emit("send-notification", {"crometypes": "error", "content": "message appearing"}, room=users[data['session']])
# crometypes : error = red,
#         success = green,
#         warning = yellow,
#         info = blue


@socketio.on("connect")
def connected() -> None:
    """Establish the connection between the front and the back while checking
    that the session is not already in use."""
    print("Connected")
    print(f'ID {request.args.get("id")}')
    lock = threading.Lock()
    lock.acquire()
    session_id = str(request.args.get("id"))
    cookie = str(request.args.get("cookie"))
    tab_id = str(request.args.get("tabId"))
    if session_id in users:  # Check if this session is already open
        if cookie != cookies[session_id]:
            emit("is-connected", False, room=request.sid)
            return
    else:
        users[session_id] = {}
    users[session_id][tab_id] = request.sid
    cookies[session_id] = cookie
    now = time.localtime(time.time())
    emit(
        "send-message", strftime("%H:%M:%S", now) + f" Connected to session {request.args.get('id')}", room=request.sid
    )
    emit("is-connected", True, room=request.sid)
    lock.release()


@socketio.on("session-existing")
def check_if_session_exist(session_id) -> None:
    """Check if a session is free and if the user can enter it.

    Arguments:
            session_id: The id of the wanted session
    """
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
    """It disconnects the user of the session he was attached to."""
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
            room=request.sid,
        )
        del users[session_id][tab_id]


@app.route("/")
def index() -> Response:
    return app.send_static_file("index.html")


@app.route("/time")
def get_current_time() -> Dict[str, float]:
    return {"time": time.time()}


def send_message_to_user(content: str, room_id: str, crometype: str) -> None:
    """Simplified version to send a notification and a message to a user.

    Arguments:
        content: The content of the message.
        room_id: Where to send the notification and the message.
        crometype: The type of notification to send.
    """
    now = time.localtime(time.time())
    emit("send-notification", {"crometypes": crometype, "content": content}, room=room_id)
    emit("send-message", f"{strftime('%H:%M:%S', now)} - {content}", room=room_id)


@socketio.on("display-message")
def display_message(data) -> None:
    """Display a message and send a notification to the user. It is a version
    that is only used by our frontend.

    Arguments:
         data: A dictionary containing the content of the message, for the notification and the console,
        and the type of notification to send.
    """
    now = time.localtime(time.time())
    emit("send-notification", {"crometypes": data["type"], "content": data["messageNotif"]}, room=request.sid)
    emit(
        "send-message",
        strftime("%H:%M:%S", now) + " " + data["messageSideBar"],
        room=request.sid,
    )


import src.backend.signal_handler.component_signal  # NOQA
import src.backend.signal_handler.connection_signal  # NOQA
import src.backend.signal_handler.library_signal  # NOQA

if __name__ == "__main__":
    print("I'm here !")
    if args.dev:
        print("Starting the backend in development mode")
        socketio.run(app, host="0.0.0.0")
    else:
        print("Starting the server")
        socketio.run(app, host="0.0.0.0", ssl_context=("cert.pem", "privkey.pem"))
