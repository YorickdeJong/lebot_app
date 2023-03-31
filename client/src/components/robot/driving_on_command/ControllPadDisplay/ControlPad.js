import React, { useState } from 'react';
import { View, StyleSheet, PanResponder, Text, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorsBlue } from '../../../../constants/palet';
import CarPad from './CarPad';
import WindmillPad from './WindmillPad';

const ControlPad = ({ moveHandler, displayNumber }) => {

    //TODO make the speed indicator larger depending on speed upgrades
    return (
        <LinearGradient 
            style = {styles.controller}
            colors={[ColorsBlue.blue1300, ColorsBlue.blue1100, ColorsBlue.blue1200]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
        <ImageBackground
            source={require('./../../../../../assets/lowerHalfControlPanel.png')} 
            style= {{flex: 1, padding: 10}}
            imageStyle={{opacity: 0.18}}
            >
            <View style = {styles.outercontainer}>
                <View />
                    {displayNumber === 1 && <CarPad 
                    moveHandler = {moveHandler}/>}
                <View />
            </View>
        </ImageBackground>
        </LinearGradient>
    );
};

export default ControlPad;

const styles = StyleSheet.create({

    outercontainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    controller: {
        justifyContent: 'center',
        margin: 2,
        marginVertical: 5,
        borderBottomColor: ColorsBlue.blue700,
        borderColor: ColorsBlue.blue700,
        borderWidth: 1,
        borderRadius: 5,
        flex: 1
    },

});