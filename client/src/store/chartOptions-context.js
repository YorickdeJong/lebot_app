import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect, useContext } from "react";
import { useImages } from "../hooks/measurement_results";
import { UserProfileContext } from "./userProfile-context";

export const ChartOptionsContext = createContext({
    showLegend: false,
    showLegendHandler: () => {},
})


function ChartOptionsContextProvider({children}) {
    const [showLegend, setShowLegend] = useState(false);

    function showLegendHandler(){
        setShowLegend(!showLegend);
    }

    const value = {
        showLegend,
        showLegendHandler,
    }

    return <ChartOptionsContext.Provider value={value}>{children}</ChartOptionsContext.Provider>
}

export default ChartOptionsContextProvider