import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const InformationContext = createContext();

export const InformationContextProvider = ({ children }) => {
    const [showInformationModal, setShowInformationModal] = useState(false);
    const [showBeginningScreen, setShowBeginningScreen] = useState(true);

    // function to save showBeginningScreen in async storage
    const storeShowBeginningScreen = async (value) => {
      try {
        await AsyncStorage.setItem('@showBeginningScreen', JSON.stringify(value))
      } catch (e) {
        // saving error
        console.error(e);
      }
    }

    // function to load showBeginningScreen from async storage
    const loadShowBeginningScreen = async () => {
      try {
        const value = await AsyncStorage.getItem('@showBeginningScreen')
        if(value !== null) {
          setShowBeginningScreen(JSON.parse(value));
        }
      } catch(e) {
        // error reading value
        console.error(e);
      }
    }

    useEffect(() => {
      // load showBeginningScreen when app first renders
      loadShowBeginningScreen();
    }, []);

    const values = {
        showInformationModal,
        showBeginningScreen,
        setShowInformationModal,
        setShowBeginningScreen: (value) => {
          setShowBeginningScreen(value);
          storeShowBeginningScreen(value);
        },
    }

    return <InformationContext.Provider value = {values}>{children}</InformationContext.Provider>
}