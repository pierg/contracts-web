import React from "react";
import { useLocation } from "react-router-dom";

// components
import Contracts from "./Contracts";
// texts as props
import customsidebar from "../../_texts/custom/customsidebar";
import { SocketProvider, ConnectorProvider } from "../../contexts/SocketProvider";
import useLocalStorage from "../../hooks/useLocalStorage";
import Console from "../../components/Custom/Console";
import consoleinfo from "../../_texts/custom/console";
import SocketIoConsoleMessage from "../../components/Custom/Socket/GetConsoleMessage";
import CustomSidebar from "../../components/Custom/CustomSidebar";
import LandingPageContracts from "./LandingPageContracts";
import { useParams } from "react-router";

export default function CustomDashboard() {
  const page = useParams().id;
  const location = useLocation();
  const [id, setId] = useLocalStorage("id");
  const [cookie] = useLocalStorage("cookie");
  const tabId = sessionStorage.tabID
    ? sessionStorage.tabID
    : (sessionStorage.tabID = Math.random());
  let [message, setMessage] = React.useState("");

  function updateMessage(msg) {
    if (message === "") {
      setMessage(msg);
    } else {
      setMessage(message + "\n" + msg);
    }
  }

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <SocketProvider id={id} cookie={cookie} tabId={tabId}>
      <ConnectorProvider setId={setId} />
      <CustomSidebar
        {...customsidebar}
        currentRoute={"#" + location.pathname}
        id={id}
        setId={setId}
        cookie={cookie}
        page={page}
      />
      <Console {...consoleinfo} customText={message} />
      <SocketIoConsoleMessage modifyMessage={(e) => updateMessage(e)} session={id} />
      <div className="relative bg-blueGray-100 min-h-screen">
        {(() => {
          switch (page) {
            case "contracts":
              return <Contracts />;
            case "index":
              return <LandingPageContracts />;
            default:
              return <LandingPageContracts />;
          }
        })()}
      </div>
    </SocketProvider>
  );
}
