import React from "react";
import cromecontractsheaderscards from "../../_texts/custom/cromecontractsheaderscards";
import ComponentsView from "../../components/Custom/ComponentsView";
import CustomNavButton from "../../components/Custom/CustomNavButton";
import CustomHeader from "../../components/Custom/CustomHeader";
import ComponentsDiagram from "../../components/Custom/ComponentsDiagram";
import ContractsConnect from "../../components/Custom/ContractsConnect";

const tests = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]

export default class Contracts extends React.Component {
    state = {
        headerStates: [true, false, false],
        currentTabOpen: 0,
        selectedComponents: [],
        components : tests
        //components : []

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