import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useState } from "react"


export const WifiContext = createContext({
  showModal: false,
  wifiDetails: {
    ssid: '',
    password: '',
  },
  showModalHandler: (bool) => {},
  setWifiDetails: (wifiDetails) => {},
});

function WifiContextProvider({ children }) {
    const [showModal, setShowModal] = useState(false);
    const [wifiDetails, setWifiDetails] = useState({
        ssid: '',
        password: '',
    });

    function showModalHandler(showmodal) {
        setShowModal(showmodal);
    }


    const value = {
        showModal,
        wifiDetails,
        showModalHandler,
        setWifiDetails,
    };


    return <WifiContext.Provider value={value}>{children}</WifiContext.Provider>;
}

export default WifiContextProvider;
