import contractsconnect from "../../_texts/custom/contractsconnect";
import Button from "../Elements/Button";
import React, {useState} from "react";
import {Tree} from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import {Modal} from "reactstrap";
import ComponentsToInstances from "./ComponentsToInstances";

function ContractsConnectInstances(props) {
    const [triggerAddInstance, setTriggerAddInstance] = useState(false);

    const changeIsOpen = ({e}) => {
        let arraySplit = e.id.split("-")
        if(arraySplit.length === 2) {
            props.setInstancesOpen(arraySplit[0],arraySplit[1])
        }
        else{
            console.log(e)
            props.addConnectors(e.id)
        }
    }

    const lineClicked = (index) => {
        props.setInstancesOpen(index,0)
    }

    let instances = []
    let lineClass="text-lg p-3 rounded hover:bg-blueGray-200 text-blueGray-700 hover:text-blueGray-900 cursor-pointer"
    let subtree
    let node
    for(let i=0;i<props.instances.length;i++) {
        if (i===0) {
            lineClass+=" border-t-1"
        }
        subtree = []
        node = {}
        node.id = i+"-1"
        node.label = "INPUTS"
        node.isExpanded = props.instancesOpen[i][1]
        node.childNodes = []
        let childNode
        for(let j=0;j<props.instances[i].inputs.length;j++) {
            childNode = {}
            childNode.id = node.id+"-"+j
            if(props.connectors.includes(childNode.id)) {
                childNode.className = "bg-blueGray-500 text-white"
            }
            childNode.label = props.instances[i].inputs[j].name + " (" + props.instances[i].inputs[j].type + ")"
            node.childNodes[j] = childNode
        }
        subtree.push(node)

        node = {}
        node.id = i+"-2"
        node.label = "OUTPUTS"
        node.isExpanded = props.instancesOpen[i][2]
        node.childNodes = []
        for(let j=0;j<props.instances[i].outputs.length;j++) {
            childNode = {}
            childNode.id = node.id+"-"+j
            if(props.connectors.includes(childNode.id)) {
                childNode.className = "bg-blueGray-500 text-white"
            }
            childNode.label = props.instances[i].outputs[j].name + " (" + props.instances[i].outputs[j].type + ")"
            node.childNodes[j] = childNode
        }
        subtree.push(node)

        instances.push(
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
                        {props.instances[i].name}
                    </div>
                    {
                        props.instancesOpen[i][0] &&
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
                <span className={contractsconnect.instances.instanceStyle}>
                        {contractsconnect.instances.instancesTitle}
                </span>

                <Button
                    size={contractsconnect.addButton.size}
                    color={contractsconnect.addButton.color}
                    onClick={() => setTriggerAddInstance(true)}
                >
                    <i className={contractsconnect.addButton.icon}></i>
                </Button>
                <Modal
                    isOpen={triggerAddInstance}
                    autoFocus={false}
                    toggle={() => setTriggerAddInstance(false)}
                    className={"modal-dialog-centered"}
                >
                    <ComponentsToInstances
                        selectedComponents={props.selectedComponents}
                        add={(component) => props.addInstances(component)}
                        close={() => setTriggerAddInstance(false)}
                    />
                </Modal>
            </div>

            <ul>
                {instances}
            </ul>
        </>
    )
}

export default ContractsConnectInstances