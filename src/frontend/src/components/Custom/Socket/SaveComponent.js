import React, { useEffect, useCallback } from "react";
import { useSocket } from "../../../contexts/SocketProvider";

function SocketSaveComponent(props) {
  const socket = useSocket();

  const componentIsSaved = useCallback(() => {
    props.componentIsSaved();
    socket.off("component-saved");
    props.triggerGetLibrary(true);
  }, [socket, props]);

  useEffect(() => {
    if (socket == null) return;

    if (props.component !== null && props.triggerSave) {
      props.setTriggerSave(false);
      socket.emit("save-component", {
        new_component: props.component,
        old_name: props.componentOldName,
        library_name: props.library.name,
      });
      socket.on("component-saved", componentIsSaved);
    }
  }, [props, socket, componentIsSaved]);

  return <></>;
}

export default SocketSaveComponent;
