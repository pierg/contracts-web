import { useSocket } from "../../../contexts/SocketProvider";
import { useCallback, useEffect } from "react";
import { saveAs } from "file-saver";

function SocketDownloadConnection(props) {
  const socket = useSocket();

  const componentFile = useCallback(
    (connections) => {
      socket.off("connections-downloaded");
      if (connections === null) return;
      if (connections === []) return;
      for (let i = 0; i < connections.length; i++) {
        const blob = new Blob([connections[i]["file"]], {
          type: "text/plain;charset=utf-8",
        });
        saveAs(blob, connections[i]["name"] + ".txt");
      }
    },
    [socket]
  );

  useEffect(() => {
    if (socket == null) return;

    if (props.triggerDownload) {
      props.setTriggerDownload(false);
      socket.emit("download-connections", {
        names: props.connectionsToDownload,
        library_name: props.library.name,
        is_default: props.isDefault,
      });
      socket.on("connections-downloaded", componentFile);
    }
  }, [props, socket, componentFile]);

  return <></>;
}

export default SocketDownloadConnection;
