import contractsconnect from "../../_texts/custom/contractsconnect";
import Button from "../Elements/Button";
import React from "react";

function ContractsConnectConnections(props) {
    return (<>
        <div className="flex p-3">
            <span className={contractsconnect.connections.connectionsStyle}>
                    {contractsconnect.connections.connectionsTitle}
            </span>

            <Button
                size={contractsconnect.addButton.size}
                color={contractsconnect.addButton.color}
            >
                <i className={contractsconnect.addButton.icon}></i>
            </Button>
        </div>
    </>)
}

export default ContractsConnectConnections