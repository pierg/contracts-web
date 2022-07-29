import React, { useEffect } from "react";
import { useSocket } from "../../../contexts/SocketProvider";

function SocketIoMessage(props) {
  const socket = useSocket();

  useEffect(() => {
    if (socket == null) return;

    if (props.triggerMessage) {
      props.setTriggerMessage(false);
      socket.emit("display-message", {
        type: props.type,
        messageNotif: props.messageNotif,
        messageSideBar: props.messageSideBar,
      });
    }
  }, [props, socket]);

  return <></>;
}

export default SocketIoMessage;
