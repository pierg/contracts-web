import { useSocket } from "../../../contexts/SocketProvider";
import { useCallback, useEffect } from "react";

function SocketConnection(props) {
  const socket = useSocket();

  const initNames = useCallback(() => {
    let splitNameInstance =
      props.instances[props.connectors[0].split("-")[0]].name.split(" ");
    let instancesNames = {};
    instancesNames[splitNameInstance[0]] = splitNameInstance[1].substring(
      1,
      splitNameInstance[1].length - 1
    );
    for (let i = 1; i < props.connectors.length; i++) {
      splitNameInstance =
        props.instances[props.connectors[i].split("-")[0]].name.split(" ");
      if (!(splitNameInstance[0] in instancesNames)) {
        instancesNames[splitNameInstance[0]] = splitNameInstance[1].substring(
          1,
          splitNameInstance[1].length - 1
        );
      }
    }
    return instancesNames;
  }, [props]);

  const getConnection = useCallback(
    (connections) => {
      socket.off("receive-possible-connection");
      if (connections) {
        if (connections.length !== 0) {
          props.connectionFound(connections);
        }
      }
    },
    [props, socket]
  );

  const connectionAdded = useCallback(
    (done) => {
      socket.off("save-connection-done");
      if (done) {
        props.addConnectionDisplay();
      }
    },
    [props, socket]
  );

  const connectionDeleted = useCallback(
    (done) => {
      socket.off("delete-connection-done");
      if (done) {
        console.log("connection delete");
      }
    },
    [socket]
  );

  useEffect(() => {
    if (socket == null) return;

    if (props.triggerGetConnection) {
      props.setTriggerGetConnection(false);
      let componentNames = [];
      componentNames.push(props.selectedComponents[0].name);
      for (let i = 1; i < props.selectedComponents.length; i++) {
        if (!componentNames.includes(props.selectedComponents[i].name)) {
          componentNames.push(props.selectedComponents[i].name);
        }
      }
      socket.emit("get-possible-connection", {
        library_name: props.library.name,
        components: componentNames,
        default: props.library.default,
      });
      socket.on("receive-possible-connection", getConnection);
    }

    if (props.triggerAddConnection) {
      props.setTriggerAddConnectionSocket(false);
      let instancesNames = initNames();
      socket.emit("save-connection", {
        name: props.name,
        library_name: props.library.name,
        instances: instancesNames,
        connections: props.connectors,
      });
      socket.on("save-connection-done", connectionAdded);
    }

    if (props.triggerDeleteConnection) {
      props.setTriggerDeleteConnection(false);
      socket.emit("delete-connection", {
        name: props.connectionToDelete.name,
        library_name: props.library.name,
      });
      socket.on("delete-connection-done", connectionDeleted);
    }
  }, [socket, props, getConnection, connectionAdded, initNames, connectionDeleted]);
}

export default SocketConnection;
