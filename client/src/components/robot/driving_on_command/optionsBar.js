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
import { useNavigation } from "@react-navigation/native";

function OptionsBar({midIconHandler, rightIconHandler, midIcon, subject}) {
    const [isStopActive, setIsStopActive] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const socketCtx = useContext(SocketContext);
    const navigation = useNavigation()

    const toggleModal = () => {
        setIsStopActive(!isStopActive); 
        return;
    };

    useEffect(() => {
        const headerHeight = Header.HEIGHT + StatusBar.currentHeight;
        setHeaderHeight(headerHeight);
    }, []);

    const addStyleIcon = {
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 4,
        shadowOpacity: 1,
        shadowColor: 'black',
        elevation: 4
    }

    function chooseEqualityHandler(type) {
        switch(type){
            case "equals":
                 
        }

    }


    return(    
        <View style={styles.shadowContainer}>
            <BlurView style = {styles.upperContainer} intensity={10} tint="dark">
                <View style = {{padding: 10, paddingTop: 16}}>
                    <View style = {styles.upperIcons}>

                        <Icon 
                        icon = {"md-arrow-back-circle"} 
                        size={40}
                        color={ColorsBlue.blue200}
                        onPress = {() => navigation.goBack()}
                        addStyle={addStyleIcon}
                        />
                        
                        <Icon 
                        icon = {midIcon ? midIcon : (socketCtx.power ? "pause-circle-outline" : "power")}
                        size={45}
                        color={ColorsBlue.blue200}
                        onPress = {midIconHandler}
                        differentDir={true}
                        addStyle={addStyleIcon}
                        />
        
                        {/* toggle menu */}
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
                    </View>
                </View>
            </BlurView>
            <ToggleMenu
                headerHeight = {headerHeight}
                isStopActive = {isStopActive}
                toggleModal = {toggleModal}
                subject = {subject}
            />
        </View>
    )
}

export default React.memo(OptionsBar)

const styles = StyleSheet.create({
    shadowContainer: {
        margin: 3,
        marginTop: 8,
        marginHorizontal: 5,
        borderRadius: 5,
        ...Platform.select({
            ios: {
                shadowOffset: { height: 2, width: 1 },
                shadowRadius: 3,
                shadowOpacity: 1,
                shadowColor: ColorsBlue.blue1400,
            },
            android: {
                elevation: 5,
            },
        }),
        flex: 0.7
    },
    upperContainer: {
        borderColor: ColorsBlue.blue1400,
        borderWidth: 0.5,
        borderRadius: 5,
        overflow: 'hidden',
        flex: 1
    },
    upperIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        marginHorizontal: 10,
    },
    stopContainer: {
        width: 50,
        height: 25,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: ColorsBlue.blue200,
        justifyContent: "center",
        alignItems: "flex-start",
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 4,
        shadowOpacity: 1,
        shadowColor: 'black',
        elevation: 4
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