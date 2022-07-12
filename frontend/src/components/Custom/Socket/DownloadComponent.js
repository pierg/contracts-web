import {useSocket} from "../../../contexts/SocketProvider";
import {useCallback, useEffect} from "react";
import {saveAs} from 'file-saver';

function SocketDownloadComponent(props){
    const socket = useSocket()

    const componentFile = useCallback((components)=>{
        if (components === null) return
        if (components === []) return
        for (let i  = 0; i < components.length; i++){
            const blob = new Blob([components[i]["file"]], {
                        type: "text/plain;charset=utf-8"
                        })
            saveAs(blob, components[i]["name"]+".txt")
        }
        return () => socket.off('components-downloaded')
    },[socket] )

    useEffect(() => {
        if (socket == null) return

        if (props.triggerDownload){
            props.setTriggerDownload(false)
            socket.emit('download-components', {names: props.componentsToDownloads})
            socket.on('components-downloaded', componentFile)
        }
    }, [props, socket, componentFile])

    return(<></>);
}

export default SocketDownloadComponent;
