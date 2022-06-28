import React from "react";
import componentInfo from "../../_texts/custom/componentInfo";
import Diagram, {useSchema, createSchema} from 'beautiful-react-diagrams';
import "beautiful-react-diagrams/styles.css";
import {Tooltip} from "react-tippy";
import Button from "../Elements/Button";

function ComponentsDiagram(props) {

    const initialSchema = createSchema({nodes: props.nodes, links: props.link});


    const UncontrolledDiagram = () => {
        // create diagrams schema
        const [schema, {onChange}] = useSchema(initialSchema);

        return (<div className="h-400-px">
            <Diagram schema={schema} onChange={onChange} className="border-none"/>
        </div>);
    };


    return (<>
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
    </>);
}

export default ComponentsDiagram;