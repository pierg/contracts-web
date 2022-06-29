import contractsconnect from "./contractsconnect";
import Button from "../../components/Elements/Button";
import React from "react";
import {Classes, Tree} from "@blueprintjs/core";

function ContractsConnectConnections(props) {
    const [tree] = []
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