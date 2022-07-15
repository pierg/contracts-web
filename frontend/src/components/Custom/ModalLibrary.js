import React from "react";
import {Button, ModalBody, ModalFooter} from "reactstrap";
import Input from "../Elements/Input";


function ModalLibrary(props) {
    const [name,setName] = React.useState("");
    const [components,setComponents] = React.useState([]);

    const close = () => {
        props.close()
    }

    const addLibrary = () => {
        props.addLibrary(name, components)
        setName("")
        setComponents([])
        close()
    }

    const clickComponent = (name) => {
        let tmpComponents = [...components]
        if (tmpComponents.includes(name)) {
            tmpComponents = tmpComponents.filter((e) => e !== name)
        }
        else {
            tmpComponents.push(name)
        }
        setComponents(tmpComponents)
    }

    return (
        <>
            <div className="modal-header justify-content-center">
                <button
                    aria-hidden={true}
                    className="close"
                    type="button"
                    onClick={close}
                >
                    <i className="now-ui-icons ui-1_simple-remove"/>
                </button>
                <h4 className="fs-5 font-bold title-up">Add a library</h4>
            </div>
            <ModalBody>
                <Input
                    type="text"
                    placeholder="Library's name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="mb-2 text-center">
                    <div className="fs-6">
                        Available components
                    </div>
                    <div className="border-2 w-fit m-auto">
                        {
                            props.components.map((prop,key) => {
                                let classBorder = ""
                                if(components.includes(prop.name)) {
                                    classBorder = " bg-blueGray-100 font-bold"
                                }
                                return (
                                    <div
                                        key={key}
                                        className={"border-b-1 px-4 rounded text-blueGray-700 hover:bg-blueGray-200 hover:text-blueGray-900 cursor-pointer"+classBorder}
                                        onClick={() => clickComponent(prop.name)}
                                    >
                                        {prop.name}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="flex flex-col w-full">
                    <div className="flex w-full justify-between">
                        <Button
                            color="danger"
                            onClick={close}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="info"
                            onClick={addLibrary}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </ModalFooter>
        </>
    );
}

export default ModalLibrary;