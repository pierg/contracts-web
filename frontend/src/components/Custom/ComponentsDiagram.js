import React from "react";
import componentInfo from "../../_texts/custom/componentInfo";
import Diagram, {useSchema, createSchema} from 'beautiful-react-diagrams';
import "beautiful-react-diagrams/styles.css";
import {Tooltip} from "react-tippy";
import Button from "../Elements/Button";

function ComponentsDiagram(props) {

    const CustomInstance = (instance) => {
        let inputs = []
        for(let i=0;i<instance.inputs.length;i++) {
            inputs.push(
                <div
                    key={"i-"+i}
                    className="flex flex-row"
                >
                    <div>
                        {instance.inputs[i].props.id.split("__")[1]}
                    </div>
                    <div
                        className="pl-1"
                    >
                        {"("+instance.inputs[i].props.id.split("__")[2]+")"}
                    </div>
                </div>
            )
        }

        let outputs = []
        for(let i=0;i<instance.outputs.length;i++) {
            outputs.push(
                <div
                    key={"o-"+i}
                    className="flex flex-row"
                >
                    <div>
                        {instance.outputs[i].props.id.split("__")[1]}
                    </div>
                    <div
                        className="pl-1"
                    >
                        {"("+instance.outputs[i].props.id.split("__")[2]+")"}
                    </div>
                </div>
            )
        }
        return (
            <div style={{ background: '#DAE1E7'}} className="border rounded-xl border-blueGray-400">
                <div
                    className="text-center fs-4 border-b-1 border-blueGray-500"
                    style={{ padding: '10px'}}
                >
                    {instance.content}
                </div>
                <div
                    className="flex flex-row justify-evenly p-2"
                >
                    <div
                        className="flex-col"
                    >
                        <div
                            className="fs-6 pb-1"
                        >
                            INPUTS
                        </div>
                        {inputs}
                    </div>

                    <div className="border-1 border-blueGray-400"></div>

                    <div
                        className="flex-col"
                    >
                        <div
                            className="fs-6 pb-1"
                        >
                            OUTPUTS
                        </div>
                        {outputs}
                    </div>
                </div>
            </div>
        )
    }

    const CustomUniquePort = (port) => {
        let instance = port.inputs[0].props.id.split("_")[1].split("-")[0]
        let nbVar
        let rows = []
        for(let i=0; i<port.inputs.length; i++) {
            nbVar = port.inputs[i].props.id.split("_")[1].split("-")[2]
            if(parseInt(port.inputs[i].props.id.split("_")[1].split("-")[1]) === 1) {
                rows.push(
                    <div
                        key={i}
                        className="w-100 text-center"
                    >
                        {props.instances[instance].inputs[nbVar].name}
                    </div>
                )
            }
            else {
                rows.push(
                    <div
                        key={i}
                        className="w-100 text-center"
                    >
                        {props.instances[instance].outputs[nbVar].name}
                    </div>
                )
            }
        }

        return (
            <div className="border rounded-xl border-blueGray-400 bg-pink-200">
                <div
                    className="text-center font-bold fs-6 border-b-1 border-blueGray-400"
                    style={{ padding: '10px'}}
                >
                    {port.content}
                </div>
                <div
                    className="flex flex-col my-2"
                >
                    {rows}
                </div>
            </div>
        );
    };

    const CustomPort = (port) => {
        let rows = []
        let instance
        let nbVar

        for(let i=0; i<port.inputs.length; i++) {
            rows[i] = []
            instance = port.inputs[i].props.id.split("_")[1].split("-")[0]
            nbVar = port.inputs[i].props.id.split("_")[1].split("-")[2]
            if(parseInt(port.inputs[i].props.id.split("_")[1].split("-")[1]) === 1) {
                rows[i][0] = props.instances[instance].inputs[nbVar].name
            }
            else {
                rows[i][0] = props.instances[instance].outputs[nbVar].name
            }
        }

        for(let i=0; i<port.outputs.length; i++) {
            instance = port.outputs[i].props.id.split("_")[1].split("-")[0]
            nbVar = port.outputs[i].props.id.split("_")[1].split("-")[2]
            if(!Array.isArray(rows[i])) {
                rows[i] = []
                rows[i][0] = "empty"
            }
            if(parseInt(port.outputs[i].props.id.split("_")[1].split("-")[1]) === 1) {
                rows[i][1] = props.instances[instance].inputs[nbVar].name
            }
            else {
                rows[i][1] = props.instances[instance].outputs[nbVar].name
            }
        }

        let colPortInput = []
        let colNameInput = []
        let colNameOutput = []
        let colPortOutput = []
        let marginBottom = 10
        for(let i=0; i<rows.length; i++) {
            if(rows[i].length === 1) {
                rows[i][1] = "empty"
            }
            if(i === rows.length-1) {
                marginBottom = 0
            }
            if(rows[i][0] !== "empty") {
                colPortInput.push(
                    React.cloneElement(port.inputs[i],
                        {
                            style: { width: '30px', height: '25px', background: 'rgba(0, 0, 0, 0.08)', marginBottom: marginBottom+'px' }
                        }
                    )
                )
                colNameInput.push(
                    <div
                        key={i+"-inputName"}
                        style={{height: '25px', marginLeft: '5px', marginRight: '20px', marginBottom: marginBottom+'px' }}
                    >
                        {rows[i][0]}
                    </div>
                )
            }
            else {
                colPortInput.push(
                    <div
                        key={i+"-inputPort"}
                        style={{height: '25px', marginBottom: marginBottom+'px'}}
                    >

                    </div>
                )
                colNameInput.push(
                    <div
                        key={i+"-inputName"}
                        style={{height: '25px', marginBottom: marginBottom+'px'}}
                    >

                    </div>
                )
            }

            if(rows[i][1] !== "empty") {
                colNameOutput.push(
                    <div
                        key={i+"-outputName"}
                        style={{height: '25px', marginRight: '5px', marginBottom: marginBottom+'px' }}
                    >
                        {rows[i][1]}
                    </div>
                )
                colPortOutput.push(
                    React.cloneElement(port.outputs[i],
                        {
                            style: { width: '30px', height: '25px', background: 'rgba(0, 0, 0, 0.08)', marginBottom: marginBottom+'px' }
                        }
                    )
                )
            }
            else {
                colNameOutput.push(
                    <div
                        key={i+"-outputPort"}
                        style={{height: '25px', marginBottom: marginBottom+'px'}}
                    >

                    </div>
                )
                colPortOutput.push(
                    <div
                        key={i+"-outputName"}
                        style={{height: '25px', marginBottom: marginBottom+'px'}}
                    >

                    </div>
                )
            }
        }

        return (
            <div className="border rounded-xl border-blueGray-400 bg-lightBlue-200">
                <div
                    className="text-center font-bold fs-6 border-b-1 border-blueGray-400"
                    style={{ padding: '10px'}}
                >
                    {port.content}
                </div>
                <div
                    className="flex flex-row my-2"
                >
                    <div
                        className="flex-col"
                    >
                        {colPortInput}
                    </div>
                    <div
                        className="flex-col w-50"
                    >
                        {colNameInput}
                    </div>
                    <div
                        className="flex-col w-50 text-right"
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

    let distancePos = 200
    let cptDoubleLink = 0
    for(let i=0;i<props.instances.length;i++) {

    }
    if(props.instances.length < 4) {
        distancePos = 300
    }

    let nodes = []
    let node
    let put
    for(let i=0;i<props.instances.length;i++) {
        node = {}
        node.id = "instance"+i
        node.content = props.instances[i].name
        node.coordinates = [50+(i%4)*distancePos, 130+(Math.floor(i/4))*300]
        node.inputs = []
        for(let j=0;j<props.instances[i].inputs.length;j++) {
            put = {}
            put.id = j+"__"+props.instances[i].inputs[j].name+"__"+props.instances[i].inputs[j].type
            node.inputs.push(put)
        }
        node.outputs = []
        for(let j=0;j<props.instances[i].outputs.length;j++) {
            put = {}
            put.id = j+"__"+props.instances[i].outputs[j].name+"__"+props.instances[i].outputs[j].type
            node.outputs.push(put)
        }
        node.render = CustomInstance
        nodes.push(node)
    }

    let links = []
    let link = {}
    let portIn
    let portOut

    for(let i=0;i<props.connections.length;i++) {
        //create node who contain ports
        node = {}
        node.id = "port"+i
        node.content = props.connections[i].name
        if(props.connections[i].boolUniquePort) {
            node.coordinates = [10+(i%4)*distancePos, 10+(Math.floor(i/4))*300]
            node.inputs = []
            portIn = props.connections[i].connectors[0].split("-")[0]
            for(let j=0;j<props.connections[i].connectors.length;j++) {
                put = {}
                put.id = "port_"+props.connections[i].connectors[j].split(" ")[0]
                node.inputs.push(put)
            }
            node.render = CustomUniquePort
        }
        else {
            node.coordinates = [200+(cptDoubleLink%4)*distancePos, 300+(Math.floor(cptDoubleLink/4))*300]
            node.inputs = []
            node.outputs = []
            portIn = props.connections[i].connectors[0].split("-")[0]
            for(let j=0;j<props.connections[i].connectors.length;j++) {
                put = {}
                put.id = "port_"+props.connections[i].connectors[j].split(" ")[0]
                if(portIn === props.connections[i].connectors[j].split("-")[0]) {
                    put.alignment = "left"
                    node.inputs.push(put)
                }
                else {
                    put.alignment = "right"
                    node.outputs.push(put)
                }
            }
            node.render = CustomPort
            cptDoubleLink++
        }
        nodes.push(node)

        //create link between instance and ports
        if(props.connections[i].boolUniquePort) {
            link = {}
            link.input = "instance"+portIn
            link.output = "port"+i
            link.className = "stroke-uniquePort"
            link.readonly = true
            links.push(link)
        }
        else {
            for(let j=0;j<props.connections[i].connectors.length;j++) {
                link = {}
                if(portIn === props.connections[i].connectors[j].split("-")[0]) {
                    link.input = "instance"+portIn
                    link.output = "port_"+props.connections[i].connectors[j].split(" ")[0]
                    link.className = "stroke-dualPort"
                    link.readonly = true
                    links.push(link)
                }
                else {
                    portOut = props.connections[i].connectors[j].split("-")[0]
                    link.input = "port_"+props.connections[i].connectors[j].split(" ")[0]
                    link.output = "instance"+portOut
                    link.className = "stroke-dualPort"
                    link.readonly = true
                    links.push(link)
                }
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

        return (<div className="h-500-px">
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