import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const ShowIconsContext = createContext({
    showIcons: {},
    setShowIconsHandler: (icon) => {},
});

export function ShowIconContextProvider({ children }) {
    const [showIcons, setShowIcons] = useState({
        chatgpt: false, 
        robotStore: false,
    });

    // Load data from AsyncStorage when the component mounts
    useEffect(() => {
        async function fetchShowIcons() {
            const iconsJson = await AsyncStorage.getItem('showIcons');
            if (iconsJson) {
                setShowIcons(JSON.parse(iconsJson));
            }
        }

        fetchShowIcons();
    }, []);

    async function setShowIconsHandler(icon) {
        setShowIcons((prevShowIcons) => {
            const updatedShowIcons = { ...prevShowIcons, [icon]: true };

            // Save the updated showIcons in AsyncStorage
            AsyncStorage.setItem('showIcons', JSON.stringify(updatedShowIcons));

            return updatedShowIcons;
        });
    }


    const values = {
        showIcons,
        setShowIconsHandler,

    }
    return (
        <ShowIconsContext.Provider value={values}>
            {children}
        </ShowIconsContext.Provider>
    );
}
