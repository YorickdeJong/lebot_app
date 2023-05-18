import { createContext, useState, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export const BlinkContext = createContext();

function BlinkContextProvider({ children }) {
    const [shouldBlink, setShouldBlink] = useState(false);
    const [shouldBlinkRobot, setShouldBlinkRobot] = useState(false);
    const [shouldBlinkDataButton, setShouldBlinkDataButton] = useState(false);
    const [shouldBlinkChartModal, setShouldBlinkChartModal] = useState(false);
    const [shouldBlinkPowerButton, setShouldBlinkPowerButton] = useState(false);
    const [colorAnimation] = useState(new Animated.Value(0)); // New animated value for opacity
    const [colorAnimationMeasurement] = useState(new Animated.Value(0)); // New animated value for opacity
    const [colorAnimationPower] = useState(new Animated.Value(0)); // New animated value for opacity
    const [animation, setAnimation] = useState(null);

    useEffect(() => {
        if (shouldBlink || shouldBlinkRobot || shouldBlinkDataButton) {
            const anim = Animated.loop(
                Animated.timing(colorAnimation, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                {
                    iterations: 3,
                }
            ).start(() => {
                // Callback function to set shouldBlink to false once the animation is finished
                setShouldBlink(false);
                setShouldBlinkRobot(false);
                setShouldBlinkDataButton(false);
            });
            setAnimation(anim);
        } else {
            if (animation) {
                animation.stop();
            }
            setShouldBlink(false);
            setShouldBlinkRobot(false);
            setShouldBlinkDataButton(false);
            colorAnimation.setValue(0); // Reset the opacity value
        }
    }, [shouldBlink, shouldBlinkRobot, shouldBlinkDataButton]);

    useEffect(() => {
        if (shouldBlinkChartModal) {
            const anim = Animated.loop(
                Animated.timing(colorAnimationMeasurement, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                {
                    iterations: 3,
                }
            ).start(() => {
                // Callback function to set shouldBlink to false once the animation is finished
                setShouldBlinkChartModal(false);
            });
            setAnimation(anim);
        } else {
            if (animation) {
                animation.stop();
            }

            setShouldBlinkChartModal(false);
            colorAnimation.setValue(0); // Reset the opacity value
        }
    }, [ shouldBlinkChartModal]);

    useEffect(() => {
        if (shouldBlinkPowerButton) {
            const anim = Animated.loop(
                Animated.timing(colorAnimationPower, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                {
                    iterations: 3,
                }
            ).start(() => {
                // Callback function to set shouldBlink to false once the animation is finished
                setShouldBlinkPowerButton(false);
            });
            setAnimation(anim);
        } else {
            if (animation) {
                animation.stop();
            }
            
            setShouldBlinkPowerButton(false);
            colorAnimation.setValue(0); // Reset the opacity value
        }
    }, [ shouldBlinkPowerButton]);

    const value = {
        shouldBlink,
        shouldBlinkRobot,
        shouldBlinkDataButton,
        shouldBlinkChartModal,
        shouldBlinkPowerButton,
        colorAnimation,
        colorAnimationMeasurement,
        colorAnimationPower,
        setShouldBlink,
        setShouldBlinkRobot,
        setShouldBlinkDataButton,
        setShouldBlinkChartModal,
        setShouldBlinkPowerButton,
    };
    
    return <BlinkContext.Provider value={value}>{children}</BlinkContext.Provider>;
}
    
export default BlinkContextProvider;
