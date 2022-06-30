import React, {useEffect, useCallback} from 'react'
import {useSocket} from "../../../contexts/SocketProvider";

function SocketSaveComponent(props) {

    const socket = useSocket()

    const componentIsSaved = useCallback(() => {
        
        socket.off('component-saved')
    }, []);

    useEffect(() => {
        if (socket == null) return

        if (props.component !== null && props.triggerSave) {
            props.setTriggerSave(false)
            socket.emit('save-components', {component : props.component});
            socket.on('component-saved', componentIsSaved())
        }

    }, [props, socket])
}

export default SocketSaveComponent;