import React, {useEffect, useCallback} from 'react'
import {useSocket} from "../../../contexts/SocketProvider";

function SocketSaveComponent(props) {

    const socket = useSocket()

    const componentIsSaved = useCallback(() => {
        props.componentIsSaved()
        socket.off('component-saved')
    }, [socket, props]);

    useEffect(() => {
        if (socket == null) return

        if (props.component !== null && props.triggerSave) {
            props.setTriggerSave(false)
            socket.emit('save-component', {component : props.component});
            socket.on('component-saved', componentIsSaved)
        }

    }, [props, socket, componentIsSaved])

    return (<></>);
}

export default SocketSaveComponent;