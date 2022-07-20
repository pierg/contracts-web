import React from "react";
import cromecontractsheaderscards from "../../_texts/custom/contractsheaderscards";
import ComponentsView from "../../components/Custom/ComponentsView";
import CustomNavButton from "../../components/Custom/CustomNavButton";
import CustomHeader from "../../components/Custom/CustomHeader";
import ComponentsDiagram from "../../components/Custom/ComponentsDiagram";
import ContractsConnect from "../../components/Custom/ContractsConnect";
import SocketSaveComponent from "../../components/Custom/Socket/SaveComponent";
import SocketIoPatterns from "../../components/Custom/Socket/GetPatterns";
import {Tooltip} from "react-tippy"
import SocketDownloadComponent from "../../components/Custom/Socket/DownloadComponent";
import SocketUploadComponent from "../../components/Custom/Socket/UploadComponent";
import SocketIoMessage from "../../components/Custom/Socket/Message";
import {Modal} from "reactstrap";
import ConnectionEdit from "../../components/Custom/ConnectionEdit";
import LibraryView from "../../components/Custom/LibraryView";
import SocketLibrary from "../../components/Custom/Socket/Library";
import SocketDeleteComponent from "../../components/Custom/Socket/DeleteComponent";

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
        instances: [],
        instancesOpen: [],
        connectors: [],
        triggerAddConnection: false,
        connections: [],
        patterns: [],
        connectionsOpen: [],
    }

    getPatterns = (list) => {
        this.setState({
            patterns: JSON.parse(list)
        })
    }

    toggleNew = (e, actionToggle, disabled) => {
        if (disabled) return
        let newHeaderStates = Array(this.state.headerStates.length).fill(false);
        newHeaderStates[actionToggle] = true
        this.setState({
                currentTabOpen: actionToggle,
                headerStates: newHeaderStates
            }
        )

    }

    setTriggerMessage = (bool) => {
        this.setState({
            triggerMessage: bool
        })
    }

    // FIRST PAGE
    setTriggerLibrary = (bool) => {
        this.setState({
            triggerLibrary: bool
        })
    }

    setLibraries = (libraries) => {
        this.setState({
            libraries: libraries
        }, function () {
              if (this.state.selectedLibrary != null) {
                for (let i=0; i<=this.state.libraries.length; i++) {
                    console.log(this.state.libraries[i])
                    if (this.state.libraries[i].name === this.state.selectedLibrary.name) {
                        this.setSelectedLibrary(i)
                        break;
                    }
                }
            }
        })
    }
    setTriggerAddLibrary = (bool) => {
        this.setState({
            triggerAddLibrary: bool
        })
    }

    addLibrary = (libraryName, componentsNames) => {
        this.setState({
            libraryNameToAdd : libraryName,
            componentsLibraryToAdd : componentsNames,
            triggerAddLibrary: true,
        })
    }

    setSelectedLibrary = (index) => {
        if(index === null) {
            this.setSelectedComponents([])
            this.setState({
                selectedLibrary: null
            })
            return
        }
        let library = this.state.libraries[index]
        this.setComponents(library.components)
        this.setState({
            selectedLibrary: library
        })
    }

    deleteLibrary = (libraryName) => {
        this.setState({
            triggerDeleteLibrary: true,
            libraryToDelete: libraryName
        })
    }

    setTriggerComponents = (bool) => {
        this.setState({
            triggerComponents: bool
        })
    }

    setTriggerDelete = (bool) => {
        this.setState({
            triggerDelete: bool
        })
    }

    setSelectedComponents = (selectedComponents) => {
        let instancesOpen = []
        let instances = []
        for (let i = 0; i < selectedComponents.length; i++) {
            instancesOpen[i] = Array(3).fill(false)
            instances[i] = {}
            instances[i] = {...selectedComponents[i]}
            instances[i].name = "M_" + i + " (" + instances[i].name + ")"
        }
        this.setState({
            selectedComponents: selectedComponents,
            instances,
            instancesOpen,
            connectors: [],
            connections: [],
            connectionsOpen: [],
        })
    }

    setComponents = (components) => {
        let selectedComponents = []
        for (let i = 0; i < this.state.selectedComponents.length; i++) {
            for (let j = 0; j < components.length; j++) {
                if (this.state.selectedComponents[i].name === components[j].name) {
                    selectedComponents.push(components[j])
                }
            }
        }
        this.setState({
            components
        })
        this.setSelectedComponents(selectedComponents)
    }

    setTriggerSave = (bool) => {
        this.setState({
            triggerSave: bool
        })
    }

    setTriggerDownload = (bool) => {
        this.setState({
            triggerDownload: bool
        })
    }

    setTriggerUpload = (bool) => {
        this.setState({
            triggerUpload: bool
        })
    }

    setTriggerDeleteLibrary = (bool) => {
        this.setState({
            triggerDeleteLibrary: bool
        })
    }

    saveComponent = (component, componentOldName = null) => {
        this.setState({
            componentToSave: component,
            componentOldName: componentOldName,
            triggerSave: true
        })
    }

    componentUpdate = () => {
        this.setState({
            triggerLibrary: true
        })
    }

    deleteComponent = (component) => {
        this.setState({
            triggerDelete: true,
            componentToDelete: component
        })
    }

    downloadComponents = (componentName, isDefault=false) => {
        this.setState({
            triggerDownload: true,
            isDefault: isDefault,
            componentsToDownloads: componentName
        })
    }

    uploadComponents = (componentFile) => {
        this.setState({
            triggerUpload: true,
            componentToUpload: componentFile
        })
    }

    // SECOND PAGE
    addInstances = (component) => {
        let instances = this.state.instances
        instances.push(component)
        let maxNbInstance = -1
        for (let i = 0; i < instances.length; i++) {
            if (maxNbInstance < instances[i].name.split(" ")[0].split("_")[1]) {
                maxNbInstance = instances[i].name.split(" ")[0].split("_")[1]
            }
        }
        maxNbInstance++
        instances[instances.length - 1].name = "M_" + maxNbInstance + " (" + instances[instances.length - 1].name + ")"
        let instancesOpen = this.state.instancesOpen
        instancesOpen.push(Array(3).fill(false))
        this.setState({
            instances,
            instancesOpen,
        })
    }

    deleteInstance = (index) => {
        let instances = this.state.instances
        instances = instances.filter((e) => e !== instances[index])
        let instancesOpen = this.state.instancesOpen
        instancesOpen = instancesOpen.filter((e) => e !== instancesOpen[index])

        //DELETE CONNECTIONS WHO HAVE CONNECTOR HAVE THE INSTANCE WHO WILL BE DELETED
        for (let i = 0; i < this.state.connections.length; i++) {
            for (let j = 0; j < this.state.connections[i].connectors.length; j++) {
                if (parseInt(this.state.connections[i].connectors[j].split("-")[0]) === index) {
                    this.deleteConnection(i)
                }
            }
        }
        this.setState({
            instances,
            instancesOpen,
        })
    }

    setInstancesOpen = (indexInstance, indexGroup) => {
        let instancesOpen = this.state.instancesOpen
        instancesOpen[indexInstance][indexGroup] = !instancesOpen[indexInstance][indexGroup]
        this.setState({
            instancesOpen: instancesOpen
        })
    }

    addConnectors = (connector) => {
        let connectors = this.state.connectors
        if (connectors.includes(connector)) {
            connectors = connectors.filter((e) => e !== connector)
        } else {
            connectors.push(connector)
        }
        this.setState({
            connectors: connectors
        })
    }

    checkAddConnections = () => {
        let error = 0
        if(this.state.connectors.length < 1) {
            error = 1
            this.setState({
                messageType: "error",
                messageNotif: "The connection can't be created, see console for more information.",
                messageSideBar: "Not enough variables selected.",
                connectors: [],
            })
            this.setTriggerMessage(true)
        }
        else {
            let type = this.state.connectors[0].split(" ")[2]
            for(let i=1; i<this.state.connectors.length; i++) {
                if(type !== this.state.connectors[i].split(" ")[2]) {
                    error = 1
                    this.setState({
                        messageType: "error",
                        messageNotif: "The connection can't be created, see console for more information.",
                        messageSideBar: "Variables selected have not the same type.",
                        connectors: [],
                    })
                    this.setTriggerMessage(true)
                    i = this.state.connectors.length
                }
            }
        }
        if(error === 0) {
            this.setTriggerAddConnection(true)
        }
    }

    setTriggerAddConnection = (bool) => {
        this.setState({
            triggerAddConnection: bool
        })
    }

    addConnections = (name) => {
        let connections = this.state.connections
        let boolUniquePort = true
        let instanceUsed = this.state.connectors[0].split("-")[0]
        for(let i=1; i<this.state.connectors.length; i++) {
            if(instanceUsed !== this.state.connectors[i].split("-")[0]) {
                boolUniquePort = false
            }
        }
        connections.push({
            "name": name,
            "connectors": this.state.connectors,
            "boolUniquePort": boolUniquePort
        })
        let connectionsOpen = this.state.connectionsOpen
        connectionsOpen.push(false)
        this.setState({
            connectors: [],
            connections: connections,
            connectionsOpen: connectionsOpen,
            triggerAddConnection: false,
        })
    }

    deleteConnection = (index) => {
        let connections = this.state.connections
        connections = connections.filter((e) => e !== connections[index])
        let connectionsOpen = this.state.connectionsOpen
        connectionsOpen = connectionsOpen.filter((e) => e !== connectionsOpen[index])
        this.setState({
            connections,
            connectionsOpen: connectionsOpen,
        })
    }

    setConnectionsOpen = (indexConnection) => {
        let connectionsOpen = this.state.connectionsOpen
        connectionsOpen[indexConnection] = !connectionsOpen[indexConnection]
        this.setState({
            connectionsOpen: connectionsOpen
        })
    }

    render() {
        let page;
        if (this.state.headerStates[0]) {
            page =  <div className="flex flex-row items-start">
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
                    default={this.state.selectedLibrary !== null ? this.state.selectedLibrary.default : false}
                />
            </div>
        } else if (this.state.headerStates[1]) {
            page =
                <>
                    <ContractsConnect
                        selectedComponents={this.state.selectedComponents}
                        instances={this.state.instances}
                        addInstances={this.addInstances}
                        deleteInstance={this.deleteInstance}
                        instancesOpen={this.state.instancesOpen}
                        setInstancesOpen={this.setInstancesOpen}
                        connectors={this.state.connectors}
                        addConnectors={this.addConnectors}
                        connections={this.state.connections}
                        checkAddConnections={this.checkAddConnections}
                        deleteConnection={this.deleteConnection}
                        connectionsOpen={this.state.connectionsOpen}
                        setConnectionsOpen={this.setConnectionsOpen}
                    />
                    <Modal
                        isOpen={this.state.triggerAddConnection}
                        autoFocus={false}
                        toggle={() => this.setTriggerAddConnection(false)}
                        className={"custom-modal-dialog sm:c-m-w-70 md:c-m-w-60 lg:c-m-w-50 xl:c-m-w-40"}
                    >
                        <ConnectionEdit
                            add={(name) => this.addConnections(name)}
                            close={() => this.setTriggerAddConnection(false)}
                        />
                    </Modal>
                </>
        } else {
            page =
                <ComponentsDiagram
                    instances={this.state.instances}
                    connections={this.state.connections}
                />
        }

        return (
            <>
                <SocketIoPatterns
                    patterns={this.getPatterns}
                />
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

                <div className="mx-40 my-6">
                    {page}
                </div>
            </>
        )
    }
}