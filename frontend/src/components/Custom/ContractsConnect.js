import React from "react";
import ContractsConnectConnections from "../../_texts/custom/ContractsConnectConnections";
import ContractsConnectInstances from "../../_texts/custom/ContractsConnectInstances";

function ContractsConnect(props) {

    return (
        <div className="flex">
            <div className="px-3 pb-3 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">
                <ContractsConnectInstances/>
            </div>

            <div className="px-3 pb-3 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">

                <ContractsConnectConnections/>

            </div>
        </div>
    )
}

export default ContractsConnect;