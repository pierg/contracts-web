import {useSocket} from "../../../contexts/SocketProvider";
import {useCallback, useEffect} from "react";


function SocketConnection(props){
    const socket = useSocket()

    const initEntry = () => {
        let splitNameInstance = props.instances[props.connectors[0].split("-")[0]].name.split(" ")
        let instancesNames = {}
        instancesNames[splitNameInstance[0]] = splitNameInstance[1].substring(1, splitNameInstance[1].length-1)
        let entry = true
        for(let i=1; i<props.connectors.length; i++) {
            splitNameInstance = props.instances[props.connectors[i].split("-")[0]].name.split(" ")
            if(!(splitNameInstance[0] in instancesNames)) {
                instancesNames[splitNameInstance[0]] = splitNameInstance[1].substring(1, splitNameInstance[1].length-1)
                entry = false
            }
        }
        return [instancesNames,entry]
    }

    const getConnection = useCallback((connections) => {
        socket.off("receive-possible-connection")
        if (connections){
            console.log(connections)
            //props.setLibraries(libraries)
        }
    }, [/*props, */socket])

    const connectionAdded = useCallback( (done) => {
        socket.off("save-connection-done")
        console.log("DANS RETOUR")
        if (done) {
            let entry = initEntry()[1]
            props.addConnectionDisplay(entry)
        }
    }, [props, socket])

    /*const libraryDeleted = useCallback( (done) => {
        if (done) {
            props.setTriggerLibrary(true)
        }
        return () => socket.off("remove-library-done")
    }, [props, socket])*/

    useEffect(() => {
        if (socket == null) return

        if (props.triggerGetConnection){
            console.log("DANS TRIGGER GET")
            props.setTriggerGetConnection(false)
            let componentNames = []
            componentNames.push(props.selectedComponents[0].name)
            for(let i=1; i<props.selectedComponents.length; i++) {
                if(!(componentNames.includes(props.selectedComponents[i].name))) {
                    componentNames.push(props.selectedComponents[i].name)
                }
            }
            socket.emit("get-possible-connection", {"library_name":props.library.name,"components": componentNames})
            socket.on("receive-possible-connection", getConnection)
        }

        if (props.triggerAddConnection){
            console.log("DANS TRIGGER ADD")
            props.setTriggerAddConnectionSocket(false)
            let instancesNames = initEntry()[0]
            let entry = initEntry()[1]
            socket.emit("save-connection", {"name":props.name,"library_name":props.library.name,"instances":instancesNames,"connections":props.connectors,"entry":entry})
            socket.on("save-connection-done", connectionAdded)
        }

        /*if (props.triggerDelete){
            props.setTriggerDelete(false)
            socket.emit("remove-library", props.libraryToDelete)
            socket.on("remove-library-done", libraryDeleted)
        }*/
    }, [socket, props, getConnection, connectionAdded/*, libraryDeleted*/])
}

export default SocketConnection;