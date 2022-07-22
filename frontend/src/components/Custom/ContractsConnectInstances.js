import contractsconnect from "../../_texts/custom/contractsconnect";
import Button from "../Elements/Button";
import React, {useState} from "react";
import {Tree} from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';
import {Modal} from "reactstrap";
import ComponentsToInstances from "./ComponentsToInstances";
import {Tooltip} from "react-tippy";

function ContractsConnectInstances(props) {
    const [triggerAddInstance, setTriggerAddInstance] = useState(false);

    const changeIsOpen = ({e}) => {
        let arraySplit = e.id.split("-")
        if(arraySplit.length === 2) {
            props.setInstancesOpen(arraySplit[0],arraySplit[1])
        }
        else{
            props.addConnectors(e.id+" "+e.label)
        }
    }

    const lineClicked = (index) => {
        props.setInstancesOpen(index,0)
    }

    let instances = []
    let lineClass="flex flex-row relative text-lg p-3 rounded hover:bg-blueGray-200 text-blueGray-700 hover:text-blueGray-900 cursor-pointer"
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
            childNode.label = props.instances[i].inputs[j].name + " (" + props.instances[i].inputs[j].type + ")"
            if(props.connectors.includes(childNode.id+" "+childNode.label)) {
                childNode.className = "bg-blueGray-500 text-white"
            }
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
            childNode.label = props.instances[i].outputs[j].name + " (" + props.instances[i].outputs[j].type + ")"
            if(props.connectors.includes(childNode.id+" "+childNode.label)) {
                childNode.className = "bg-blueGray-500 text-white"
            }
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
                        <div
                            className="mr-2"
                        >
                            {props.instances[i].name}
                        </div>
                        {
                            !props.selectedLibrary.default &&
                            <div
                                className="absolute right-0 mr-2"
                            >
                                <Tooltip
                                    title="Delete instance"
                                    position="right"
                                    arrow="true"
                                >
                                    <Button
                                        size={contractsconnect.deleteButton.size}
                                        color={contractsconnect.deleteButton.color}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            props.deleteInstance(i)
                                        }}
                                    >
                                        <i className={contractsconnect.deleteButton.icon}/>
                                    </Button>
                                </Tooltip>
                            </div>
                        }
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
                    <Tooltip
                        html={(
                            <div className="flex flex-col text-left">
                                {contractsconnect.instances.messages.map((prop, key) => (
                                    <div className="mb-2" key={key}>
                                        <h4 className="font-bold">{prop.title}</h4>
                                        <div>{prop.content}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        position="right"
                        arrow="true"
                        className="ml-1"
                    >
                        <i className="ml-1 text-lightBlue-700 text-2xl fas fa-info-circle"/>
                    </Tooltip>
                </span>

                <Tooltip
                    title="Add instance(s)"
                    position="right"
                    arrow="true"
                >
                    <Button
                        size={contractsconnect.addButton.size}
                        color={contractsconnect.addButton.color}
                        onClick={() => setTriggerAddInstance(true)}
                    >
                        <i className={contractsconnect.addButton.icon}></i>
                    </Button>
                </Tooltip>

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

                {
                    !props.selectedLibrary.default &&
                    <Tooltip
                        title="Clear all instances"
                        position="right"
                        arrow="true"
                    >
                        <Button
                            size={contractsconnect.clearButton.size}
                            color={contractsconnect.clearButton.color}
                            onClick={props.clearInstances}
                        >
                            <i className={contractsconnect.clearButton.icon}></i>
                        </Button>
                    </Tooltip>
                }
            </div>

            <ul>
                {instances}
            </ul>
        </>
    )
}

export default ContractsConnectInstances