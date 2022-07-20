import React, {useEffect, useCallback} from 'react'
import {useSocket} from "../../../contexts/SocketProvider";

function SocketDeleteComponent(props) {
    const socket = useSocket()

    const componentIsDeleted = useCallback(() => {
        props.componentIsDeleted()
        socket.off('component-deleted')
    }, [socket]);

    useEffect(() => {
        if (socket == null) return

        if (props.triggerDelete) {
            props.setTriggerDelete(false)
            socket.emit('delete-component', {"name": props.componentToDelete.name, "library_name": props.library});
            socket.on('component-deleted', componentIsDeleted)
        }

    }, [props, componentIsDeleted, socket]);

    return (<></>);
}

export default SocketDeleteComponent;