import {useSocket} from "../../../contexts/SocketProvider";
import {useCallback, useEffect} from "react";
import {saveAs} from 'file-saver';

function SocketDownloadComponent(props){
    const socket = useSocket()

    const componentFile = useCallback((components)=>{
        socket.off('components-downloaded')
        if (components === null) return
        if (components === []) return
        for (let i  = 0; i < components.length; i++){
            const blob = new Blob([components[i]["file"]], {
                        type: "text/plain;charset=utf-8"
                        })
            saveAs(blob, components[i]["name"]+".txt")
        }
    },[socket] )

    useEffect(() => {
        if (socket == null) return
        if (props.triggerDownload){
            props.setTriggerDownload(false)
            socket.emit('download-components', {names: props.componentsToDownloads, library_name : props.library.name,
                                                is_default: props.isDefault})
            socket.on('components-downloaded', componentFile)
        }
    }, [props, socket, componentFile])

    return(<></>);
}

export default SocketDownloadComponent;
