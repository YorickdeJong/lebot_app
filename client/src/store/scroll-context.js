



import { createContext, useRef, useState,} from "react";
import { Dimensions } from 'react-native';

export const ScrollContext = createContext({
    manualScrollRef: false,
    isLoading: false,
    handleProgressBarPress: (i, setSlideCount) => {},
    setIsLoading: () => {}
})



const { width: SCREEN_WIDTH } = Dimensions.get('window');
function ScrollContextProvider({children}) {
    // Define a ref to indicate whether a manual scroll is being performed
    const manualScrollRef = useRef(false);
    const [isLoading, setIsLoading] = useState(false);

    // When setting slideCount manually from ProgressBar
    const handleProgressBarPress = (i, setSlideCount, currentSlidePosition) => {
        manualScrollRef.current = true;
        setIsLoading(true);
        setSlideCount(i);

        // Calculate the offset to scroll to
        const offset = (i - 1) * SCREEN_WIDTH;

        // Scroll the FlatList to the new offset
        currentSlidePosition.current.scrollToOffset({ offset, animated: false });

        setIsLoading(false)
    }

    const value = {
        manualScrollRef,
        isLoading,
        handleProgressBarPress,
        setIsLoading
    }

    return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
}

export default ScrollContextProvider