import React from "react";
import ContractsConnectConnections from "./ContractsConnectConnections";
import ContractsConnectInstances from "./ContractsConnectInstances";

function ContractsConnect(props) {
    return (
        <div className="flex">
            <div className="px-3 pb-3 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">
                <ContractsConnectInstances
                    instances={props.instances}
                    setInstances={props.setInstances}
                    instancesOpen={props.instancesOpen}
                    setInstancesOpen={props.setInstancesOpen}
                />
            </div>

            <div className="px-3 pb-3 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">

                <ContractsConnectConnections/>

            </div>
        </div>
    )
}

export default ContractsConnect;