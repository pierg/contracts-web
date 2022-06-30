import React from "react";
import cromecontractsheaderscards from "../../_texts/custom/cromecontractsheaderscards";
import ComponentsView from "../../components/Custom/ComponentsView";
import CustomNavButton from "../../components/Custom/CustomNavButton";
import CustomHeader from "../../components/Custom/CustomHeader";
import ComponentsDiagram from "../../components/Custom/ComponentsDiagram";
import ContractsConnect from "../../components/Custom/ContractsConnect";
import SocketIoComponents from "../../components/Custom/Socket/GetComponents";
import SocketSaveComponent from "../../components/Custom/Socket/SaveComponent";

let tests=[]
for (let i=0; i<20; i++) {
    tests.push({
        "title": "component_"+i,
        "description" : "here is the description of the component",
        "inputs": "test inputs",
        "outputs": "test outputs",
        "contract": {
            "assumptions":"test assumptions",
            "guarantees":"test guarantees"
        }
    })
}

export default class Contracts extends React.Component {
    state = {
        headerStates: [true, false, false],
        currentTabOpen: 0,
        selectedComponents: [],
        components : [],
        triggerComponents : true,
        triggerSave : false,
        componentToSave : null
        //components : []
    }

    setTriggerSave = (bool) => {
        this.setState({
            triggerSave : bool
        })
    }

    setTriggerComponents = (bool) => {
        this.setState({
            triggerComponents : bool
        })
    }

    setSelectedComponents = (selectedComponents) => {
        this.setState({
            selectedComponents
        })
    }

    setComponents = (components) => {
        this.setState({
            components
        })
    }

    saveComponent = (component) => {
        console.log(component)
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
                    />
        } else if (this.state.headerStates[1]) {
            page = <ContractsConnect/>
        } else {
            page =
                <ComponentsDiagram
                    nodes={nodes}
                    links={links}
                />

        }
        return (
            <>
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