import {useSocket} from "../../../contexts/SocketProvider";
import {useCallback, useEffect} from "react";

function SocketUploadComponent(props){

    const socket = useSocket()

    const fileUploaded = useCallback((uploadDone) => {
        console.log(uploadDone)
        return () => socket.off('upload-done')
    }, [socket])

    useEffect(() => {
        if (socket == null) return

        if (props.triggerUpload){
            props.setTriggerUpload(false)
            socket.emit('upload-component', props.componentToUpload)
            socket.on('upload-done', fileUploaded)
        }
    }, [props, socket, fileUploaded])
}

export default SocketUploadComponent;