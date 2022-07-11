import React from "react";
import componentInfo from "../../_texts/custom/componentInfo";
import Diagram, {useSchema, createSchema} from 'beautiful-react-diagrams';
import "beautiful-react-diagrams/styles.css";
import {Tooltip} from "react-tippy";
import Button from "../Elements/Button";

function ComponentsDiagram(props) {

    const CustomNode = (instance) => {
        let height = instance.inputs.length * (25+10)
        if(height < instance.outputs.length*(25+10)) {
            height = instance.outputs.length*(25+10)
        }

        let rows = []

        for(let i=0; i<instance.inputs.length; i++) {
            rows[i] = []
            rows[i][0] = props.instances[instance.inputs[i].props.id.split("_")[1].split("-")[0]].inputs[i].name
        }

        for(let i=0; i<instance.outputs.length; i++) {
            if(!Array.isArray(rows[i])) {
                rows[i] = []
                rows[i][0] = "empty"
            }
            rows[i][1] = props.instances[instance.outputs[i].props.id.split("_")[1].split("-")[0]].outputs[i].name
        }

        let colPortInput = []
        let colNameInput = []
        let colNameOutput = []
        let colPortOutput = []
        for(let i=0; i<rows.length; i++) {
            if(rows[i].length === 1) {
                rows[i][1] = "empty"
            }
            console.log("row")
            console.log(i)
            console.log(rows[i])
            console.log(instance.inputs[i])
            if(rows[i][0] !== "empty") {
                colPortInput.push(
                    React.cloneElement(instance.inputs[i],
                        {
                            style: { width: '30px', height: '25px', background: 'rgba(0, 0, 0, 0.08)', marginBottom: '10px' }
                        }
                    )
                )
                colNameInput.push(
                    <div
                        key={i+"-inputName"}
                        style={{height: '25px', marginLeft: '5px', marginRight: '20px', marginBottom: '10px' }}
                    >
                        {rows[i][0]}
                    </div>
                )
            }
            else {
                colPortInput.push(
                    <div
                        key={i+"-inputPort"}
                        style={{height: '25px', marginBottom: '10px'}}
                    >

                    </div>
                )
                colNameInput.push(
                    <div
                        key={i+"-inputName"}
                        style={{height: '25px', marginBottom: '10px'}}
                    >

                    </div>
                )
            }

            if(rows[i][1] !== "empty") {
                colNameOutput.push(
                    <div
                        key={i+"-outputName"}
                        style={{height: '25px', marginRight: '5px', marginBottom: '10px' }}
                    >
                        {rows[i][1]}
                    </div>
                )
                colPortOutput.push(
                    React.cloneElement(instance.outputs[i],
                        {
                            style: { width: '30px', height: '25px', background: 'rgba(0, 0, 0, 0.08)', marginBottom: '10px' }
                        }
                    )
                )
            }
            else {
                colNameOutput.push(
                    <div
                        key={i+"-outputPort"}
                        style={{height: '25px', marginBottom: '10px'}}
                    >

                    </div>
                )
                colPortOutput.push(
                    <div
                        key={i+"-outputName"}
                        style={{height: '25px', marginBottom: '10px'}}
                    >

                    </div>
                )
            }
        }

        console.log(rows)

        return (
            <div style={{ background: '#DAE1E7'}} className="border rounded-xl border-blueGray-400">
                <div
                    className="text-center"
                    style={{ padding: '10px'}}
                >
                    {instance.content}
                </div>
                <div
                    className="flex flex-row"
                >
                    <div
                        className="flex-col"
                    >
                        {colPortInput}
                    </div>
                    <div
                        className="flex-col"
                    >
                        {colNameInput}
                    </div>
                    <div
                        className="flex-col"
                    >
                        {colNameOutput}
                    </div>
                    <div
                        className="flex-col"
                    >
                        {colPortOutput}
                    </div>
                </div>
            </div>
        );
    };

    let nodes = []
    let node
    let put
    for(let i=0;i<props.instances.length;i++) {
        node = {}
        node.id = "instance"+i
        node.content = props.instances[i].name
        node.coordinates = [30+(i%3)*300, 30+(Math.floor(i/3))*200]
        node.inputs = []
        for(let j=0;j<props.instances[i].inputs.length;j++) {
            put = {}
            put.id = "port_"+i+"-1-"+j
            put.alignment = "left"
            //put.content = props.instances[i].inputs.name
            node.inputs.push(put)
        }
        node.outputs = []
        for(let j=0;j<props.instances[i].outputs.length;j++) {
            put = {}
            put.id = "port_"+i+"-2-"+j
            put.alignment = "right"
            node.outputs.push(put)
        }
        node.render = CustomNode
        nodes.push(node)
    }

    let links = []
    let link
    for(let i=0;i<props.connections.length;i++) {
        link = {}
        for(let j=0;j<props.connections[i].connectors[0].length;j++) {
            for(let k=0;k<props.connections[i].connectors[1].length;k++) {
                link.label = props.connections[i].name
                link.input = "port_"+props.connections[i].connectors[0][j].split(" ")[0]
                link.output = "port_"+props.connections[i].connectors[1][k].split(" ")[0]
                links.push(link)
                link = {}
            }
        }
    }

    const initialSchema = createSchema({
        nodes: nodes,
        links: links
    });

    const UncontrolledDiagram = () => {
        // create diagrams schema
        const [schema, {onChange}] = useSchema(initialSchema);

        return (<div className="h-400-px">
            <Diagram schema={schema} onChange={onChange} className="border-none"/>
        </div>);
    };

    return (
        <>
            <div className="flex-col mx-auto pb-5">
                <div className="px-3 pb-3  flex flex-col min-w-0 break-words bg-white rounded shadow-md m-auto">

                    <div className=" flex justify-center text-2xl m-3 ">
                        <div className="flex flex-1 justify-center font-bold text-blueGray-500">
                            {componentInfo.info.texts.diagram}
                        </div>
                        <div className="flex justify-center pr-10">
                            <Tooltip
                                title="Upload a design"
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
                    </div>
                    <div className="flex flex-col justify-center p-3">
                        <div>
                            <UncontrolledDiagram/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ComponentsDiagram;