import time
from time import strftime

from flask import request
from flask_socketio import emit

from backend.app import send_message_to_user
from backend.operations.component import ComponentOperation

try:
    from __main__ import socketio
except ImportError:
    from backend.app import socketio


# The signal for the component
@socketio.on("save-component")
def save_component(data) -> None:
    """
        get the synthesis created by the user and the examples.
    """
    session_id = str(request.args.get("id"))
    now = time.localtime(time.time())
    component = data["new_component"]
    print(f"Old Name : {data['old_name']}")
    name: str = component["name"]

    # Detection error
    error = 0
    if len(component["inputs"]) == 0 and len(component["outputs"]) == 0:
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
            ComponentOperation.save_component(data=component, old_name=data["old_name"], session_id=session_id,
                                              library_name=data["library_name"])
            send_message_to_user(content='The component "' + name + '" has been saved.',
                                 room_id=request.sid, crometype="success")
        except KeyError as keyError:
            emit(
                "send-message",
                strftime("%H:%M:%S", now) + ' The component "' + name + '" has not been saved. Error with the entry '
                                                                        f'of the LTL/Pattern \n KeyError : {keyError}',
                room=request.sid,
            )


@socketio.on("delete-component")
def delete_component(data) -> None:
    """
    We delete the json file related to the component id given by the frontend.
    """
    session_id = str(request.args.get("id"))

    is_deleted = ComponentOperation.delete_component(data["name"], session_id, data["library_name"])
    if is_deleted:
        send_message_to_user(f"The component '{data['name']}' has been deleted.", request.sid, "success")
    else:
        send_message_to_user(f"The component '{data['name']}' has not been deleted", request.sid, "error")
    emit("component-deleted", is_deleted, room=request.sid)


@socketio.on("download-components")
def download_components(data):
    """
        Download the txt file of component(s)
    """
    list_component = []
    session_id = "default" if data["is_default"] else request.args.get("id")
    for name in data["names"]:
        raw = ComponentOperation.get_raw_component(name, session_id, data["library_name"])
        if raw:
            tmp = {"name": name, "file": raw}
            list_component.append(tmp)
    emit("components-downloaded", list_component, room=request.sid)


@socketio.on("upload-component")
def upload_component(data):
    """
        Upload a component
    """
    session_id = request.args.get("id")
    is_saved = ComponentOperation.save_component_file(data["component_file"], session_id, data["library_name"])
    emit("upload-done", True, room=request.sid)
    if not is_saved:
        send_message_to_user("The file does not have the right structure", request.sid, "error")
    else:
        send_message_to_user("The component has been uploaded", request.sid, "success")
