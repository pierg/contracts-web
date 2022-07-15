import React from 'react';
import librariesviewsinfo from "../../_texts/custom/librariesviewinfo";
import {Tooltip} from "react-tippy";
import Button from "../Elements/Button";
import componentInfo from "../../_texts/custom/componentInfo";

function LibraryView(props) {

    const [selectedRow, setSelectedRow] = React.useState(null)

    function selectLibrary(id) {
        if (id !== selectedRow)
            setSelectedRow(id)
        else
            setSelectedRow(null)
    }

    function deleteLibrary(i) {
        props.deleteLibrary(props.libraries[i].name)
    }

    const tmp_libraries = []
    let libraryClass = ""
    console.log(props.libraries)
    for (let i = 0; i < props.libraries.length; i++) {

        libraryClass = "border-b-1 text-blueGray-700 text-lg p-3 cursor-pointer"
        if (i === 0) libraryClass += " border-t-1"
        if (i === selectedRow) {
            libraryClass += " bg-blueGray-200 hover:bg-blueGray-300"
        } else
            libraryClass += "  hover:bg-blueGray-100"

        tmp_libraries.push(
            <li key={i} className={libraryClass}
                               onClick={() => selectLibrary(i)}>{props.libraries[i].name}
                {
                    !props.libraries[i].default &&
                    <>
                    <div className="float-right">
                        <Tooltip
                            html="delete"
                            position="top"
                            arrow="true"
                        >
                            <Button size={librariesviewsinfo.info.deleteLibrary.size}
                                    color={librariesviewsinfo.info.deleteLibrary.color} onClick={(e) => {
                                e.stopPropagation();
                                deleteLibrary(i)
                            }}>
                                <i className={librariesviewsinfo.info.deleteLibrary.icon}/>
                            </Button>
                        </Tooltip>
                    </div>
                    </>
                }
            </li>)
    }

    return (
        <div className="px-3 w-4/12 relative flex flex-col min-w-0 break-words bg-white rounded shadow-md h-fit">
            <div className="flex justify-between p-4 text-center">
                <span className="fs-4 font-bold text-blueGray-500">{librariesviewsinfo.info.title}</span>
                <div className="mx-2">
                    <Tooltip
                        title="Add a library"
                        position="right"
                        arrow="true"
                    >
                        <Button
                            size={librariesviewsinfo.info.addLibrary.size}
                            color={librariesviewsinfo.info.addLibrary.color}
                        >
                            <i className={librariesviewsinfo.info.addLibrary.icon}></i>
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <div className="overflow-auto max-h-400-px mt-3 mx-4 mb-4">
                <ul>
                    {tmp_libraries}
                </ul>
            </div>
        </div>
    );
}

export default LibraryView;