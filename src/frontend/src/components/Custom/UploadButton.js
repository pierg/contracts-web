import React, { useEffect, useState } from "react";
import { useFilePicker } from "use-file-picker";
import componentInfo from "../../_texts/custom/componentInfo";
import Button from "../../components/Elements/Button";

function UploadButton(props) {
  const [openFileSelector, { filesContent }] = useFilePicker({
    accept: ".txt",
    multiple: false,
    limitFilesConfig: { max: 1 },
  });
  const [save, setSave] = useState(false);
  useEffect(() => {
    if (filesContent[0] && !save) {
      setSave(true);
      props.upload(filesContent[0].content);
    }
  }, [props, save, filesContent]);

  return (
    <Button
      size={componentInfo.info.texts.component.header.uploadButton.size}
      color={componentInfo.info.texts.component.header.uploadButton.color}
      onClick={() => {
        openFileSelector();
        setSave(false);
      }}
      disabled={props.default}
    >
      <i className={componentInfo.info.texts.component.header.uploadButton.icon}></i>
    </Button>
  );
}

export default UploadButton;
