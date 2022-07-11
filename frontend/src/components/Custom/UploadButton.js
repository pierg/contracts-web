import React, {useEffect, useState} from 'react'
import {useFilePicker} from "use-file-picker";
import componentInfo from "../../_texts/custom/componentInfo";
import Button from "../../components/Elements/Button";

function UploadButton(props) {
    const [openFileSelector, { filesContent}] = useFilePicker({
        readAs: 'DataURL',
        accept: '.json',
        multiple: false,
        limitFilesConfig: { max: 1 },
    });
    const [saved,setSaved] = useState(false)
    const [previousContent, setPreviousContent] = useState(null)

    useEffect(() => {
         if (filesContent[0] && (!saved || previousContent !== filesContent[0])) {
             props.upload(atob(filesContent[0].content.split(",")[1]))
             setSaved(true)
             setPreviousContent(filesContent[0])
        }
    }, [props, saved, filesContent, previousContent])


    return (<Button
                size={componentInfo.info.texts.component.header.uploadButton.size}
                color={componentInfo.info.texts.component.header.uploadButton.color}
                onClick={() => openFileSelector()}
            >
                <i className={componentInfo.info.texts.component.header.uploadButton.icon}></i>
            </Button>);
}

export default UploadButton;