import { StyleSheet, View, Animated, Modal, TouchableHighlight, Text, StatusBar, Alert, ImageBackground } from "react-native"
import Icon from "../../Icon"
import { ColorsBlue } from "../../../constants/palet"
import { LinearGradient } from "expo-linear-gradient"
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import {  Header } from 'react-navigation-stack';
import { BlurView } from 'expo-blur';
import ToggleMenu from "./ToggleMenu";
import { SocketContext } from "../../../store/socket-context";

function OptionsBar({midIconHandler, rightIconHandler, midIcon, rightIcon, displayNumber}) {
    const [isStopActive, setIsStopActive] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const socketCtx = useContext(SocketContext);

    const toggleModal = () => {
        if (socketCtx.power){
            setIsStopActive(!isStopActive); 
            return;
        }
        Alert.alert('Turn on power first!')
        return
    };

    useEffect(() => {
        const headerHeight = Header.HEIGHT + StatusBar.currentHeight;
        setHeaderHeight(headerHeight);
    }, []);

    return(    
        <LinearGradient 
        style = {styles.upperContainer}
        colors={[ColorsBlue.blue1300, ColorsBlue.blue1100, ColorsBlue.blue1300]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
            >
            <ImageBackground
            source={require('./../../../../assets/upperHalfControlPannel.png')} 
            style= {{flex: 1}}
            imageStyle={{opacity: 0.15}}
            resizeMode = 'cover'
            >
            <View style = {{padding: 10, paddingTop: 16}}>
            <View style = {styles.upperIcons}>
                <TouchableOpacity onPress={toggleModal}>
                    <View style={styles.stopContainer}>
                        <View
                        style={[
                            styles.stopCircle,
                            isStopActive ? styles.stopCircleActive : {},
                        ]}
                        />
                    </View>
                </TouchableOpacity>
                
                <Icon 
                icon = {midIcon ? midIcon : (socketCtx.power ? "power-off" : "power")}
                size={50}
                color={ColorsBlue.blue200}
                onPress = {midIconHandler}
                differentDir={true}/>

                <Icon 
                icon = {rightIcon ? rightIcon : "lan-disconnect"} 
                size={50}
                color={ColorsBlue.blue200}
                onPress = {rightIconHandler}
                differentDir={true}/>
            </View>

            <ToggleMenu
            headerHeight = {headerHeight}
            isStopActive = {isStopActive}
            toggleModal = {toggleModal}
            displayNumber = {displayNumber}
            />
            </View>
            </ImageBackground>
        </LinearGradient>
    )
}

export default React.memo(OptionsBar)

const styles = StyleSheet.create({
    upperContainer: {
        margin: 2,
        marginVertical: 4,
        borderColor: ColorsBlue.blue700,
        borderWidth: 1,
        borderRadius: 5,
        flex: 0.7
    },
    upperIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    stopContainer: {
        width: 50,
        height: 25,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: ColorsBlue.blue200,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    stopCircle: {
        width: 23,
        height: 23,
        borderRadius: 20,
        backgroundColor: ColorsBlue.blue200,
    },
    stopCircleActive: {
        transform: [{ translateX: 25 }],
    },

})