import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import componentInfo from "../../_texts/custom/componentInfo";

function ComponentInfoOffCanvas(props) {
    let inputs = []
    let outputs = []
    let assumptions = []
    let guarantees = []
    if (props.component) {
        for (let i=0; i<props.component.inputs.length; i++) {
            inputs.push(<div key={"inputs"+i}>{props.component.inputs[i].name + " (" + props.component.inputs[i].type+")"}</div>)
        }
        for (let i=0; i<props.component.outputs.length; i++) {
            outputs.push(<div key={"outputs"+i}>{props.component.outputs[i].name + " (" + props.component.outputs[i].type+")"}</div>)
        }

        assumptions = <div>{"LTL : "+props.component.assumptions.LTL}<br></br>{"PL : "+props.component.assumptions.PL }</div>
        guarantees = <div>{"LTL : "+props.component.guarantees.LTL}<br></br>{"PL : "+props.component.guarantees.PL }</div>
    }

    return (<Offcanvas show={props.show} placement="end" onHide={props.handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{props.component && (<div className="title title-up text-2xl">{props.component.name}</div>)}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            {props.component && (
                <div className="m-auto">

                    <div className="py-3 text-lg text-justify">{props.component.description}</div>
                    <div className="py-3 text-md">
                        <h4 className="font-bold title-up mb-2 inline">{componentInfo.info.texts.info.inputs} : </h4>
                        {inputs}
                    </div>
                    <div className="py-3 text-md">
                        <h4 className="font-bold title-up mb-2 inline">{componentInfo.info.texts.info.outputs} : </h4>
                        {outputs}
                    </div>
                    <div className="py-3 text-md">
                        <h4 className="font-bold title-up mb-2 inline">{componentInfo.info.texts.info.assumptions} : </h4>
                        {assumptions}
                    </div>
                    <div className="py-3 text-md">
                        <h4 className="font-bold title-up mb-2 inline">{componentInfo.info.texts.info.guarantees} : </h4>
                        {guarantees}
                    </div>
            </div>)}

        </Offcanvas.Body>
      </Offcanvas>)
}

export default ComponentInfoOffCanvas;