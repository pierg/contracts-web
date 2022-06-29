import contractsconnect from "../../_texts/custom/contractsconnect";
import Button from "../Elements/Button";
import React from "react";
import {Classes, Tree} from "@blueprintjs/core";

function ContractsConnectInstances(components) {
    const [tree] = []

    const setTree = (tree) => {
        let treeTmp = []
        let keys = Object.keys(tree).sort()
        let node
        let nbExampleCreation = 0
        for (let i = 0; i < keys.length; i++) {
            node = {}
            node.id = i
            node.label = keys[i]
            node.icon = "folder-close"
            node.isExpanded = false
            node.childNodes = []

            let childNode
            for (let j = 0; j < tree[keys[i]].length; j++) {
                childNode = {}
                childNode.id = i + "_" + j
                childNode.label = tree[keys[i]][j].id
                if (keys[i] === "Your creation") {
                    nbExampleCreation++
                }
                childNode.assumptions = tree[keys[i]][j].assumptions
                childNode.guarantees = tree[keys[i]][j].guarantees
                childNode.inputs = tree[keys[i]][j].inputs
                childNode.outputs = tree[keys[i]][j].outputs
                node.childNodes[j] = childNode
            }

            treeTmp[i] = node
        }

        this.setState({
            tree: treeTmp,
            nbFolders: keys.length,
            nbExampleCreation: nbExampleCreation,
            creationExpanded: false,
        })
    }


    return (<>
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

                <Tree
                    contents={tree}
                    className={Classes.TEXT_SMALL}
                    onNodeClick={e => changeIsOpen({e: e})}
                />
            </div>
        </>

    )
}

// const changeIsOpen = ({e}) => {
//     e.isExpanded = !e.isExpanded
//     let creationExpanded = this.state.creationExpanded
//     let sizeFolder = this.state.nbFolders
//     if(e.id.length !== undefined) {
//         this.setState({
//             nameValue : e.label,
//             assumptionsValue : e.assumptions.join("\n"),
//             guaranteesValue : e.guarantees.join("\n"),
//             inputsValue : e.inputs.join(", "),
//             outputsValue : e.outputs.join(", "),
//         })
//     }
//     else {
//         if(e.label !== "Your creation") {
//             if(!e.isExpanded) {
//                 sizeFolder -= e.childNodes.length
//             }
//             else {
//                 sizeFolder += e.childNodes.length
//             }
//         }
//         else {
//             creationExpanded = e.isExpanded
//         }
//     }
//     this.setState({
//         clickedButtonStrix : false,
//         clickedButtonParallel : false,
//         triggerSynthesis : false,
//         graph: null,
//         simulation: false,
//         nbFolders: sizeFolder,
//         creationExpanded: creationExpanded,
//     })
// }


// setTree = (tree) => {
//         let treeTmp = []
//         let keys = Object.keys(tree).sort()
//         let node
//         let nbExampleCreation = 0
//         for(let i=0;i<keys.length;i++) {
//             node = {}
//             node.id = i
//             node.label = keys[i]
//             node.icon = "folder-close"
//             node.isExpanded = false
//             node.childNodes = []
//
//             let childNode
//             for(let j=0;j<tree[keys[i]].length;j++) {
//                 childNode = {}
//                 childNode.id = i+"_"+j
//                 childNode.label = tree[keys[i]][j].id
//                 if(keys[i] === "Your creation") {
//                     nbExampleCreation++
//                 }
//                 childNode.assumptions = tree[keys[i]][j].assumptions
//                 childNode.guarantees = tree[keys[i]][j].guarantees
//                 childNode.inputs = tree[keys[i]][j].inputs
//                 childNode.outputs = tree[keys[i]][j].outputs
//                 node.childNodes[j] = childNode
//             }
//
//             treeTmp[i] = node
//         }
//
//         this.setState({
//             tree : treeTmp,
//             nbFolders : keys.length,
//             nbExampleCreation : nbExampleCreation,
//             creationExpanded: false,
//         })
//     }


const changeIsOpen = ({e}) => {
    e.isExpanded = !e.isExpanded
    console.log(e)
}

export default ContractsConnectInstances