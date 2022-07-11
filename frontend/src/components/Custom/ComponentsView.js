import React from "react";
import componentInfo from "../../_texts/custom/componentInfo";
import ComponentEdit from "./ComponentEdit";
import Button from "../Elements/Button";
import {Modal, Table} from "reactstrap";
import componenteditinfo from "../../_texts/custom/componenteditinfo";
import defaultcomponent from "../../_texts/custom/defaultcomponent";
import {Tooltip} from 'react-tippy';
import { saveAs } from 'file-saver';
import Checkbox from "../Elements/Checkbox";
import ComponentInfoOffCanvas from "./ComponentInfoOffCanvas";

export default class ComponentsView extends React.Component {

    state = {
        triggerAddComponent: false,
        tmpComponent: false,
        componentToShow: null,
        show: false
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
            selected = selected.filter((e) => e !== this.props.components[i])
        else
            selected.push(this.props.components[i])

        this.props.setSelectedComponents(selected)
    }

    clickAddComponent = () => {
        this.setTmpComponent(defaultcomponent)
        this.setTriggerAddComponent(true)
    }

    editComponent = (i) => {
        const component = this.props.components[i]
        const tmpComponent = {
            "name": component.name,
            "description": component.description,
            "inputs": component.inputs,
            "outputs": component.outputs,
            "assumptions": [],
            "guarantees": []
        }
        for (let i = 0; i < component.assumptions.LTL.length; i++) {
            tmpComponent.assumptions.push({LTL: [component.assumptions.LTL[i]], PL: [""], type: "LTL"})
        }
        for (let i = 0; i < component.assumptions.PL.length; i++) {
            tmpComponent.assumptions.push({PL: [component.assumptions.PL[i]], LTL: [""], type: "PL"})
        }
        for (let i = 0; i < component.guarantees.LTL.length; i++) {
            tmpComponent.guarantees.push({LTL: [component.guarantees.LTL[i]], PL: [""], type: "LTL"})
        }
        for (let i = 0; i < component.guarantees.PL.length; i++) {
            tmpComponent.guarantees.push({PL: [component.guarantees.PL[i]], LTL: [""], type: "PL"})
        }
        this.setTmpComponent(tmpComponent)
        this.setTriggerAddComponent(true)
    }

    updateComponent = (component) => {
        this.setTmpComponent(component)
    }

    saveComponent = (component) => {
        this.setTriggerAddComponent(false)
        const tmpComponent = {
            "name": component.name,
            "description": component.description,
            "inputs": component.inputs,
            "outputs": component.outputs,
            "assumptions": {
                'LTL': [],
                'PL': []
            },
            "guarantees": {
                'LTL': [],
                'PL': []
            }
        }

        for (let i = 0; i < component.assumptions.length; i++) {
            if (component.assumptions[i].LTL[0] !== "")
                tmpComponent.assumptions.LTL.push(component.assumptions[i].LTL[0])
            if (component.assumptions[i].PL[0] !== "")
                tmpComponent.assumptions.PL.push(component.assumptions[i].PL[0])
        }

        for (let i = 0; i < component.guarantees.length; i++) {
            if (component.guarantees[i].LTL[0] !== "")
                tmpComponent.guarantees.LTL.push(component.guarantees[i].LTL[0])
            if (component.guarantees[i].PL[0] !== "")
                tmpComponent.guarantees.PL.push(component.guarantees[i].PL[0])
        }

        this.props.saveComponent(tmpComponent)
    }

    deleteComponent = (i) => {

        /*let tmpComponent = this.props.components
        let selected = this.props.selectedComponents

        selected = selected.filter((e) => e!==this.props.components[i])
        tmpComponent.splice(i,1)

        this.props.setSelectedComponents(selected)
        this.props.setComponents(tmpComponent)*/
        this.props.deleteComponent(this.props.components[i])
    }

    downloadComponent = (i) => {
        console.log(this.props.components[i])
        const json = JSON.stringify(this.props.components[i],null,'\t')
        const blob = new Blob([json], {type : "text/json;charset=utf-8"})
        const file = new File([blob], this.props.components[i].name+".json")
        saveAs(file)
    }

    downloadComponents = () => {
        if (this.props.components.length === 0) return
        let components = []
        for (let i = 0; i < this.props.components.length; i++) {
            components.push(this.props.components[i])
        }
        const json = JSON.stringify(components, null, '\t')
        const blob = new Blob([json], {type: "text/json;charset=utf-8"})
        const file = new File([blob], "components.json")
        saveAs(file)
    }

    selectAllComponents = (e) => {
        if (e.target.checked)
            this.props.setSelectedComponents(this.props.components)
        else
            this.props.setSelectedComponents([])
    }


    handleShow = (i) => {
        this.setState({
            componentToShow: this.props.components[i],
            show: true
        })
    }

    handleClose = () => {
        this.setState({
            show: false
        })
    }

    reduceDescription = (input) => {
        if (input.length > 50) {
            input = input.substr(0, 50)+"..."
        }
        return input
    }

    render() {
        let components = []
        let lineClass = ""
        for (let i = 0; i < this.props.components.length; i++) {
            lineClass = "border-b-1 text-lg p-3 rounded hover:bg-blueGray-200 text-blueGray-700 hover:text-blueGray-900 cursor-pointer"
            if (i === 0) {
                lineClass += " border-t-1"
            }
            if (this.props.selectedComponents.includes(this.props.components[i])) {
                lineClass += " bg-blueGray-100 font-bold"
            }

            components.push(<tr key={i} onClick={() => this.lineClicked(i)}
                                className={lineClass}>
                <td className="pr-5">
                    {this.props.components[i].name}

                </td>
                <td >
                    {this.reduceDescription(this.props.components[i].description)}
                </td>
                <td className="text-right">
                    <Button size="sm" color="gray" onClick={(e) => {
                        e.stopPropagation();
                        this.handleShow(i)
                    }}>
                        <i className={componentInfo.info.icon.info}/>
                    </Button>

                    <Button size="sm" color="gray" onClick={(e) => {
                        e.stopPropagation();
                        this.downloadComponent(i)
                    }}>
                        <i className={componentInfo.info.icon.download}/>
                    </Button>

                    <Button size="sm" color="gray" onClick={(e) => {
                        e.stopPropagation();
                        this.editComponent(i)
                    }}>
                        <i className={componentInfo.info.icon.edit}/>
                    </Button>

                    <Button size="sm" color="red" onClick={(e) => {
                        e.stopPropagation();
                        this.deleteComponent(i)
                    }}>
                        <i className={componentInfo.info.icon.delete}/>
                    </Button>
                </td>
            </tr>)
        }

        return (<>
            <div className="px-3 pb-3 w-9/12 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">
                <div className="flex justify-between p-4 text-center">
                    <div><Checkbox onChange={(e) => this.selectAllComponents(e)} label="Select all"/></div>
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
                                title="Download components"
                                position="right"
                                arrow="true"
                            >
                                <Button
                                    size={componentInfo.info.texts.component.header.downloadButton.size}
                                    color={componentInfo.info.texts.component.header.downloadButton.color}
                                    onClick={() => this.downloadComponents()}
                                >
                                    <i className={componentInfo.info.texts.component.header.downloadButton.icon}></i>
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
                                edit={(component) => this.updateComponent(component)}
                                save={(component) => this.saveComponent(component)}
                                close={() => this.setTriggerAddComponent(false)}
                                {...componenteditinfo}
                            />
                        </Modal>
                    </div>
                </div>
                <div className="overflow-auto max-h-400-px pt-3 mx-4 mb-4">
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {components}
                        </tbody>
                    </Table>
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