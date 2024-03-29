const textProps = {
  info: {
    texts: {
      title: "New page",
      component: {
        header: {
          title: "COMPONENTS",
          addButton: {
            size: "sm",
            color: "gray",
            icon: "fa-solid fa-plus fa-2xl text-lightBlue-700",
          },
          uploadButton: {
            size: "sm",
            color: "gray",
            icon: "fa-solid fa-upload fa-2xl text-lightBlue-700",
          },
          downloadButton: {
            size: "sm",
            color: "gray",
            icon: "fa-solid fa-download fa-2xl text-lightBlue-700",
          },
        },
      },
      diagram: "DIAGRAM",
      info: {
        title: "INFO",
        inputs: "Inputs",
        outputs: "Outputs",
        assumptions: "Assumptions",
        guarantees: "Guarantees",
      },
    },
    icon: {
      info: "fas fa-info",
      build: "fas fa-2xl fa-arrow-right",
      delete: "fas fa-trash-alt",
      download: "fas fa-download",
      edit: "fas fa-pen",
    },
  },
};

export default textProps;
