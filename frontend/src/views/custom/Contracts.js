import React from "react";
import cromecontractsheaderscards from "../../_texts/custom/cromecontractsheaderscards";
import ComponentsView from "../../components/Custom/ComponentsView";
import CustomNavButton from "../../components/Custom/CustomNavButton";
import CustomHeader from "../../components/Custom/CustomHeader";
import ComponentsDiagram from "../../components/Custom/ComponentsDiagram";
import ContractsConnect from "../../components/Custom/ContractsConnect";
import SocketIoComponents from "../../components/Custom/Socket/GetComponents";

let tests=[]
for (let i=0; i<20; i++) {
    tests.push(
        {
            "title": "component_"+i,
            "description" : "here is the description of the component",
            "inputs":[
                {"name" : "x", "type" : "float"},
                {"name" : "a", "type" : "bool"}
            ],
            "outputs":[
                {"name" : "y", "type" : "float"},
                {"name" : "b", "type" : "bool"}
            ],
            "assumptions":{
                "PL" : ["x <= 84", "x > 5"],
                "LTL" : ["GF(a)"]
            },
            "guarantees":{
                "PL" : ["y > 2"],
                "LTL" : ["F(b)"]
            }
        }
    )
}

export default class Contracts extends React.Component {
    state = {
        // MAIN PAGE
        headerStates: [true, false, false],
        currentTabOpen: 0,

        // FIRST PAGE
        selectedComponents: [],
        components : tests,
        triggerComponents : true,

        // SECOND PAGE
        instances : [],
        instancesOpen : []

    }

    // MAIN PAGE
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
        for(let i=0; i<this.state.selectedComponents.length; i++) {
            instancesOpen[i] = Array(4).fill(false)
        }
        this.setState({
            selectedComponents,
            instances : selectedComponents,
            instancesOpen : instancesOpen
        })
    }

    setComponents = (components) => {
        this.setState({
            components
        })
    }

    // SECOND PAGE
    setInstances = (instances) => {
        let instancesOpen = []
        for(let i=0; i<this.state.selectedComponents.length; i++) {
            instancesOpen[i] = Array(4).fill(false)
        }
        this.setState({
            instances,
            instancesOpen : instancesOpen
        })
    }

    setInstancesOpen = (indexInstance, indexGroup) => {
        let instancesOpen = this.state.instancesOpen
        instancesOpen[indexInstance][indexGroup] = !instancesOpen[indexInstance][indexGroup]
        this.setState({
            instancesOpen : instancesOpen
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
                    />
        } else if (this.state.headerStates[1]) {
            page = <ContractsConnect
                        instances={this.state.instances}
                        setInstances={this.state.setInstances}
                        instancesOpen={this.state.instancesOpen}
                        setInstancesOpen={this.setInstancesOpen}
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
                <SocketIoComponents
                    updateComponents={this.setComponents}
                    triggerComponents={this.state.triggerComponents}
                    setTriggerComponents={this.setTriggerComponents}
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