import React from "react";
import ContractsConnectConnections from "./ContractsConnectConnections";
import ContractsConnectInstances from "./ContractsConnectInstances";

function ContractsConnect(props) {
    return (
        <div className="flex flex-row justify-content-around">
            <div className="px-3 pb-3 relative flex flex-col break-words bg-white rounded shadow-md">
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

            <div className="px-3 pb-3 relative flex flex-col break-words bg-white rounded shadow-md">
                <ContractsConnectConnections
                    connections={props.connections}
                    addConnections={props.addConnections}
                    connectionsOpen={props.connectionsOpen}
                    setConnectionsOpen={props.setConnectionsOpen}
                />
            </div>
        </div>
    )
}

export default ContractsConnect;