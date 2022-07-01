import React from "react";
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
import newvalueinfo from "../../_texts/custom/newvalueinfo";

function NewValueEditor(props) {

    const handleChangeWhiteSpace = (e) => {
        if (e.target.value.includes(" ")) {
          e.target.value = e.target.value.replace(/ /g, "");
        }
    }

    return (
        <>
            <div>
                <Card className="card-plain">
                    <CardBody className="overflow-x-initial">
                        <Table responsive>
                            <thead>
                            <tr>
                                {newvalueinfo.infos.titles.map((prop, key) => (
                                    <th key={key}>{prop}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {props.items.map((prop, key) => (
                                <tr key={key}>
                                    <td>{key + 1}</td>
                                    <td className="w-32">
                                        <UncontrolledDropdown>
                                            <DropdownToggle
                                                caret
                                                className="btn-round btn-block"
                                                color={newvalueinfo.infos.dropdownColor}
                                            >
                                                {prop.type}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                {newvalueinfo.infos.types.map((infoType, infoTypeKey) => (
                                                    <DropdownItem
                                                        key={infoTypeKey}
                                                        name="valueType"
                                                        onClick={(e) =>
                                                            props.changeParameter(e, false, key, infoType, props.type)
                                                        }
                                                    >
                                                        {infoType}
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </td>
                                    <td className="w-8/12" colSpan={2}>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            className={"w-full placeholder-blueGray-200 bg-white rounded-md outline-none border border-solid transition duration-200"}
                                            name="valueName"
                                            onChange={(e) => {handleChangeWhiteSpace(e); props.changeParameter(e, false, key,false ,props.type)}}
                                          />
                                    </td>
                                    <td colSpan="5" className="text-center">
                                        <Button
                                            className="btn-icon"
                                            color={newvalueinfo.infos.deleteButton.color}
                                            size="sm"
                                            type="button"
                                            onClick={() => props.deleteValue(props.type,key)}
                                        >
                                            <i className={newvalueinfo.infos.deleteButton.icon}/>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <Button
                                        className="btn-icon"
                                        color={newvalueinfo.infos.addRowButton.color}
                                        size="sm"
                                        type="button"
                                        onClick={() => props.addValue(props.type)}
                                    >
                                        <i className={newvalueinfo.infos.addRowButton.icon}/>
                                    </Button>
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        </>)
}

export default NewValueEditor;