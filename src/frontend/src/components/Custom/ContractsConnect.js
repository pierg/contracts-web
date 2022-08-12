import React from "react";
import ContractsConnectConnections from "./ContractsConnectConnections";
import ContractsConnectInstances from "./ContractsConnectInstances";
import { Tooltip } from "react-tippy";
import Button from "../Elements/Button";
import contractsconnect from "../../_texts/custom/contractsconnect";

function ContractsConnect(props) {
    return (
        <div className="flex relative flex-wrap justify-center justify-content-around w-75 m-auto">
            <div className="px-3 pb-3 w-35 relative flex flex-col min-w-instance break-words bg-white rounded shadow-md h-fit m-auto mb-5">
                <ContractsConnectInstances
                    selectedLibrary={props.selectedLibrary}
                    selectedComponents={props.selectedComponents}
                    instances={props.instances}
                    clearInstances={props.clearInstances}
                    addInstances={props.addInstances}
                    deleteInstance={props.deleteInstance}
                    instancesOpen={props.instancesOpen}
                    setInstancesOpen={props.setInstancesOpen}
                    connectors={props.connectors}
                    addConnectors={props.addConnectors}
                />
            </div>

            { !props.selectedLibrary.default &&
                <div className="m-auto mb-5">
                        <Tooltip title="Add connection" position="right" arrow="true">
                            <Button
                                size={contractsconnect.addConnectionButton.size}
                                color={contractsconnect.addConnectionButton.color}
                                onClick={() => props.checkAddConnections()}
                            >
                                <i className={contractsconnect.addConnectionButton.icon}></i>
                            </Button>
                        </Tooltip>
                </div>
            }

            <div className="px-3 pb-3 w-35 relative flex flex-col min-w-connection sm:min-w-connection break-words bg-white rounded shadow-md h-fit m-auto ">
                <ContractsConnectConnections
                    selectedLibrary={props.selectedLibrary}
                    instances={props.instances}
                    clearConnections={props.clearConnections}
                    connections={props.connections}
                    deleteConnection={props.deleteConnection}
                    uploadConnection={props.uploadConnection}
                />
            </div>
        </div>
    );
}

export default ContractsConnect;
