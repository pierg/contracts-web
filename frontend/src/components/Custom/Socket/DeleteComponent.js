import React, {useEffect, useCallback} from 'react'
import {useSocket} from "../../../contexts/SocketProvider";

function SocketDeleteComponent(props) {
    const socket = useSocket()

    const componentIsDeleted = useCallback(() => {
        props.componentIsDeleted()
        socket.off('component-deleted')
    }, [props, socket]);

    useEffect(() => {
        if (socket == null) return

        if (props.triggerDelete) {
            props.setTriggerDelete(false)
            console.log(props)
            socket.emit('delete-component', {"name": props.componentToDelete.name, "library_name": props.library.name});
            socket.on('component-deleted', componentIsDeleted)
        }

    }, [props, componentIsDeleted, socket]);

    return (<></>);
}

export default SocketDeleteComponent;