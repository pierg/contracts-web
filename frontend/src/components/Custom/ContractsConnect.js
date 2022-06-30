import React from "react";
import ContractsConnectConnections from "./ContractsConnectConnections";
import ContractsConnectInstances from "./ContractsConnectInstances";

function ContractsConnect(props) {
    return (
        <div className="flex">
            <div className="px-3 pb-3 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">
                <ContractsConnectInstances
                    selectedComponents={props.selectedComponents}
                    instances={props.instances}
                    addInstances={props.addInstances}
                    instancesOpen={props.instancesOpen}
                    setInstancesOpen={props.setInstancesOpen}
                    connectors={props.connectors}
                    addConnectors={props.addConnectors}
                />
            </div>

            <div className="px-3 pb-3 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">
                <ContractsConnectConnections
                    connections={props.connections}
                    addConnections={props.addConnections}
                />
            </div>
        </div>
    )
}

export default ContractsConnect;