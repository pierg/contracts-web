import { useSocket } from "../../../contexts/SocketProvider";
import { useCallback, useEffect } from "react";

function SocketLibrary(props) {
  const socket = useSocket();

  const getLibrary = useCallback(
    (libraries) => {
      if (libraries) {
        props.setLibraries(libraries);
      }
      return () => socket.off("receive-library");
    },
    [props, socket]
  );

  const libraryAdded = useCallback(
    (done) => {
      if (done) {
        props.setTriggerLibrary(true);
      }
      return () => socket.off("add-to-library-done");
    },
    [props, socket]
  );

  const libraryDeleted = useCallback(
    (done) => {
      if (done) {
        props.setTriggerLibrary(true);
      }
      return () => socket.off("remove-library-done");
    },
    [props, socket]
  );

  useEffect(() => {
    if (socket == null) return;

    if (props.triggerLibrary) {
      props.setTriggerLibrary(false);
      socket.emit("get-library");
      socket.on("receive-library", getLibrary);
    }

    if (props.triggerAddLibrary) {
      props.setTriggerAddLibrary(false);
      socket.emit("add-components-to-library", {
        name: props.libraryName,
        components: props.componentsNames,
      });
      socket.on("add-to-library-done", libraryAdded);
    }

    if (props.triggerDelete) {
      props.setTriggerDelete(false);
      socket.emit("remove-library", props.libraryToDelete);
      socket.on("remove-library-done", libraryDeleted);
    }
  }, [socket, props, getLibrary, libraryAdded, libraryDeleted]);
}

export default SocketLibrary;
