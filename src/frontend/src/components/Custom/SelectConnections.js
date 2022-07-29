import React, { useState } from "react";
import { Button, ModalBody, ModalFooter } from "reactstrap";

function SelectConnections(props) {
  let [connections, setConnections] = useState([]);

  const close = () => {
    setConnections([]);
    props.close();
  };

  const addConnection = (connection) => {
    let connectionsTmp = [...connections];
    if (connectionsTmp.includes(connection)) {
      connectionsTmp = connectionsTmp.filter((e) => e !== connection);
    } else {
      connectionsTmp.push(connection);
    }
    setConnections(connectionsTmp);
  };

  const addConnections = () => {
    for (let i = 0; i < connections.length; i++) {
      props.add(connections[i].name, connections[i].connections);
    }
    close();
  };

  let connectionsClass = [];
  let lineClass;
  for (let i = 0; i < props.connectionsFound.length; i++) {
    lineClass =
      "border-b-1 p-2 rounded hover:bg-blueGray-200 text-blueGray-700 hover:text-blueGray-900 cursor-pointer";
    if (i === 0) {
      lineClass += " border-t-1";
    }
    if (connections.includes(props.connectionsFound[i])) {
      lineClass += " bg-blueGray-100 font-bold";
    }
    connectionsClass.push(lineClass);
  }

  return (
    <>
      <div className="modal-header justify-content-center">
        <button aria-hidden={true} className="close" type="button" onClick={close}>
          <i className="now-ui-icons ui-1_simple-remove" />
        </button>
        <h4 className="fs-5 font-bold title-up">Add connections</h4>
      </div>
      <ModalBody>
        <div className="fs-6 mb-2">Select one or more connections</div>
        <div className="overflow-auto max-h-400-px mx-4 mb-4">
          <ul>
            {connectionsClass.map((prop, key) => {
              return (
                <li
                  key={key}
                  className={prop}
                  onClick={() => addConnection(props.connectionsFound[key])}
                >
                  <div className="flex justify-between">
                    <div>{props.connectionsFound[key].name}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex flex-col w-full">
          <div className="flex w-full justify-between">
            <Button color="danger" onClick={close}>
              Cancel
            </Button>
            <Button color="info" onClick={addConnections}>
              Add
            </Button>
          </div>
        </div>
      </ModalFooter>
    </>
  );
}

export default SelectConnections;
