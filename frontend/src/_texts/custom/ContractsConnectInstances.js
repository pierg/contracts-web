import contractsconnect from "./contractsconnect";
import Button from "../../components/Elements/Button";
import React from "react";
import {Classes, Tree} from "@blueprintjs/core";

function ContractsConnectInstances(props) {
const [tree] = []

    
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

    const changeIsOpen = ({e}) => {
        e.isExpanded = !e.isExpanded
        console.log(e)
    }

export default ContractsConnectInstances