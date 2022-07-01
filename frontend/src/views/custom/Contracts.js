import React from "react";
import cromecontractsheaderscards from "../../_texts/custom/cromecontractsheaderscards";
import ComponentsView from "../../components/Custom/ComponentsView";
import CustomNavButton from "../../components/Custom/CustomNavButton";
import CustomHeader from "../../components/Custom/CustomHeader";
import ComponentsDiagram from "../../components/Custom/ComponentsDiagram";
import ContractsConnect from "../../components/Custom/ContractsConnect";
import SocketIoComponents from "../../components/Custom/Socket/GetComponents";
import SocketSaveComponent from "../../components/Custom/Socket/SaveComponent";
import SocketIoPatterns from "../../components/Custom/Socket/GetPatterns";

export default class Contracts extends React.Component {
    state = {
        // MAIN PAGE
        headerStates: [true, false, false],
        currentTabOpen: 0,

        // FIRST PAGE
        selectedComponents: [],
        components : [],
        triggerComponents : true,
        triggerSave : false,
        componentToSave : null,

        // SECOND PAGE
        instances : [],
        instancesOpen : [],
        connectors : [],
        connections : [],
        patterns: []
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

    // FIRST PAGE
    setTriggerComponents = (bool) => {
        this.setState({
            triggerComponents : bool
        })
    }

    setSelectedComponents = (selectedComponents) => {
        let instancesOpen = []
        let instances = []
        for(let i=0; i<selectedComponents.length; i++) {
            instancesOpen[i] = Array(3).fill(false)
            instances[i] = {}
            instances[i] = {...selectedComponents[i]}
            instances[i].name = "M_"+i+" ("+instances[i].name+")"
        }
        this.setState({
            selectedComponents : selectedComponents,
            instances : instances,
            instancesOpen : instancesOpen
        })
    }

    setComponents = (components) => {
        this.setState({
            components
        })
    }

    setTriggerSave = (bool) => {
        this.setState({
            triggerSave : bool
        })
    }


    saveComponent = (component) => {
        this.setState({
            componentToSave : component,
            triggerSave : true
        })
    }

    componentIsSaved = () => {
        this.setState({
            triggerComponents : true
        })
    }

    // SECOND PAGE
    addInstances = (component) => {
        let instances = this.state.instances
        instances.push(component)
        console.log(instances[instances.length-1])
        instances[instances.length-1].name = "M_"+(instances.length-1)+" ("+instances[instances.length-1].name+")"
        console.log(instances[instances.length-1])
        let instancesOpen = this.state.instancesOpen
        instancesOpen.push(Array(3).fill(false))
        this.setState({
            instances,
            instancesOpen,
        })
    }

    setInstancesOpen = (indexInstance, indexGroup) => {
        let instancesOpen = this.state.instancesOpen
        instancesOpen[indexInstance][indexGroup] = !instancesOpen[indexInstance][indexGroup]
        this.setState({
            instancesOpen : instancesOpen
        })
    }

    addConnectors = (connector) => {
        let connectors = this.state.connectors
        if(connectors.includes(connector)) {
            connectors = connectors.filter((e) => e !== connector)
        }
        else {
            connectors.push(connector)
        }
        this.setState({
            connectors : connectors
        })
    }

    addConnections = () => {
        let connections = this.state.connections
        connections.push({
            "name" : "C_"+connections.length,
            "connectors" : []
        })
        this.setState({
            connectors : [],
            connections : connections
        })
    }

    render() {
        const nodes = [
            {
                id: 'node-1',
                content: 'Start',
                coordinates: [100, 150],
                outputs: [
                    {id: 'port-1', alignment: 'right'},
                    {id: 'port-2', alignment: 'right'},
                ],
                disableDrag: true,
                data: {
                    foo: 'bar',
                    count: 0,
                }
            },
            {
                id: 'node-2',
                content: 'Middle',
                coordinates: [300, 150],
                inputs: [
                    {id: 'port-3', alignment: 'left'},
                    {id: 'port-4', alignment: 'left'},
                ],
                outputs: [
                    {id: 'port-5', alignment: 'right'},
                    {id: 'port-6', alignment: 'right'},
                ],
                data: {
                    bar: 'foo',
                }
            },
            {
                id: 'node-3',
                content: 'End',
                coordinates: [600, 150],
                inputs: [
                    {id: 'port-7', alignment: 'left'},
                    {id: 'port-8', alignment: 'left'},
                ],
                data: {
                    foo: true,
                    bar: false,
                    some: {
                        deep: {
                            object: true,
                        }
                    },
                }
            },
        ]

        const links = [
            {input: 'port-1', output: 'port-4'},
        ]
        let page;
        if (this.state.headerStates[0]) {
            page = <ComponentsView
                        setSelectedComponents={this.setSelectedComponents}
                        selectedComponents={this.state.selectedComponents}
                        setComponents={this.setComponents}
                        components={this.state.components}
                        saveComponent={this.saveComponent}
                        patterns={this.state.patterns}
                    />
        } else if (this.state.headerStates[1]) {
            page = <ContractsConnect
                        selectedComponents={this.state.selectedComponents}
                        instances={this.state.instances}
                        addInstances={this.addInstances}
                        instancesOpen={this.state.instancesOpen}
                        setInstancesOpen={this.setInstancesOpen}
                        connectors={this.state.connectors}
                        addConnectors={this.addConnectors}
                        connections={this.state.connections}
                        addConnections={this.addConnections}
                    />
        } else {
            page =
                <ComponentsDiagram
                    nodes={nodes}
                    links={links}
                />
        }

        return (
            <>
                <SocketIoPatterns
                    patterns={this.getPatterns}
                />
                <SocketIoComponents
                    updateComponents={this.setComponents}
                    triggerComponents={this.state.triggerComponents}
                    setTriggerComponents={this.setTriggerComponents}
                />
                <SocketSaveComponent
                    componentIsSaved={this.componentIsSaved}
                    triggerSave={this.state.triggerSave}
                    setTriggerSave={this.setTriggerSave}
                    component={this.state.componentToSave}
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
                        <CustomNavButton
                            open={this.state.currentTabOpen}
                            itemsLength={this.state.headerStates.length}
                            type={this.state.currentTabOpen === 0 ? "connect" : "create-system"}
                            toggleNew={this.toggleNew}
                            href="#/contracts"
                        />
                    </div>
                </div>

                <div className="mx-40 my-6">
                    {page}
                </div>
            </>
        )
    }
}