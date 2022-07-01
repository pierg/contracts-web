import React, {useState} from "react";
import {Button, ModalBody, ModalFooter} from "reactstrap";


function ComponentsToInstances(props) {
    const [componentsToInstances, setComponentsToInstances] = useState([]);

    const close = () => {
        setComponentsToInstances([])
        props.close()
    }

    const addComponentsToInstances = (component) => {
        let componentsToInstancesTmp = componentsToInstances
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

    let components = []
    let lineClass="border-b-1 p-2 rounded hover:bg-blueGray-200 text-blueGray-700 hover:text-blueGray-900 cursor-pointer"
    for (let i = 0; i < props.selectedComponents.length; i++) {
        if (i===0) {
            lineClass+=" border-t-1"
        }
        components.push(
            <li
                key={i}
                className={lineClass}
                onClick={() => addComponentsToInstances(props.selectedComponents[i])}
            >
                <div className="flex justify-between" >
                    <div>
                       {props.selectedComponents[i].name}
                    </div>
                </div>
            </li>
        )
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
                        {components}
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