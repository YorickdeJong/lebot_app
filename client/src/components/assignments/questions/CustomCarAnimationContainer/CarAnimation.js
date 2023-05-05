
import { View, Text, StyleSheet, Dimensions, Animated, ImageBackground, Easing, InteractionManager} from 'react-native'
import { useContext, useEffect, useRef, useState } from 'react';
import BlurWrapper from '../../../UI/BlurViewWrapper';
import { ColorsRed } from '../../../../constants/palet';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function CarAnimation({input, assignment_number, isFocused,}) {
    const colorAnim = useRef(new Animated.Value(0)).current;  // Initial value for opacity: 0

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(colorAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: false
                }),
                Animated.timing(colorAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: false
                })
            ])
        ).start();
    }, []);

    const animatedColor = colorAnim.interpolate({
        inputRange: [0, 0.5,1],
        outputRange: [ColorsRed.red600, ColorsRed.red200, ColorsRed.red600]
    });


    return (
        <View style = {styles.container}>
            <BlurWrapper intensity={15} tint = "dark" style = {styles.outerContainer} customColor={'rgba(10,10,10,0.9)'}>
                <ImageBackground
                source={require('./../../../../../assets/carAnimation/space_rover3.png')} 
                style={
                {flex: 1,}
                }
                imageStyle={{opacity: 1}}
                resizeMode="cover"
                >
                <Animated.Text style = {[styles.textDot1, { color: animatedColor }]}>1</Animated.Text>
                <Animated.View style = {[styles.dot1, { backgroundColor: animatedColor }]}/>
                {/* <Animated.View style = {[styles.arrow1]}/> */}
                <Animated.View style = {[styles.arrow1Cover, { backgroundColor: animatedColor }]} />
                <Animated.View style = {[styles.arrowTail1, { backgroundColor: animatedColor }]} />
                <Animated.Text style = {[styles.textDot2, { color: animatedColor }]}>2</Animated.Text>
                <Animated.View style = {[styles.dot2, { backgroundColor: animatedColor }]}/>
                {/* <Animated.View style = {[styles.arrow2]}/> */}
                <Animated.View style = {[styles.arrow2Cover, { backgroundColor: animatedColor }]} />
                <Animated.View style = {[styles.arrowTail2, { backgroundColor: animatedColor }]} />
                </ImageBackground>
            </BlurWrapper>
        </View>
    )
}


export default CarAnimation


const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    dot1: {
        backgroundColor:  ColorsRed.red600,
        width: 20,
        height: 20,
        borderRadius: 10,
        position: 'absolute',
        top: '82%',
        left: '40%',
    },
    dot2: {
        backgroundColor:  ColorsRed.red600,
        width: 20,
        height: 20,
        borderRadius: 10,
        position: 'absolute',
        top: '50%',
        left: '28%'
    },
    textDot1: {
        color:  ColorsRed.red600,
        fontSize: 25,
        fontWeight: 'bold',
        position: 'absolute',
        top: '67%',
        left: '40.5%',
    },
    textDot2: {
        color:  ColorsRed.red600,
        fontSize: 25,
        fontWeight: 'bold',
        position: 'absolute',
        top: '35%',
        left: '28%',
    },
    arrow2: {
        width: 0,
        height: 0,
        borderTopWidth: 10,
        borderTopColor: 'transparent',
        borderBottomWidth: 10,
        borderBottomColor: 'transparent',
        borderLeftWidth: 20,
        borderLeftColor:  ColorsRed.red600,
        position: 'absolute',
        top: '50%',
        left: '48%',
    },
    arrow2Cover: {
        backgroundColor: ColorsRed.red600,
        width: 15.28,
        height: 15.28,
        position: 'absolute',
        top: '51%',
        left: '46%',
        transform: [{ rotate: '45deg' }],
    },
    arrow1Cover: {
        backgroundColor: ColorsRed.red600,
        width: 15.28,
        height: 15.28,
        position: 'absolute',
        top: '83.5%',
        left: '23%',
        transform: [{ rotate: '45deg' }],
    },
    arrow1: {
        width: 0,
        height: 0,
        borderTopWidth: 10,
        borderTopColor: 'transparent',
        borderBottomWidth: 10,
        borderBottomColor: 'transparent',
        borderRightWidth: 20,
        borderRightColor: ColorsRed.red600,
        position: 'absolute',
        top: '82.5%',
        left: '20%',
    },
    arrowTail1: {
        backgroundColor:  ColorsRed.red600,
        width: '16%',
        height: 4,
        position: 'absolute',
        top: '86%',
        left: '25%',
    },
    arrowTail2: {
        backgroundColor:  ColorsRed.red600,
        width: '17%',
        height: 4,
        position: 'absolute',
        top: '53.5%',
        left: '32%',
    },
    container: {
        backgroundColor: 'rgba(0, 0, 15, 0.8)',
        marginTop: 16,
        marginVertical: 8,
        height: 230,
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.5)`,
        shadowColor: `rgba(11, 11, 11)`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 2,
        marginHorizontal: 8,
    }
})