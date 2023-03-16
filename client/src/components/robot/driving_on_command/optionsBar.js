import { StyleSheet, View, Animated, Modal, TouchableHighlight, Text, StatusBar, Alert, ImageBackground } from "react-native"
import Icon from "../../Icon"
import { ColorsBlue } from "../../../constants/palet"
import { LinearGradient } from "expo-linear-gradient"
import { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import {  Header } from 'react-navigation-stack';
import { BlurView } from 'expo-blur';
import ToggleMenu from "./ToggleMenu";
import { SocketContext } from "../../../store/socket-context";

function OptionsBar({powerHandler, disconnectHandle, moveHandler}) {
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
        colors={[ColorsBlue.blue1200, ColorsBlue.blue1100, ColorsBlue.blue1200]}
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
                icon = {socketCtx.power ? "power-off" : "power"}
                size={50}
                color={ColorsBlue.blue100}
                onPress = {powerHandler}
                differentDir={true}/>

                <Icon 
                icon = "lan-disconnect"
                size={50}
                color={ColorsBlue.blue100}
                onPress = {disconnectHandle}
                differentDir={true}/>
            </View>

            <ToggleMenu
            headerHeight = {headerHeight}
            isStopActive = {isStopActive}
            toggleModal = {toggleModal}
            />
            </View>
            </ImageBackground>
        </LinearGradient>
    )
}

export default OptionsBar

const styles = StyleSheet.create({
    upperContainer: {
        margin: 2,
        marginVertical: 4,
        borderBottomColor: ColorsBlue.blue700,
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
        borderColor: ColorsBlue.blue100,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    stopCircle: {
        width: 23,
        height: 23,
        borderRadius: 20,
        backgroundColor: ColorsBlue.blue100,
    },
    stopCircleActive: {
        transform: [{ translateX: 25 }],
    },

})