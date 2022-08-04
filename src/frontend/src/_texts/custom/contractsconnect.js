const textProps = {
    instances: {
        instancesTitle: "Instances",
        instanceStyle: "text-2xl font-bold text-blueGray-500 uppercase m-auto",
        messages: [
            {
                title: "Step 1 :",
                content: "Select variables you want to connect by unfolding instances.",
            },
            {
                title: "Step 2 :",
                content: "Click on the arrow button to create the connection.",
            },
            {
                title: "Step 3 :",
                content: "Repeat",
            },
        ],
        demoMessage: [
            {
                content: "Here are the instances, you can unfold them to see their output and input"
            },
            {
                content: "Connections on the right are already created"
            },
            {
                content: "Click on “Create system” to go to generated your system"
            }
        ]
    },
    connections: {
        connectionsTitle: "Connections",
        connectionsStyle: "text-2xl font-bold text-blueGray-500 uppercase mx-4 mr-4",
    },
    addButton: {
        size: "sm",
        color: "gray",
        icon: "fa-solid fa-plus fa-2xl text-lightBlue-700",
    },
    clearButton: {
        size: "sm",
        color: "gray",
        icon: "fas fa-trash-alt fa-2xl text-lightBlue-700",
    },
    addConnectionButton: {
        size: "sm",
        color: "gray",
        icon: "fa-solid fa-arrow-right fa-2xl text-lightBlue-700",
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
};
export default textProps;
