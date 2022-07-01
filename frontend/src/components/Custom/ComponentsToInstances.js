import React, {useState} from "react";
import {Button, ModalBody, ModalFooter} from "reactstrap";


function ComponentsToInstances(props) {
    let [componentsToInstances, setComponentsToInstances] = useState([]);

    const close = () => {
        setComponentsToInstances([])
        props.close()
    }

    const addComponentsToInstances = (component) => {
        let componentsToInstancesTmp = [...componentsToInstances]
        if(componentsToInstancesTmp.includes(component)) {
            componentsToInstancesTmp = componentsToInstancesTmp.filter((e) => e !== component)
        }
        else {
            componentsToInstancesTmp.push(component)
        }
        setComponentsToInstances(componentsToInstancesTmp)
    }

    const addInstances = () => {
        for(let i=0; i<componentsToInstances.length; i++) {
            props.add({...componentsToInstances[i]})
        }
        close()
    }

    let componentsClass = []
    let lineClass
    for (let i = 0; i < props.selectedComponents.length; i++) {
        lineClass="border-b-1 p-2 rounded hover:bg-blueGray-200 text-blueGray-700 hover:text-blueGray-900 cursor-pointer"
        if (i===0) {
            lineClass+=" border-t-1"
        }
        if (componentsToInstances.includes(props.selectedComponents[i])) {
            lineClass+=" bg-blueGray-100 font-bold"
        }
        componentsClass.push(lineClass)
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
                <h4 className="fs-5 font-bold title-up">Add instance(s)</h4>
            </div>
            <ModalBody>
                <div
                    className="fs-6 mb-2"
                >
                    Select one or more components
                </div>
                <div className="overflow-auto max-h-400-px mx-4 mb-4">
                    <ul>
                        {
                            componentsClass.map((prop,key) => {
                                return(
                                    <li
                                        key={key}
                                        className={prop}
                                        onClick={() => addComponentsToInstances(props.selectedComponents[key])}
                                    >
                                        <div className="flex justify-between" >
                                            <div>
                                               {props.selectedComponents[key].name}
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
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
                            onClick={addInstances}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </ModalFooter>
        </>
    );
}

export default ComponentsToInstances;