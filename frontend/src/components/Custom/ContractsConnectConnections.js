import contractsconnect from "../../_texts/custom/contractsconnect";
import Button from "../Elements/Button";
import React from "react";
import {Tree} from "@blueprintjs/core";
import {Tooltip} from "react-tippy";
import {saveAs} from 'file-saver';

function ContractsConnectConnections(props) {

    const downloadConnections = () => {
        if (props.connections.length === 0) return

        let instances = []
        for (let i = 0; i < props.instances.length; i++) {
            instances[i] = {}
            instances[i].name = props.instances[i].name
            instances[i].inputs = props.instances[i].inputs
            instances[i].outputs = props.instances[i].outputs
        }

        let connections = []
        for (let i = 0; i < props.connections.length; i++) {
            connections[i] = {}
            connections[i].name = props.connections[i].name
            let ports = []
            let arrayConnector
            let instanceName
            let name
            let type
            for(let j=0 ; j<props.connections[i].connectors.length ; j++) {
                arrayConnector = props.connections[i].connectors[j].split(" ")
                instanceName = props.instances[arrayConnector[0].split("-")[0]].name.split(" ")[0]
                name = props.connections[i].connectors[j].split(" ")[1]
                type = props.connections[i].connectors[j].split(" ")[2]
                ports.push(instanceName+"."+name+" "+type)
            }
            connections[i].connectors = ports
        }
        const json = JSON.stringify({"instances":instances,"connections":connections}, null, '\t')
        const blob = new Blob([json], {type: "text/json;charset=utf-8"})
        const file = new File([blob], "connections.json")
        saveAs(file)
    }

    let connections = []
    let lineClass="flex flex-row relative text-lg pt-3 px-3 rounded hover:bg-blueGray-200 text-blueGray-700 hover:text-blueGray-900"
    let subtree
    let node
    for(let i=0;i<props.connections.length;i++) {
        if (i===0) {
            lineClass+=" border-t-1"
        }

        subtree = []
        let arrayConnector
        for(let j=0; j<props.connections[i].connectors.length; j++) {
            node = {}
            node.id = i+"-"+j
            arrayConnector = props.connections[i].connectors[j].split(" ")
            node.label = props.instances[arrayConnector[0].split("-")[0]].name.split(" ")[0]+"."+arrayConnector[1]+" "+arrayConnector[2]
            subtree.push(node)
        }

        connections.push(
            <li
                key={i}
                className="pb-3"
            >
                <div
                    className="flex flex-col justify-between"
                >
                    <div
                        className={lineClass}
                    >
                        <div
                            className="mr-2"
                        >
                            {props.connections[i].name}
                        </div>
                        <div
                            className="absolute right-0 mr-2"
                        >
                            <Tooltip
                                title="Delete connection"
                                position="right"
                                arrow="true"
                            >
                                <Button
                                    size={contractsconnect.deleteButton.size}
                                    color={contractsconnect.deleteButton.color}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        props.deleteConnection(i)
                                    }}
                                >
                                    <i className={contractsconnect.deleteButton.icon}/>
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    <Tree
                        contents={subtree}
                        className="bp4-text-small"
                    />
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

                <Tooltip
                    title="Add connection"
                    position="right"
                    arrow="true"
                >
                    <Button
                        size={contractsconnect.addButton.size}
                        color={contractsconnect.addButton.color}
                        onClick={() => props.addConnections()}
                    >
                        <i className={contractsconnect.addButton.icon}></i>
                    </Button>
                </Tooltip>

                <Tooltip
                    title="Download connections"
                    position="right"
                    arrow="true"
                >
                    <Button
                        size={contractsconnect.downloadButton.size}
                        color={contractsconnect.downloadButton.color}
                        onClick={() => downloadConnections()}
                    >
                        <i className={contractsconnect.downloadButton.icon}/>
                    </Button>
                </Tooltip>
            </div>

            <ul>
                {connections}
            </ul>
        </>)

}

export default ContractsConnectConnections