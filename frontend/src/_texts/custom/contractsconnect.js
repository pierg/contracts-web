const textProps = {
    instances: {
        instancesTitle: "Instances",
        instanceStyle: "text-2xl font-bold text-blueGray-500 uppercase mx-4",
        messages: [
            {
                title: "How to (un)select inputs or outputs",
                content: "Click on the line corresponding to the variable that will be in the connection."
            },
            {
                title: "How to unfold instance",
                content: "Click on instance and after on inputs/outputs to see variables."
            },
            {
                title: "How to create connection",
                content: "When your selection is complete, click on the right of the part connections."
            },
        ]
    }
    ,
    connections: {
        connectionsTitle: "Connections",
        connectionsStyle: "text-2xl font-bold text-blueGray-500 uppercase mr-4"

    },
    addButton: {
        size: "sm",
        color: "gray",
        icon: "fa-solid fa-plus fa-2xl text-lightBlue-700",
    },
    downloadButton: {
        size: "sm",
        color: "gray",
        icon: "fa-solid fa-download fa-2xl text-lightBlue-700",
    },
    deleteButton: {
        size: "sm",
        color: "red",
        icon: "fas fa-trash-alt",
    },

}
export default textProps;