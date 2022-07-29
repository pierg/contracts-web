import React, { useEffect, useCallback } from "react";
import { useSocket } from "../../../contexts/SocketProvider";

function SocketIoComponents(props) {
  const socket = useSocket();

  const setComponents = useCallback(
    (componentsList) => {
      props.updateComponents(componentsList);
      return () => socket.off("receive-components");
    },
    [socket, props]
  );

  const componentIsDeleted = useCallback(() => {
    socket.emit("get-components");
    socket.on("receive-components", setComponents);
    socket.off("component-deleted");
  }, [socket, setComponents]);

  useEffect(() => {
    if (socket == null) return;

    if (props.triggerComponents) {
      props.setTriggerComponents(false);
      socket.emit("get-components");
      socket.on("receive-components", setComponents);
    }
  }, [props, setComponents, socket]);

  useEffect(() => {
    if (socket == null) return;

    if (props.triggerDelete) {
      props.setTriggerDelete(false);
      socket.emit("delete-component", props.componentToDelete.name);
      socket.on("component-deleted", componentIsDeleted);
    }
  }, [props, componentIsDeleted, socket]);

  return <></>;
}

export default SocketIoComponents;
