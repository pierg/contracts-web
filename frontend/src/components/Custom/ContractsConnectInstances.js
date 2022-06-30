import contractsconnect from "../../_texts/custom/contractsconnect";
import Button from "../Elements/Button";
import React from "react";
import {Classes, Tree} from "@blueprintjs/core";
import '@blueprintjs/core/lib/css/blueprint.css';

function ContractsConnectInstances(props) {

    const changeIsOpen = ({e}) => {
        console.log(e)
        if(e.icon) {
            let arraySplit = e.id.split("-")
            props.setInstancesOpen(arraySplit[0],arraySplit[1])
        }
    }

    let instances = []
    let subtree
    let node
    for(let i=0;i<props.instances.length;i++) {
        subtree = []
        node = {}
        node.id = i+"-0"
        node.label = "inputs"
        node.icon = "folder-close"
        node.isExpanded = props.instancesOpen[i][0]
        node.childNodes = []
        let childNode
        for(let j=0;j<props.instances[i].inputs.length;j++) {
            childNode = {}
            childNode.id = node.id+"-"+j
            childNode.label = props.instances[i].inputs[j].name + " (" + props.instances[i].inputs[j].type + ")"
            node.childNodes[j] = childNode
        }
        subtree.push(node)

        node = {}
        node.id = i+"-1"
        node.label = "outputs"
        node.icon = "folder-close"
        node.isExpanded = props.instancesOpen[i][1]
        node.childNodes = []
        for(let j=0;j<props.instances[i].outputs.length;j++) {
            childNode = {}
            childNode.id = node.id+"-"+j
            childNode.label = props.instances[i].outputs[j].name + " (" + props.instances[i].outputs[j].type + ")"
            node.childNodes[j] = childNode
        }
        subtree.push(node)

        node = {}
        node.id = i+"-2"
        node.label = "assumptions"
        node.icon = "folder-close"
        node.isExpanded = props.instancesOpen[i][2]
        node.childNodes = []
        for (let assump in props.instances[i].assumptions) {
            childNode = {}
            childNode.id = node.id+"-"+node.childNodes.length
            childNode.label = assump
            childNode.icon = "folder-close"
            childNode.isExpanded = true
            childNode.childNodes = []
            let childChildNode
            for(let j=0 ; j<props.instances[i].assumptions[assump].length ; j++) {
                childChildNode = {}
                childChildNode.id = childNode.id+"-"+j
                childChildNode.label = props.instances[i].assumptions[assump][j]
                childNode.childNodes.push(childChildNode)
            }
            node.childNodes.push(childNode)
        }
        subtree.push(node)

        node = {}
        node.id = i+"-3"
        node.label = "guarantees"
        node.icon = "folder-close"
        node.isExpanded = props.instancesOpen[i][3]
        node.childNodes = []
        subtree.push(node)

        instances.push(
            <div
                key={i}
                className="flex p-3"
            >
                <div>
                    {props.instances[i].title}
                </div>
                <Tree
                    contents={subtree}
                    className={Classes.TEXT_SMALL}
                    onNodeClick={e => changeIsOpen({e})}
                />
            </div>
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
                >
                    <i className={contractsconnect.addButton.icon}></i>
                </Button>
            </div>

            {instances}
        </>
    )
}

export default ContractsConnectInstances