import { useSocket } from "../../../contexts/SocketProvider";
import { useCallback, useEffect } from "react";

function SocketUploadConnection(props) {
  const socket = useSocket();

  const fileUploaded = useCallback(
    (uploadDone) => {
      if (uploadDone) {
        props.connectionIsUploaded(true);
      }
      return () => socket.off("upload-done-connection");
    },
    [socket, props]
  );

  useEffect(() => {
    if (socket == null) return;

    if (props.triggerUpload) {
      props.setTriggerUpload(false);
      socket.emit("upload-connection", {
        connection_file: props.connectionToUpload,
        library_name: props.library.name,
      });
      socket.on("upload-done-connection", fileUploaded);
    }
  }, [props, socket, fileUploaded]);
}

export default SocketUploadConnection;
