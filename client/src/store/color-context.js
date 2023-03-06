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
            console.log(`stored Color is: ${storedColor}`)
            setIsBlueColor(!storedColor);
            setIconColor(storedIconColor)
            console.log(`blue color is: ${isBlueColor}`)
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
        console.log(`setcolo`)
        console.log(`stored token: ${await AsyncStorage.getItem('color')}`)
    }

    const value = {
        isBlue: isBlueColor,
        iconColor: iconColor,
        setColor: setColor,
    };

    return <ColorContext.Provider value = {value}>{children}</ColorContext.Provider>

}

export default ColorContextProvider