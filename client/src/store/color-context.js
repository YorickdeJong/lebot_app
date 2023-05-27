import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useState } from "react"
import { ColorsBlue, ColorsGreen } from '../constants/palet';

export const ColorContext = createContext({
    isBlue: false,
    iconColor: ColorsBlue.blue400,
    setColor: (storedColor, storedIconColor) => {},
})


function ColorContextProvider({children}) {
    const [isBlueColor, setIsBlueColor] = useState(false)
    const [iconColor, setIconColor] = useState(ColorsBlue.blue400) 
    
    async function setColor(storedColor, storedIconColor) {
        if (storedColor && storedIconColor)
        {
            setIsBlueColor(!storedColor);
            setIconColor(storedIconColor)
            return;
        }

        setIsBlueColor(isBlueColor)
        AsyncStorage.setItem('color', JSON.stringify(isBlueColor))

        if (isBlueColor) {
            setIconColor(ColorsBlue.blue400)
        }
        else {
            setIconColor(ColorsBlue.blue400)
        }
        AsyncStorage.setItem('iconColor', iconColor)
    }

    const value = {
        isBlue: isBlueColor,
        iconColor: iconColor,
        setColor: setColor,
    };

    return <ColorContext.Provider value = {value}>{children}</ColorContext.Provider>

}

export default ColorContextProvider