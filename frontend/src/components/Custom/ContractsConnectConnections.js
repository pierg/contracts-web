import contractsconnect from "../../_texts/custom/contractsconnect";
import Button from "../Elements/Button";
import React from "react";
import {Tree} from "@blueprintjs/core";

function ContractsConnectConnections(props) {

    const lineClicked = (index) => {
        props.setConnectionsOpen(index)
    }

    let connections = []
    let lineClass="text-lg p-3 rounded hover:bg-blueGray-200 text-blueGray-700 hover:text-blueGray-900 cursor-pointer"
    let subtree
    for(let i=0;i<props.connections.length;i++) {
        if (i===0) {
            lineClass+=" border-t-1"
        }

        subtree = []
        let arrayConnector
        for(let j=0; j<props.connections[i].connectors[0].length; j++) { //input
            arrayConnector = props.connections[i].connectors[0][j].split(" ")
            subtree.push({
                "id" : i+"-0-"+j,
                "label" : "M_"+arrayConnector[0].split("-")[0]+"."+arrayConnector[1]+" "+arrayConnector[2]
            })
        }
        for(let j=0; j<props.connections[i].connectors[1].length; j++) { //input
            arrayConnector = props.connections[i].connectors[1][j].split(" ")
            subtree.push({
                "id" : i+"-1-"+j,
                "label" : "M_"+arrayConnector[0].split("-")[0]+"."+arrayConnector[1]+" "+arrayConnector[2]
            })
        }

        connections.push(
            <li
                key={i}
                className="border-b-1"
            >
                <div
                    className="flex flex-col justify-between"
                >
                    <div
                        className={lineClass}
                        onClick={() => lineClicked(i)}
                    >
                        {props.connections[i].name}
                    </div>
                    {
                        props.connectionsOpen[i] &&
                        <Tree
                            contents={subtree}
                            className="bp4-text-small"
                        />
                    }
                </div>
            </li>
        )
    }

    return (
        <>
            <div className="flex p-3">
                <span className={contractsconnect.connections.connectionsStyle}>
                        {contractsconnect.connections.connectionsTitle}
                </span>

                <Button
                    size={contractsconnect.addButton.size}
                    color={contractsconnect.addButton.color}
                    onClick={() => props.addConnections()}
                >
                    <i className={contractsconnect.addButton.icon}></i>
                </Button>
            </div>

            <ul>
                {connections}
            </ul>
        </>)

}

export default ContractsConnectConnections