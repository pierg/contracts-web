import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardBody,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import LTLTextArea from "./LTLTextArea";

export default function ContractContentEditor({
  items,
  changeParameter,
  deleteContent,
  addContent,
  contractType,
  listOfWorldVariables,
  setLTLWorldValues,
  infos,
}) {
  let changeParameterTmp = (string, key) => {
    let e = {
      target: {
        name: "",
        value: "",
      },
    };
    e.target.name = "ltl";
    e.target.value = string;
    changeParameter(e, contractType, key);
  };

  return (
    <>
      <div>
        <Card className="card-plain">
          <CardBody className="overflow-x-initial">
            <Table responsive>
              <thead>
                <tr>
                  {infos.titles.map((prop, key) => (
                    <th key={key}>{prop}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((prop, key) => (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td className="w-32">
                      <UncontrolledDropdown>
                        <DropdownToggle
                          caret
                          className="btn-round btn-block"
                          color={infos.dropdownColor}
                        >
                          {prop.type}
                        </DropdownToggle>
                        <DropdownMenu>
                          {infos.types.map((infoType, infoTypeKey) => (
                            <DropdownItem
                              key={infoTypeKey}
                              name="type"
                              onClick={(e) =>
                                changeParameter(e, contractType, key, infoType)
                              }
                            >
                              {infoType}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                    {prop.type === "LTL" && (
                      <td className="w-9/12" colSpan={2}>
                        <LTLTextArea
                          value={prop.LTL[0]}
                          name="ltl"
                          placeholder={infos.placeholders.ltl}
                          changeParameter={(string) => changeParameterTmp(string, key)}
                          listOfWorldVariables={listOfWorldVariables}
                          setLTLWorldValues={(values) =>
                            setLTLWorldValues(key, contractType, values)
                          }
                        />
                      </td>
                    )}
                    {prop.type === "PL" && (
                      <td className="w-9/12" colSpan={2}>
                        <div className={"mb-2 mt-2 ml-2 pt-0 relative"}>
                          <input
                            value={prop.PL[0]}
                            type="text"
                            autoComplete="off"
                            placeholder="PL"
                            className={
                              "w-full border-blueGray-300 placeholder-blueGray-200 bg-white rounded-md outline-none border border-solid transition duration-200"
                            }
                            name="pl"
                            onChange={(e) => changeParameter(e, contractType, key)}
                          />
                        </div>
                      </td>
                    )}
                    <td>
                      <Button
                        className="btn-icon"
                        color={infos.deleteButton.color}
                        size="sm"
                        type="button"
                        onClick={() => deleteContent(key, contractType)}
                      >
                        <i className={infos.deleteButton.icon} />
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="5" className="text-center">
                    <Button
                      className="btn-icon"
                      color={infos.addRowButton.color}
                      size="sm"
                      type="button"
                      onClick={() => addContent(contractType)}
                    >
                      <i className={infos.addRowButton.icon} />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

ContractContentEditor.defaultProps = {
  items: [],
  defaultOpened: -1,
  multiple: false,
};

ContractContentEditor.propTypes = {
  // NOTE: if you pass an array for the defaultOpened prop
  // // // then the user will be able to open multiple collapses
  // // // For example, if you want to have only the first
  // // // collapse opened, but the user can open multiple
  // // // then you can pass defaultOpened={[0]}
  // // // otherwise, you can pass defaultOpened={0}
  defaultOpened: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
    })
  ),
  color: PropTypes.oneOf([
    "blueGray",
    "red",
    "orange",
    "amber",
    "emerald",
    "teal",
    "lightBlue",
    "indigo",
    "purple",
    "pink",
  ]),
};
