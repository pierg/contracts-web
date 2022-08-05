const textProps = {
    info: {
        title: "LIBRARIES",
        icon: "fa-solid fa-folder fa-xl",
        addLibrary: {
            size: "sm",
            color: "gray",
            icon: "fa-solid fa-plus fa-2xl text-lightBlue-700",
        },
        deleteLibrary: {
            size: "xs",
            color: "red",
            icon: "fas fa-trash-alt",
        },
    },
    demoLibrary: {
        message: [
            {
                content: "This is a demo library, you can’t add or remove components from it.",
            },
            {
                content: "Select it and click on “connect” to go to the next page"
            }],
        icon: "ml-1 text-lightBlue-700 text-2xl fas fa-info-circle"

    },
};

export default textProps;
