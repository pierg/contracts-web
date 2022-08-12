import contractsconnect from "../../_texts/custom/contractsconnect";
import Button from "../Elements/Button";
import React from "react";
import {Tree} from "@blueprintjs/core";
import {Tooltip} from "react-tippy";
import UploadButton from "./UploadButton";


function ContractsConnectConnections(props) {
    const downloadConnections = () => {
        let connectionsName = [];
        for (let i = 0; i < props.connections.length; i++) {
            connectionsName[i] = props.connections[i].name;
        }
        props.downloadConnections(connectionsName)
    };

    const downloadConnection = (index) => {
        props.downloadConnections([props.connections[index].name])
    }

    let connections = [];
    let lineClass =
        "flex flex-row relative text-lg pt-2 px-3 rounded hover:bg-blueGray-200 text-blueGray-700 hover:text-blueGray-900";
    let subtree;
    let node;
    for (let i = 0; i < props.connections.length; i++) {
        if (i === 0) {
            lineClass += " border-t-1";
        }

        subtree = [];
        let arrayConnector;
        for (let j = 0; j < props.connections[i].connectors.length; j++) {
            node = {};
            node.id = i + "-" + j;
            arrayConnector = props.connections[i].connectors[j].split(" ");
            node.label =
                props.instances[arrayConnector[0].split("-")[0]].name.split(" ")[0] +
                "." +
                arrayConnector[1] +
                " " +
                arrayConnector[2];
            subtree.push(node);
        }

        connections.push(
            <li key={i} className="pb-3">
                <div className="flex flex-col justify-between">
                    <div className={lineClass}>
                        <div className="mr-2 pt-1">{props.connections[i].name}</div>
                            <div className="absolute right-0 mr-2">
                                {!props.selectedLibrary.default && (
                                <Tooltip title="Delete connection" position="right" arrow="true">
                                    <Button
                                        size={contractsconnect.deleteButton.size}
                                        color={contractsconnect.deleteButton.color}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            props.deleteConnection(i);
                                        }}
                                    >
                                        <i className={contractsconnect.deleteButton.icon}/>
                                    </Button>
                                </Tooltip>)}
                                 <Tooltip title="Download the connection" position="right" arrow="true">
                                    <Button
                                        size={contractsconnect.downloadButton.size}
                                        color={contractsconnect.downloadButton.color}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            downloadConnection(i);
                                        }}
                                    >
                                        <i className={contractsconnect.downloadButton.icon}/>
                                    </Button>
                                </Tooltip>
                            </div>

                    </div>
                    <Tree contents={subtree} className="bp4-text-small"/>
                </div>
            </li>
        );
    }

    return (
        <>
            <div className="flex p-3 justify-between">
        <span className={contractsconnect.connections.connectionsStyle}>
          {contractsconnect.connections.connectionsTitle}
        </span>
                <div>
                    <div className="mx-1 py-1">
                        <Tooltip title="Upload a connection" position="right" arrow="true">
                            <UploadButton
                                upload={props.uploadConnection}
                            />
                        </Tooltip>
                        <Tooltip title="Download connections" position="right" arrow="true">
                            <Button
                                size={contractsconnect.downloadButton.size}
                                color={contractsconnect.downloadButton.color}
                                onClick={() => downloadConnections()}
                            >
                                <i className={contractsconnect.downloadButton.icon}/>
                            </Button>
                        </Tooltip>
                    </div>

                    {!props.selectedLibrary.default && (
                        <div className="mx-1 py-1">
                            <Tooltip title="Clear all connections" position="right" arrow="true">
                                <Button
                                    size={contractsconnect.clearButton.size}
                                    color={contractsconnect.clearButton.color}
                                    onClick={props.clearConnections}
                                >
                                    <i className={contractsconnect.clearButton.icon}></i>
                                </Button>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>

            <ul>{connections}</ul>
        </>
    );
}

export default ContractsConnectConnections;
