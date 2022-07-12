import React from "react";
import ContractsConnectConnections from "./ContractsConnectConnections";
import ContractsConnectInstances from "./ContractsConnectInstances";

function ContractsConnect(props) {
    return (
        <div className="flex flex-row justify-content-around w-75 m-auto">
            <div className="px-3 pb-3 relative flex flex-col break-words bg-white rounded shadow-md h-fit">
                <ContractsConnectInstances
                    selectedComponents={props.selectedComponents}
                    instances={props.instances}
                    addInstances={props.addInstances}
                    deleteInstance={props.deleteInstance}
                    instancesOpen={props.instancesOpen}
                    setInstancesOpen={props.setInstancesOpen}
                    connectors={props.connectors}
                    addConnectors={props.addConnectors}
                />
            </div>

            <div className="px-3 pb-3 relative flex flex-col break-words bg-white rounded shadow-md h-fit">
                <ContractsConnectConnections
                    instances={props.instances}
                    connections={props.connections}
                    checkAddConnections={props.checkAddConnections}
                    deleteConnection={props.deleteConnection}
                    connectionsOpen={props.connectionsOpen}
                    setConnectionsOpen={props.setConnectionsOpen}
                />
            </div>
        </div>
    )
}

export default ContractsConnect;