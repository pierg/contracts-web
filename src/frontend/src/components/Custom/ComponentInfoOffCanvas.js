import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import componentInfo from "../../_texts/custom/componentInfo";

function ComponentInfoOffCanvas(props) {
  let inputs = [];
  let outputs = [];
  let assumptions = [];
  let guarantees = [];
  if (props.component) {
    for (let i = 0; i < props.component.inputs.length; i++) {
      inputs.push(
        <div className="pb-2" key={"inputs" + i}>
          {props.component.inputs[i].name + " (" + props.component.inputs[i].type + ")"}
        </div>
      );
    }
    for (let i = 0; i < props.component.outputs.length; i++) {
      outputs.push(
        <div className="pb-2" key={"outputs" + i}>
          {props.component.outputs[i].name +
            " (" +
            props.component.outputs[i].type +
            ")"}
        </div>
      );
    }

    console.log(props.component.assumptions.LTL.toString());

    assumptions = (
      <div style={{ lineHeight: "1.5rem" }}>
        {"LTL : " + props.component.assumptions.LTL.toString().replaceAll(",", ", ")}
        <br></br>
        {"PL : " + props.component.assumptions.PL.toString().replaceAll(",", ", ")}
      </div>
    );
    guarantees = (
      <div style={{ lineHeight: "1.5rem" }}>
        {"LTL : " + props.component.guarantees.LTL.toString().replaceAll(",", ", ")}
        <br></br>
        {"PL : " + props.component.guarantees.PL.toString().replaceAll(",", ", ")}
      </div>
    );
  }

  return (
    <Offcanvas
      show={props.show}
      placement="end"
      className="pl-3"
      onHide={props.handleClose}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {props.component && (
            <div className="title title-up text-2xl">{props.component.name}</div>
          )}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {props.component && (
          <div className="m-auto">
            <div className="py-3 text-md text-justify">
              {props.component.description}
            </div>
            <div className="py-3 text-md">
              <h4 className="font-bold title-up mb-2 inline">
                {componentInfo.info.texts.info.inputs} :{" "}
              </h4>
              <div className="pl-2 pt-2">{inputs}</div>
            </div>
            <div className="py-3 text-md">
              <h4 className="font-bold title-up mb-2 inline">
                {componentInfo.info.texts.info.outputs} :{" "}
              </h4>
              <div className="pl-2 pt-2">{outputs}</div>
            </div>
            <div className="py-3 text-md">
              <h4 className="font-bold title-up mb-2 inline">
                {componentInfo.info.texts.info.assumptions} :{" "}
              </h4>
              <div className="pl-2 pt-2">{assumptions}</div>
            </div>
            <div className="py-3 text-md">
              <h4 className="font-bold title-up mb-2 inline">
                {componentInfo.info.texts.info.guarantees} :{" "}
              </h4>
              <div className="pl-2 pt-2">{guarantees}</div>
            </div>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default ComponentInfoOffCanvas;
