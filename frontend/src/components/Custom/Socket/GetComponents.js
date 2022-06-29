import React, {useEffect, useCallback} from 'react'
import {useSocket} from "../../../contexts/SocketProvider";

function SocketIoComponents(props) {

    const socket = useSocket()

    const setComponents = useCallback((componentsList) => {
        props.updateComponents(componentsList)
        return () => socket.off('receive-components')
    }, [socket, props])

    useEffect(() => {
        if (socket == null) return

        if (props.triggerComponents) {
            props.setTriggerComponents(false)
            socket.emit('get-components');
            socket.on('receive-components', setComponents)
        }

    }, [props, setComponents, socket]);
    return (<></>);
}

export default SocketIoComponents;