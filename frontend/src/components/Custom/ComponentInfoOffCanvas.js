import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';

function ComponentInfoOffCanvas(props) {

    return (<Offcanvas show={props.show} placement="end" onHide={props.handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Info</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <div>
                <div>{props.component}</div>
            </div>
        </Offcanvas.Body>
      </Offcanvas>)
}

export default ComponentInfoOffCanvas;