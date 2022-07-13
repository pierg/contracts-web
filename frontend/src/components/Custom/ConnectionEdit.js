import React, {useState} from "react";
import {Button, ModalBody, ModalFooter} from "reactstrap";
import Input from "../Elements/Input";


function ConnectionEdit(props) {
    let [name, setName] = useState("");

    const close = () => {
        setName("")
        props.close()
    }

    const testFunction = (e) => {
        setName(e.target.value)
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
                <h4 className="fs-5 font-bold title-up">Create connection</h4>
            </div>
            <ModalBody>
                <Input
                    type="text"
                    placeholder="Name of the connection"
                    name="name"
                    value={name}
                    onChange={(e) => testFunction(e)}
                />
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
                            onClick={() => props.add(name)}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </ModalFooter>
        </>
    );
}

export default ConnectionEdit;