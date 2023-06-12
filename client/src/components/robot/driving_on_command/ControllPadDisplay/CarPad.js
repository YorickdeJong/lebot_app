import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, PanResponder, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorsBlue } from '../../../../constants/palet';


function CarPad({moveHandler}){
    const [padWidth, setPadWidth] = useState(0);
    const [padHeight, setPadHeight] = useState(0);
    const [moveX, setMoveX] = useState(0);
    const [moveY, setMoveY] = useState(0);
    const [speed, setSpeed] = useState(0);
    // State variable to handle visual feedback
    const [isOutOfBounds, setIsOutOfBounds] = useState(false);

    const handleMove = useCallback((dx, dy) => {
        const maxX = padWidth / 2.5 ;
        const maxY = padHeight / 2.5;

        // Calculate new position of stick based on previous position
        const newMoveX = Math.max(-maxX, Math.min(maxX, moveX + dx));
        const newMoveY = Math.max(-maxY, Math.min(maxY, moveY + dy));
        

        setMoveX(newMoveX);
        setMoveY(newMoveY);

        setSpeed(Math.pow(Math.max(Math.abs(newMoveX), Math.abs(newMoveY)) / maxX, 2));

        if (-1 <= newMoveX && newMoveX <= 1 && -1 < newMoveY && newMoveY <= -0.1) {
            setSpeed(Math.abs(newMoveY.toFixed(2)));
        } 
        else if (newMoveX === 1 && -1 <= newMoveY && newMoveY <= 1) {
            setSpeed( Math.abs(newMoveX.toFixed(2)));
        } 
        else if (newMoveX === -1 && -1 <= newMoveY && newMoveY <= 1) {
            setSpeed(Math.abs(newMoveY.toFixed(2)));
        } 
        else if (-1 <= newMoveX && newMoveX <= 1 && 0.1 < newMoveY && newMoveY <= 1) {
            setSpeed(Math.abs(newMoveY.toFixed(2)));
        } 
        else if (newMoveX === 0 && newMoveY === 0) {
            setSpeed(0);
        }

        // Check if the move is out of bounds
        const outOfBounds = newMoveX > maxX || newMoveX < -maxX || newMoveY > maxY || newMoveY < -maxY;

        // Update the state variable
        setIsOutOfBounds(outOfBounds);

        moveHandler(newMoveX / maxX, newMoveY / maxY) 

    }, [padWidth, padHeight, moveX, moveY]);

    const panResponder = useMemo(() =>PanResponder.create({
        onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (event, gestureState) => {
            setMoveX(0);
            setMoveY(0);
            handleMove(0, 0);
        },
        onPanResponderMove: (event, gestureState) => {
            const { dx, dy } = gestureState;
            handleMove(dx, dy);
        },
        onPanResponderRelease: () => {
            setMoveX(0);
            setMoveY(0);
            setSpeed(0);
            moveHandler(0, 0);
        },
    }), [handleMove]);

    const padStyles = isOutOfBounds 
        ? [styles.pad, styles.padOutOfBounds] 
        : styles.pad;

    return(
        <>
            <View
                style={styles.container}
                onLayout={({ nativeEvent }) => {
                    const { width, height } = nativeEvent.layout;
                    setPadWidth(width);
                    setPadHeight(height);
                }}
                {...panResponder.panHandlers}
            >
                <View style={padStyles} />
                <View style={[styles.stick, { transform: [{ translateX: moveX }, { translateY: moveY }] }]} />
            </View>
            <View style = {styles.speedContainer}>
                <LinearGradient 
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    colors = {[ColorsBlue.blue1200, ColorsBlue.blue700]} 
                    style={[styles.speedIndicator, { width: `${speed * 101}%` }]} /> 
                <Text style = {styles.speed}>Speed</Text>
            </View>
        </>
    );
}


export default React.memo(CarPad)

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: 100,
        height: 100,
        borderRadius: 60,
        borderWidth: 2,
        left: "10%",
        borderColor: ColorsBlue.blue900,
        backgroundColor: 'rgba(14, 14, 44, 0)',
        elevation: 2, 
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },
    pad: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        top: '50%',
        left: '50%',
        transform: [{ translateX: -40 }, { translateY: -40 }],
        backgroundColor: 'rgba(65, 65, 141, 0.2)',
    },
    padOutOfBounds: {
        // Add the visual feedback styles here. This could be a change in color, border, etc.
        borderColor: 'red',
        borderWidth: 2,
    },
    stick: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        top: '30%',
        left: '28%',
        transform: [{ translateX: 0 }, { translateY: 0 }],
        backgroundColor: ColorsBlue.blue1000,
    },
    speedIndicator: {
        position: 'absolute',
        transform: [{ translateX: -5 }],
        height: 60,
        borderRadius: 6,
        marginLeft: 4
    },
    speed: {
        color: ColorsBlue.blue400,
        fontSize: 14,
        textAlign: 'center',
        marginLeft: 40,
        textShadowColor: ColorsBlue.blue1400, 
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 2
    },  
    speedContainer: {
        alignItems: 'center', 
        flexDirection: 'row',
        width: 130,
        height: 60,
        borderColor: ColorsBlue.blue700,
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: 'rgba(14, 14, 44, 0.56)',
        elevation: 2, 
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
    },  
})