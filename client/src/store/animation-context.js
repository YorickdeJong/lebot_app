import { createContext, useEffect, useState } from 'react';
import { Animated } from 'react-native';

export const BlinkContext = createContext({
  shouldBlink: false,
  blinkAnimation: '',
  setShouldBlink: () => {},
});


function BlinkContextProvider({children}) {
    const [shouldBlink, setShouldBlink] = useState(false);
    const [blinkAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        if (shouldBlink) {
        Animated.loop(
            Animated.sequence([
            Animated.timing(blinkAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(blinkAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            ]),
            {
                iterations: 5,
            }
        ).start();
        } else {
        blinkAnimation.setValue(1);
        }
    }, [shouldBlink]);
    
    
    const value = {
        shouldBlink,
        blinkAnimation,
        setShouldBlink
    }

    return (
        <BlinkContext.Provider value={value}>
        {children}
        </BlinkContext.Provider>
    );
}


export default BlinkContextProvider;