import React from "react";
import componentInfo from "../../_texts/custom/componentInfo";
import ComponentEdit from "./ComponentEdit";
import Button from "../Elements/Button";
import {Modal} from "reactstrap";
import goaleditinfo from "../../_texts/custom/goaleditinfo";
import defaultcomponent from "../../_texts/custom/defaultcomponent";
import {Tooltip} from 'react-tippy';

export default class ComponentsView extends React.Component {

    state = {
        triggerAddComponent: false,
        tmpComponent: false,
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

    checkBoxClicked = (i) => {
        let selected = this.props.selectedComponents
        if (selected.includes(i))
            selected = selected.filter((e) => e!==i)
        else
            selected.push(i)

        this.props.setSelectedComponents(selected)
    }

    clickAddComponent = () => {
        this.setTmpComponent(defaultcomponent)
        this.setTriggerAddComponent(true)
    }

    editComponent = (component) => {
        console.log("edit")
        this.setTmpComponent(component)
    }

    deleteComponent = (i) => {
        console.log(i)
    }

    saveComponent = (component) => {
        console.log(component)
    }

    render() {
        let components = []
        let lineClass = ""
        for (let i = 0; i < this.props.components.length; i++) {
            lineClass="border-b-1 text-lg p-3 rounded hover:bg-blueGray-200 text-blueGray-700 hover:text-blueGray-900 cursor-pointer"
            if (i===0) {
                lineClass+=" border-t-1"
            }
            if (this.props.selectedComponents.includes(i)) {
                lineClass+=" bg-blueGray-100 font-bold"
            }

            components.push(<li key={i} onClick={() => this.checkBoxClicked(i)}
                                    className={lineClass}>
                    <div className="flex justify-between">
                        <div>
                           {" composant_" + this.props.components[i]}
                        </div>
                        <div>
                            <Button size="sm" color="gray" onClick={() => this.editComponent(i)}><i
                                className={componentInfo.info.icon.edit}/></Button>
                            <Button size="sm" color="red" onClick={() => this.deleteComponent(i)}><i
                                className={componentInfo.info.icon.delete}/></Button>
                        </div>
                    </div>
                </li>)
        }

        return (<>
            <div className="px-3 pb-3 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">
                <div className="flex justify-between p-4 text-center">
                    <div className="w-5"></div>
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
                                {...goaleditinfo}
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
        </>);
    }
}