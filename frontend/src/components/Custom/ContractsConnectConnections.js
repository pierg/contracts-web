import contractsconnect from "../../_texts/custom/contractsconnect";
import Button from "../Elements/Button";
import React from "react";
import {Tree} from "@blueprintjs/core";

function ContractsConnectConnections(props) {

    const changeIsOpen = ({e}) => {
        let arraySplit = e.id.split("-")
        if(arraySplit.length === 2) {
            props.setConnectionsOpen(arraySplit[0],parseInt(arraySplit[1])+1)
        }
    }

    const lineClicked = (index) => {
        props.setConnectionsOpen(index,0)
    }

    let connections = []
    let lineClass="flex flex-row relative text-lg p-3 rounded hover:bg-blueGray-200 text-blueGray-700 hover:text-blueGray-900 cursor-pointer"
    let subtree
    let node
    for(let i=0;i<props.connections.length;i++) {
        if (i===0) {
            lineClass+=" border-t-1"
        }

        subtree = []
        node = {}
        node.id = i+"-0"
        node.label = "INPUTS"
        node.isExpanded = props.connectionsOpen[i][1]
        node.childNodes = []
        let childNode
        let arrayConnector
        for(let j=0; j<props.connections[i].connectors[0].length; j++) { //input
            childNode = {}
            childNode.id = node.id+"-"+j
            arrayConnector = props.connections[i].connectors[0][j].split(" ")
            childNode.label = props.instances[arrayConnector[0].split("-")[0]].name.split(" ")[0]+"."+arrayConnector[1]+" "+arrayConnector[2]
            node.childNodes[j] = childNode
        }
        subtree.push(node)

        node = {}
        node.id = i+"-1"
        node.label = "OUTPUTS"
        node.isExpanded = props.connectionsOpen[i][2]
        node.childNodes = []
        for(let j=0; j<props.connections[i].connectors[1].length; j++) { //input
            childNode = {}
            childNode.id = node.id+"-"+j
            arrayConnector = props.connections[i].connectors[1][j].split(" ")
            childNode.label = props.instances[arrayConnector[0].split("-")[0]].name.split(" ")[0]+"."+arrayConnector[1]+" "+arrayConnector[2]
            node.childNodes[j] = childNode
        }
        subtree.push(node)

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
                        <div
                            className="mr-2"
                        >
                            {props.connections[i].name}
                        </div>
                        <div
                            className="absolute right-0 mr-2"
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
                        </div>
                    </div>
                    {
                        props.connectionsOpen[i][0] &&
                        <Tree
                            contents={subtree}
                            className="bp4-text-small"
                            onNodeClick={e => changeIsOpen({e})}
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
                <Button
                    size={contractsconnect.downloadButton.size}
                    color={contractsconnect.downloadButton.color}
                >
                    <i className={contractsconnect.downloadButton.icon}/>
                </Button>
            </div>

            <ul>
                {connections}
            </ul>
        </>)

}

export default ContractsConnectConnections