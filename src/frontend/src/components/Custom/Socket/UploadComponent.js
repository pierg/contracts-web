import { useSocket } from "../../../contexts/SocketProvider";
import { useCallback, useEffect } from "react";

function SocketUploadComponent(props) {
  const socket = useSocket();

  const fileUploaded = useCallback(
    (uploadDone) => {
      if (uploadDone) {
        props.componentIsUploaded();
      }
      return () => socket.off("upload-done");
    },
    [socket, props]
  );

  useEffect(() => {
    if (socket == null) return;

    if (props.triggerUpload) {
      props.setTriggerUpload(false);
      socket.emit("upload-component", {
        component_file: props.componentToUpload,
        library_name: props.library.name,
      });
      socket.on("upload-done", fileUploaded);
    }
  }, [props, socket, fileUploaded]);
}

export default SocketUploadComponent;
