import React from "react";
import componentInfo from "../../_texts/custom/componentInfo";
import ComponentEdit from "./ComponentEdit";
import Button from "../Elements/Button";
import {Modal} from "reactstrap";
import componenteditinfo from "../../_texts/custom/componenteditinfo";
import defaultcomponent from "../../_texts/custom/defaultcomponent";
import {Tooltip} from 'react-tippy';
import Checkbox from "../Elements/Checkbox";
import ComponentInfoOffCanvas from "./ComponentInfoOffCanvas";

export default class ComponentsView extends React.Component {

    state = {
        triggerAddComponent: false,
        tmpComponent: false,
        componentToShow : null,
        show : false
    }

    setTriggerAddComponent = (bool) => {
        this.setState({
            triggerAddComponent: bool
        })
    }

    setTmpComponent = (tmpComponent) => {
        this.setState({
            tmpComponent: tmpComponent
        })
    }

    lineClicked = (i) => {
        let selected = this.props.selectedComponents
        if (selected.includes(this.props.components[i]))
            selected = selected.filter((e) => e!==this.props.components[i])
        else
            selected.push(this.props.components[i])

        this.props.setSelectedComponents(selected)
    }

    clickAddComponent = () => {
        this.setTmpComponent(defaultcomponent)
        this.setTriggerAddComponent(true)
    }

    editComponent = (component) => {
        this.setTmpComponent(component)
    }

    deleteComponent = (i) => {

        let tmpComponent = this.props.components
        let selected = this.props.selectedComponents

        selected = selected.filter((e) => e!==this.props.components[i])
        tmpComponent.splice(i,1)

        this.props.setSelectedComponents(selected)
        this.props.setComponents(tmpComponent)
    }


    selectAllComponents = (e) => {
        if (e.target.checked)
            this.props.setSelectedComponents(this.props.components)
        else
            this.props.setSelectedComponents([])
    }

    saveComponent = (component) => {
        this.setTriggerAddComponent(false)
        const tmpComponent = {
            "name":component.name,
            "description": component.description,
            "inputs" : component.inputs,
            "outputs" : component.outputs,
            "assumptions" : {
                'LTL': [],
                'PL': []
            },
            "guarantees" : {
                'LTL': [],
                'PL': []
            }
        }

        for (let i=0; i<component.assumptions.length;i++) {
            tmpComponent.assumptions.LTL.push(component.assumptions[i].LTL[0])
            tmpComponent.assumptions.PL.push(component.assumptions[i].PL[0])
        }

        for (let i=0; i<component.guarantees.length;i++) {
            tmpComponent.guarantees.LTL.push(component.guarantees[i].LTL[0])
            tmpComponent.guarantees.PL.push(component.guarantees[i].PL[0])
        }

        this.props.saveComponent(tmpComponent)
    }

    handleShow = (i) => {
        this.setState({
            componentToShow : this.props.components[i],
            show : true
        })
    }

    handleClose = () => {
        this.setState({
            show : false
        })
    }


    render() {
        let components = []
        let lineClass = ""
        for (let i = 0; i < this.props.components.length; i++) {
            lineClass="border-b-1 text-lg p-3 rounded hover:bg-blueGray-200 text-blueGray-700 hover:text-blueGray-900 cursor-pointer"
            if (i===0) {
                lineClass+=" border-t-1"
            }
            if (this.props.selectedComponents.includes(this.props.components[i])) {
                lineClass+=" bg-blueGray-100 font-bold"
            }

            components.push(<li key={i} onClick={() => this.lineClicked(i)}
                                    className={lineClass}>
                    <div className="flex justify-between" >
                        <div>
                           {this.props.components[i].name}
                        </div>
                        <div>
                            <Button size="sm" color="gray" onClick={(e) => {
                                e.stopPropagation(); this.handleShow(i)
                            }}>
                                <i className={componentInfo.info.icon.info}/>
                            </Button>

                            <Button size="sm" color="gray" onClick={(e) => {
                                e.stopPropagation(); this.editComponent(i)
                            }}>
                                <i className={componentInfo.info.icon.edit}/>
                            </Button>

                            <Button size="sm" color="red" onClick={(e) => {
                                e.stopPropagation(); this.deleteComponent(i)
                            }}>
                                <i className={componentInfo.info.icon.delete}/>
                            </Button>
                        </div>
                    </div>
                </li>)
        }

        return (<>
            <div className="px-3 pb-3 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">
                <div className="flex justify-between p-4 text-center">
                    <div><Checkbox onChange={(e) => this.selectAllComponents(e)} label="Select all" /></div>
                    <div className="fs-4 font-bold text-blueGray-500">
                        {componentInfo.info.texts.component.header.title}
                    </div>
                    <div className="flex justify-center">
                        <div className="mx-2">
                            <Tooltip
                                title="Add a component"
                                position="right"
                                arrow="true"
                            >
                                <Button
                                    size={componentInfo.info.texts.component.header.addButton.size}
                                    color={componentInfo.info.texts.component.header.addButton.color}
                                    onClick={() => this.clickAddComponent()}
                                >
                                    <i className={componentInfo.info.texts.component.header.addButton.icon}></i>
                                </Button>
                            </Tooltip>
                        </div>
                        <div className="mx-2">
                            <Tooltip
                                title="Upload a component"
                                position="right"
                                arrow="true"
                            >
                                 {/*#TODO add a onClick on this upload button*/}
                                <Button
                                    size={componentInfo.info.texts.component.header.uploadButton.size}
                                    color={componentInfo.info.texts.component.header.uploadButton.color}
                                >
                                    <i className={componentInfo.info.texts.component.header.uploadButton.icon}></i>
                                </Button>
                            </Tooltip>
                        </div>
                        <Modal
                            isOpen={this.state.triggerAddComponent}
                            autoFocus={false}
                            toggle={() => this.setTriggerAddComponent(false)}
                            className={"custom-modal-dialog sm:c-m-w-70 md:c-m-w-60 lg:c-m-w-50 xl:c-m-w-40"}
                        >
                            <ComponentEdit
                                component={this.state.tmpComponent}
                                patterns={this.props.patterns}
                                edit={(component) => this.editComponent(component)}
                                save={(component) => this.saveComponent(component)}
                                close={() => this.setTriggerAddComponent(false)}
                                {...componenteditinfo}
                            />
                        </Modal>
                    </div>
                </div>
                <div className="overflow-auto max-h-400-px pt-3 mx-4 mb-4">
                    <ul>
                        {components}
                    </ul>
                </div>
            </div>
            <ComponentInfoOffCanvas
                show={this.state.show}
                handleClose={this.handleClose}
                component={this.state.componentToShow}
            />
        </>);
    }
}