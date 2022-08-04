import React, { useState } from "react";
import librariesviewsinfo from "../../_texts/custom/librariesviewinfo";
import { Tooltip } from "react-tippy";
import Button from "../Elements/Button";
import { Modal } from "reactstrap";
import ModalLibrary from "./ModalLibrary";

function LibraryView(props) {
  const [triggerAddLibrary, setTriggerAddLibrary] = useState(false);

  function selectLibrary(id) {
    if (props.libraries[id] !== props.selectedLibrary) {
      props.setSelectedLibrary(id);
    } else {
      props.setSelectedLibrary(null);
    }
  }

  function deleteLibrary(i) {
    props.deleteLibrary(props.libraries[i].name);
  }

  const tmp_libraries = [];
  let libraryClass = "";
  for (let i = 0; i < props.libraries.length; i++) {
    libraryClass = "border-b-1 text-blueGray-700 text-lg p-3 cursor-pointer";
    if (i === 0) libraryClass += " border-t-1";
    if (props.libraries[i] === props.selectedLibrary) {
      libraryClass += " bg-blueGray-200 hover:bg-blueGray-300";
    } else libraryClass += "  hover:bg-blueGray-100";

    tmp_libraries.push(
      <li key={i} className={libraryClass} onClick={() => selectLibrary(i)}>
        {props.libraries[i].name}
        {!props.libraries[i].default && (
          <>
            <div className="float-right">
              <Tooltip html="delete" position="top" arrow="true">
                <Button
                  size={librariesviewsinfo.info.deleteLibrary.size}
                  color={librariesviewsinfo.info.deleteLibrary.color}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLibrary(i);
                  }}
                >
                  <i className={librariesviewsinfo.info.deleteLibrary.icon} />
                </Button>
              </Tooltip>
            </div>
          </>
        )}
      </li>
    );
  }

  return (
    <div className="px-3 pb-3 w-4/12 relative flex flex-col min-w-library break-words bg-white rounded shadow-md h-fit mb-5">
      <div className="flex flex-wrap justify-between p-4 text-center">
        <div>
          <i className={librariesviewsinfo.info.icon + " align-middle pr-4"}></i>
          <span className="fs-4 font-bold text-blueGray-500 align-middle">
            {librariesviewsinfo.info.title}
          </span>
        </div>

        <div className="">
          <Tooltip title="Add a library" position="right" arrow="true">
            <Button
              size={librariesviewsinfo.info.addLibrary.size}
              color={librariesviewsinfo.info.addLibrary.color}
              onClick={() => setTriggerAddLibrary(true)}
            >
              <i className={librariesviewsinfo.info.addLibrary.icon}></i>
            </Button>
          </Tooltip>
          <Modal
            isOpen={triggerAddLibrary}
            autoFocus={false}
            toggle={() => setTriggerAddLibrary(false)}
            className={"modal-dialog-centered"}
          >
            <ModalLibrary
              // Can be a future feature
              // components={props.components}
              addLibrary={(libraryName, componentsName) =>
                props.addLibrary(libraryName, componentsName)
              }
              close={() => setTriggerAddLibrary(false)}
            />
          </Modal>
        </div>
      </div>
      <div className="overflow-auto max-h-400-px mt-3 mx-4 mb-4">
        <ul>{tmp_libraries}</ul>
      </div>
    </div>
  );
}

export default LibraryView;
