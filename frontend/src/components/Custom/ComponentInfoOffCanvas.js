import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import componentInfo from "../../_texts/custom/componentInfo";

function ComponentInfoOffCanvas(props) {

    return (<Offcanvas show={props.show} placement="end" onHide={props.handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{props.component && (<div className="title title-up text-2xl">{props.component.title}</div>)}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            {props.component && (
                <div className="m-auto">

                    <div className="py-3 text-lg text-justify">{props.component.description}</div>
                    <div className="py-3 text-md">
                        <h4 className="font-bold title-up mb-2 inline">{componentInfo.info.texts.info.inputs} : </h4>
                        {props.component.inputs}
                    </div>
                    <div className="py-3 text-md">
                        <h4 className="font-bold title-up mb-2 inline">{componentInfo.info.texts.info.outputs} : </h4>
                        {props.component.outputs}
                    </div>
                    <div className="py-3 text-md">
                        <h4 className="font-bold title-up mb-2 inline">{componentInfo.info.texts.info.assumptions} : </h4>
                        {props.component.assumptions}
                    </div>
                    <div className="py-3 text-md">
                        <h4 className="font-bold title-up mb-2 inline">{componentInfo.info.texts.info.guarantees} : </h4>
                        {props.component.guarantees}
                    </div>
            </div>)}

        </Offcanvas.Body>
      </Offcanvas>)
}

export default ComponentInfoOffCanvas;