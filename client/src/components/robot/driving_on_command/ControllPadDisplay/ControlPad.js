import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, Text, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorsBlue } from '../../../../constants/palet';
import CarPad from './CarPad';
import { BlurView } from 'expo-blur';

const ControlPad = ({ moveHandler, displayNumber }) => {

    //TODO make the speed indicator larger depending on speed upgrades
    return (
        <View style={styles.shadowContainer}>
            <BlurView style = {styles.controller} intensity={10} tint="dark">
                <View style = {styles.outercontainer}>
                    <View />
                        {displayNumber === 1 && 
                        <CarPad 
                        moveHandler = {moveHandler}
                        />}
                    <View />
                </View>
            </BlurView>
        </View>
    );
};

export default React.memo(ControlPad);

const styles = StyleSheet.create({
    shadowContainer: {
        margin: 3,
        marginBottom: 8,
        marginHorizontal: 5,
        borderRadius: 20,
        ...Platform.select({
            ios: {
                shadowOffset: { height: 1, width: 1 },
                shadowRadius: 3,
                shadowOpacity: 1,
                shadowColor: ColorsBlue.blue1400,
            },
        }),
        flex: 1.1
    },
    outercontainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    controller: {
        justifyContent: 'center',
        borderColor: ColorsBlue.blue1400,
        borderWidth: Platform.OS === 'android' ? 1.2 :0.5,
        borderRadius: 20,
        flex: 1,
        overflow: 'hidden',
    },

});