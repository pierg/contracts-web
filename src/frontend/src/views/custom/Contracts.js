import React from "react";
import cromecontractsheaderscards from "../../_texts/custom/contractsheaderscards";
import ComponentsView from "../../components/Custom/ComponentsView";
import CustomNavButton from "../../components/Custom/CustomNavButton";
import CustomHeader from "../../components/Custom/CustomHeader";
import ComponentsDiagram from "../../components/Custom/ComponentsDiagram";
import ContractsConnect from "../../components/Custom/ContractsConnect";
import SocketSaveComponent from "../../components/Custom/Socket/SaveComponent";
import SocketIoPatterns from "../../components/Custom/Socket/GetPatterns";
import { Tooltip } from "react-tippy";
import SocketDownloadComponent from "../../components/Custom/Socket/DownloadComponent";
import SocketUploadComponent from "../../components/Custom/Socket/UploadComponent";
import SocketIoMessage from "../../components/Custom/Socket/Message";
import { Modal } from "reactstrap";
import SelectConnections from "../../components/Custom/SelectConnections";
import ConnectionEdit from "../../components/Custom/ConnectionEdit";
import LibraryView from "../../components/Custom/LibraryView";
import SocketLibrary from "../../components/Custom/Socket/Library";
import SocketDeleteComponent from "../../components/Custom/Socket/DeleteComponent";
import SocketConnection from "../../components/Custom/Socket/Connection";
import CustomFooter from "../../components/Custom/CustomFooter";
import customfooter from "../../_texts/custom/customfooter";

export default class Contracts extends React.Component {
  state = {
    // MAIN PAGE
    headerStates: [true, false, false],
    currentTabOpen: 0,
    triggerMessage: false,
    messageType: "",
    messageNotif: "",
    messageSideBar: "",

    // FIRST PAGE
    triggerLibrary: true,
    selectedLibrary: null,
    triggerAddLibrary: false,
    libraryNameToAdd: "",
    componentsLibraryToAdd: [],
    selectedComponents: [],
    components: [],
    componentsToDownloads: [],
    componentToDelete: null,
    componentToUpload: null,
    componentToSave: null,
    componentOldName: null,
    triggerComponents: true,
    triggerSave: false,
    triggerDelete: false,
    triggerDownload: false,
    triggerUpload: false,
    triggerDeleteLibrary: false,
    libraries: [],
    libraryToDelete: null,
    isDefault: false,

    // SECOND PAGE
    triggerGetConnection: false,
    triggerChooseConnection: false,
    connectionsFound: [],
    instances: [],
    instancesOpen: [],
    triggerAddConnection: false,
    connectionNameToAdd: "",
    connectors: [],
    triggerAddConnectionSocket: false,
    triggerDeleteConnection: false,
    connectionToDelete: null,
    connections: [],
    patterns: [],
  };

  getPatterns = (list) => {
    this.setState({
      patterns: JSON.parse(list),
    });
  };

  toggleNew = (e, actionToggle, disabled) => {
    if (disabled) return;
    let newHeaderStates = Array(this.state.headerStates.length).fill(false);
    if (actionToggle === 1) {
      if (this.state.headerStates[0]) {
        this.setTriggerGetConnection(true);
      }
    }
    newHeaderStates[actionToggle] = true;
    this.setState({
      currentTabOpen: actionToggle,
      headerStates: newHeaderStates,
    });
  };

  setTriggerMessage = (bool) => {
    this.setState({
      triggerMessage: bool,
    });
  };

  // FIRST PAGE
  setTriggerLibrary = (bool) => {
    this.setState({
      triggerLibrary: bool,
    });
  };

  setLibraries = (libraries) => {
    this.setState(
      {
        libraries: libraries,
      },
      function () {
        if (this.state.selectedLibrary != null) {
          for (let i = 0; i <= this.state.libraries.length; i++) {
            if (this.state.libraries[i].name === this.state.selectedLibrary.name) {
              this.setSelectedLibrary(i);
              break;
            }
          }
        }
      }
    );
  };

  setTriggerAddLibrary = (bool) => {
    this.setState({
      triggerAddLibrary: bool,
    });
  };

  addLibrary = (libraryName, componentsNames) => {
    this.setState({
      libraryNameToAdd: libraryName,
      componentsLibraryToAdd: componentsNames,
      triggerAddLibrary: true,
    });
  };

  setSelectedLibrary = (index) => {
    if (index === null) {
      this.setSelectedComponents([]);
      this.setState({
        selectedLibrary: null,
        components: [],
      });
      return;
    }
    let library = this.state.libraries[index];
    this.setComponents(library.components);
    this.setState({
      selectedLibrary: library,
    });
  };

  deleteLibrary = (libraryName) => {
    this.setState({
      triggerDeleteLibrary: true,
      libraryToDelete: libraryName,
    });
    if (libraryName === this.state.selectedLibrary.name) {
      this.setState({
        selectedLibrary: null,
      });
    }
  };

  setTriggerComponents = (bool) => {
    this.setState({
      triggerComponents: bool,
    });
  };

  setTriggerDelete = (bool) => {
    this.setState({
      triggerDelete: bool,
    });
  };

  setSelectedComponents = (selectedComponents) => {
    let instancesOpen = [];
    let instances = [];
    for (let i = 0; i < selectedComponents.length; i++) {
      instancesOpen[i] = Array(3).fill(false);
      instances[i] = {};
      instances[i] = { ...selectedComponents[i] };
      instances[i].name = "M_" + i + " (" + instances[i].name + ")";
    }
    this.setState({
      selectedComponents: selectedComponents,
      instances,
      instancesOpen,
      connectors: [],
      connections: [],
    });
  };

  setComponents = (components) => {
    let selectedComponents = [];
    for (let i = 0; i < this.state.selectedComponents.length; i++) {
      for (let j = 0; j < components.length; j++) {
        if (this.state.selectedComponents[i].name === components[j].name) {
          selectedComponents.push(components[j]);
        }
      }
    }
    this.setState({
      components,
    });
    this.setSelectedComponents(selectedComponents);
  };

  setTriggerSave = (bool) => {
    this.setState({
      triggerSave: bool,
    });
  };

  setTriggerDownload = (bool) => {
    this.setState({
      triggerDownload: bool,
    });
  };

  setTriggerUpload = (bool) => {
    this.setState({
      triggerUpload: bool,
    });
  };

  setTriggerDeleteLibrary = (bool) => {
    this.setState({
      triggerDeleteLibrary: bool,
    });
  };

  saveComponent = (component, componentOldName = null) => {
    this.setState({
      componentToSave: component,
      componentOldName: componentOldName,
      triggerSave: true,
    });
  };

  componentUpdate = () => {
    this.setState({
      triggerLibrary: true,
    });
  };

  deleteComponent = (component) => {
    this.setState({
      triggerDelete: true,
      componentToDelete: component,
    });
  };

  downloadComponents = (componentName, isDefault = false) => {
    this.setState({
      triggerDownload: true,
      isDefault: isDefault,
      componentsToDownloads: componentName,
    });
  };

  uploadComponents = (componentFile) => {
    this.setState({
      triggerUpload: true,
      componentToUpload: componentFile,
    });
  };

  // SECOND PAGE
  setTriggerGetConnection = (bool) => {
    this.setState({
      connectors: [],
      connections: [],
      triggerGetConnection: bool,
    });
  };

  setTriggerChooseConnection = (bool) => {
    this.setState({
      triggerChooseConnection: bool,
    });
  };

  connectionFound = (connections) => {
    if (this.state.selectedLibrary.default) {
      let includes
      for (let i = 0; i < connections.length; i++) {
        includes = false
        for(let j=0 ; j < this.state.connections.length; j++) {
          if(this.state.connections[j].name === connections[i].name) {
            includes = true
            break;
          }
        }
        if(!includes) {
          this.addConnectionDisplay(connections[i].name, connections[i].connections);
        }
      }
    }
    else {
      this.setState({
        triggerChooseConnection: true,
        connectionsFound: connections,
      });
    }
  };

  clearInstances = () => {
    this.setState({
      instances: [],
      instancesOpen: [],
      connectors: [],
      connections: [],
    });
  };

  addInstances = (component) => {
    let instances = this.state.instances;
    instances.push(component);
    let maxNbInstance = -1;
    for (let i = 0; i < instances.length; i++) {
      if (maxNbInstance < instances[i].name.split(" ")[0].split("_")[1]) {
        maxNbInstance = instances[i].name.split(" ")[0].split("_")[1];
      }
    }
    maxNbInstance++;
    instances[instances.length - 1].name =
      "M_" + maxNbInstance + " (" + instances[instances.length - 1].name + ")";
    let instancesOpen = this.state.instancesOpen;
    instancesOpen.push(Array(3).fill(false));
    this.setState({
      instances,
      instancesOpen,
    });
  };

  deleteInstance = (index) => {
    console.log(index);
    let connections = this.state.connections;
    //DELETE CONNECTIONS WHO HAVE CONNECTOR HAVE THE INSTANCE WHO WILL BE DELETED
    for (let i = 0; i < this.state.connections.length; i++) {
      for (let j = 0; j < this.state.connections[i].connectors.length; j++) {
        if (parseInt(this.state.connections[i].connectors[j].split("-")[0]) === index) {
          connections = connections.filter((e) => e !== this.state.connections[i]);
        }
      }
    }

    //REFACTOR INSTANCES
    let instances = this.state.instances;
    let tmp;
    for (let i = index + 1; i < instances.length; i++) {
      instances[i].name = "M_" + (i - 1) + " " + instances[i].name.split(" ")[1];
      for (let j = 0; j < connections.length; j++) {
        for (let k = 0; k < connections[j].connectors.length; k++) {
          tmp = connections[j].connectors[k].split("-");
          tmp[0] = i - 1;
          connections[j].connectors[k] = tmp.join("-");
        }
      }
    }
    instances = instances.filter((e) => e !== instances[index]);
    let instancesOpen = this.state.instancesOpen;
    instancesOpen = instancesOpen.filter((e) => e !== instancesOpen[index]);

    this.setState({
      instances,
      instancesOpen,
      connections,
    });
  };

  setInstancesOpen = (indexInstance, indexGroup) => {
    let instancesOpen = this.state.instancesOpen;
    instancesOpen[indexInstance][indexGroup] =
      !instancesOpen[indexInstance][indexGroup];
    this.setState({
      instancesOpen: instancesOpen,
    });
  };

  addConnectors = (connector) => {
    let connectors = this.state.connectors;
    if (connectors.includes(connector)) {
      connectors = connectors.filter((e) => e !== connector);
    } else {
      connectors.push(connector);
    }
    this.setState({
      connectors: connectors,
    });
  };

  checkAddConnections = () => {
    //check if there are at least 2 variables
    if (this.state.connectors.length < 2) {
      this.setState({
        messageType: "error",
        messageNotif:
          "The connection can't be created, see console for more information.",
        messageSideBar: "Not enough variables selected (at least two).",
        connectors: [],
      });
      this.setTriggerMessage(true);
      return;
    }

    //check if there are at least two instances selected
    let instance = this.state.connectors[0].split("-")[0];
    let nbInstances = 1;
    for (let i = 1; i < this.state.connectors.length; i++) {
      if (instance !== this.state.connectors[i].split("-")[0]) {
        nbInstances++;
        i = this.state.connectors.length;
      }
    }
    if (nbInstances === 1) {
      this.setState({
        messageType: "error",
        messageNotif:
          "The connection can't be created, see console for more information.",
        messageSideBar: "The selected variables come from the same instance.",
        connectors: [],
      });
      this.setTriggerMessage(true);
      return;
    }
    //check if all variables have the same type
    let type = this.state.connectors[0].split(" ")[2];
    for (let i = 1; i < this.state.connectors.length; i++) {
      if (type !== this.state.connectors[i].split(" ")[2]) {
        this.setState({
          messageType: "error",
          messageNotif:
            "The connection can't be created, see console for more information.",
          messageSideBar: "Variables selected have not the same type.",
          connectors: [],
        });
        this.setTriggerMessage(true);
        return;
      }
    }

    this.setTriggerAddConnection(true);
  };

  setTriggerAddConnection = (bool) => {
    this.setState({
      triggerAddConnection: bool,
    });
  };

  setTriggerAddConnectionSocket = (bool) => {
    this.setState({
      triggerAddConnectionSocket: bool,
    });
  };

  clearConnections = () => {
    this.setState({
      connections: [],
    });
  };

  addConnections = (name) => {
    this.setState({
      triggerAddConnection: false,
      triggerAddConnectionSocket: true,
      connectionNameToAdd: name,
    });
  };

  addConnectionDisplay = (
    name = this.state.connectionNameToAdd,
    connectors = this.state.connectors
  ) => {
    let connections = this.state.connections;
    connections.push({
      name: name,
      connectors: connectors,
    });

    this.setState({
      connections,
      connectors: [],
      connectionNameToAdd: "",
    });
  };

  setTriggerDeleteConnection = (bool) => {
    this.setState({
      triggerDeleteConnection: bool,
    });
  };

  deleteConnection = (index) => {
    let connections = this.state.connections;
    connections = connections.filter((e) => e !== connections[index]);
    this.setState({
      connections,
      triggerDeleteConnection: true,
      connectionToDelete: this.state.connections[index],
    });
  };

  render() {
    let page;
    if (this.state.headerStates[0]) {
      page = (
        <div className="flex relative flex-wrap justify-center items-start">
          <LibraryView
            libraries={this.state.libraries}
            addLibrary={this.addLibrary}
            selectedLibrary={this.state.selectedLibrary}
            setSelectedLibrary={this.setSelectedLibrary}
            deleteLibrary={this.deleteLibrary}
            components={this.state.components}
            setSelectedComponents={this.setSelectedComponents}
          />
          <ComponentsView
            selectedLibrary={this.state.selectedLibrary}
            setSelectedComponents={this.setSelectedComponents}
            selectedComponents={this.state.selectedComponents}
            setComponents={this.setComponents}
            components={this.state.components}
            saveComponent={this.saveComponent}
            deleteComponent={this.deleteComponent}
            downloadComponents={this.downloadComponents}
            uploadComponent={this.uploadComponents}
            patterns={this.state.patterns}
            default={
              this.state.selectedLibrary !== null
                ? this.state.selectedLibrary.default
                : false
            }
          />
        </div>
      );
    } else if (this.state.headerStates[1]) {
      page = (
        <>
          <Modal
            isOpen={this.state.triggerChooseConnection}
            autoFocus={false}
            toggle={() => this.setTriggerChooseConnection(false)}
            className={
              "custom-modal-dialog sm:c-m-w-70 md:c-m-w-60 lg:c-m-w-50 xl:c-m-w-40"
            }
          >
            <SelectConnections
              connectionsFound={this.state.connectionsFound}
              add={this.addConnectionDisplay}
              close={() => this.setTriggerChooseConnection(false)}
            />
          </Modal>
          <ContractsConnect
            selectedLibrary={this.state.selectedLibrary}
            selectedComponents={this.state.selectedComponents}
            instances={this.state.instances}
            clearInstances={this.clearInstances}
            addInstances={this.addInstances}
            deleteInstance={this.deleteInstance}
            instancesOpen={this.state.instancesOpen}
            setInstancesOpen={this.setInstancesOpen}
            connectors={this.state.connectors}
            clearConnections={this.clearConnections}
            addConnectors={this.addConnectors}
            connections={this.state.connections}
            checkAddConnections={this.checkAddConnections}
            deleteConnection={this.deleteConnection}
          />
          <Modal
            isOpen={this.state.triggerAddConnection}
            autoFocus={false}
            toggle={() => this.setTriggerAddConnection(false)}
            className={
              "custom-modal-dialog sm:c-m-w-70 md:c-m-w-60 lg:c-m-w-50 xl:c-m-w-40"
            }
          >
            <ConnectionEdit
              add={(name) => this.addConnections(name)}
              close={() => this.setTriggerAddConnection(false)}
            />
          </Modal>
        </>
      );
    } else {
      page = (
        <ComponentsDiagram
          instances={this.state.instances}
          connections={this.state.connections}
        />
      );
    }

    return (
      <>
        <SocketIoPatterns patterns={this.getPatterns} />
        <SocketIoMessage
          triggerMessage={this.state.triggerMessage}
          setTriggerMessage={this.setTriggerMessage}
          type={this.state.messageType}
          messageNotif={this.state.messageNotif}
          messageSideBar={this.state.messageSideBar}
        />
        <SocketLibrary
          //get
          libraries={this.state.libraries}
          triggerLibrary={this.state.triggerLibrary}
          setTriggerLibrary={this.setTriggerLibrary}
          setLibraries={this.setLibraries}
          //add
          triggerAddLibrary={this.state.triggerAddLibrary}
          setTriggerAddLibrary={this.setTriggerAddLibrary}
          libraryName={this.state.libraryNameToAdd}
          componentsNames={this.state.componentsLibraryToAdd}
          //delete
          libraryToDelete={this.state.libraryToDelete}
          triggerDelete={this.state.triggerDeleteLibrary}
          setTriggerDelete={this.setTriggerDeleteLibrary}
        />
        <SocketDeleteComponent
          componentIsDeleted={this.componentUpdate}
          library={this.state.selectedLibrary}
          triggerDelete={this.state.triggerDelete}
          setTriggerDelete={this.setTriggerDelete}
          componentToDelete={this.state.componentToDelete}
        />
        <SocketSaveComponent
          componentIsSaved={this.componentUpdate}
          library={this.state.selectedLibrary}
          triggerSave={this.state.triggerSave}
          setTriggerSave={this.setTriggerSave}
          component={this.state.componentToSave}
          componentOldName={this.state.componentOldName}
          triggerGetLibrary={this.setTriggerLibrary}
        />
        <SocketDownloadComponent
          library={this.state.selectedLibrary}
          componentsToDownloads={this.state.componentsToDownloads}
          isDefault={this.state.isDefault}
          triggerDownload={this.state.triggerDownload}
          setTriggerDownload={this.setTriggerDownload}
        />
        <SocketUploadComponent
          library={this.state.selectedLibrary}
          componentToUpload={this.state.componentToUpload}
          triggerUpload={this.state.triggerUpload}
          setTriggerUpload={this.setTriggerUpload}
          componentIsUploaded={this.componentUpdate}
        />
        <SocketConnection
          library={this.state.selectedLibrary}
          //get
          triggerGetConnection={this.state.triggerGetConnection}
          setTriggerGetConnection={this.setTriggerGetConnection}
          selectedComponents={this.state.selectedComponents}
          connectionFound={this.connectionFound}
          //add
          triggerAddConnection={this.state.triggerAddConnectionSocket}
          setTriggerAddConnectionSocket={this.setTriggerAddConnectionSocket}
          name={this.state.connectionNameToAdd}
          instances={this.state.instances}
          connectors={this.state.connectors}
          addConnectionDisplay={this.addConnectionDisplay}
          //delete
          connectionToDelete={this.state.connectionToDelete}
          triggerDeleteConnection={this.state.triggerDeleteConnection}
          setTriggerDeleteConnection={this.setTriggerDeleteConnection}
        />
        <CustomHeader
          {...cromecontractsheaderscards}
          color={"purple"}
          states={this.state.headerStates}
          clickable={false}
        />
        <div className="flex justify-evenly relative top--12">
          <div>
            <CustomNavButton
              open={this.state.currentTabOpen}
              itemsLength={this.state.headerStates.length}
              type={"back"}
              toggleNew={this.toggleNew}
              href="#/contracts"
            />
          </div>
          <div>
            <Tooltip
              disabled={this.state.currentTabOpen !== 0}
              title="Select at least one component to continue"
              position="bottom"
              arrow={true}
            >
              <CustomNavButton
                disabled={this.state.selectedComponents.length === 0}
                open={this.state.currentTabOpen}
                itemsLength={this.state.headerStates.length}
                type={this.state.currentTabOpen === 0 ? "connect" : "create-system"}
                toggleNew={this.toggleNew}
                href="#/contracts"
              />
            </Tooltip>
          </div>
        </div>

        <div className="mx-40 my-6 pb-10">{page}</div>
        <CustomFooter {...customfooter} />
      </>
    );
  }
}
