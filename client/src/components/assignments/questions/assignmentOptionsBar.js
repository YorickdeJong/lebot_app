
import { StyleSheet, View, StatusBar, Alert, Text } from "react-native"
import Icon from "../../Icon";
import ToggleMenu from "../../robot/driving_on_command/ToggleMenu";
import { ColorsBlue, ColorsLighterGold, ColorsTile } from "../../../constants/palet";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useContext, useEffect, useState } from "react";
import {  Header } from 'react-navigation-stack';
import { BlurView } from "expo-blur";




function AssignmentOptionsBar({midIcon, rightIcon, midIconHandler, rightIconHandler, text}){
    const [isStopActive, setIsStopActive] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);

    const toggleModal = () => {
        setIsStopActive(!isStopActive); 
    };

    useEffect(() => {
        const headerHeight = Header.HEIGHT + StatusBar.currentHeight;
        setHeaderHeight(headerHeight);
    }, []);

    return(
            <BlurView intensity={7} style = {styles.upperIcons}>
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
                <View style = {{marginLeft: 25}}>
                    <Icon 
                    icon = {midIcon}
                    size={30}
                    color={ColorsBlue.error300}
                    onPress = {midIconHandler}
                    differentDir={true}/>
                </View>
                <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style = {styles.text}>{text}</Text>
                    <Icon 
                    icon = {rightIcon} 
                    size={30}
                    color={ColorsLighterGold.gold400}
                    onPress = {rightIconHandler}
                    differentDir={true}/>

                </View>
                <ToggleMenu
                headerHeight = {headerHeight}
                isStopActive = {isStopActive}
                toggleModal = {toggleModal}
                />
            </BlurView>
    )
}

export default AssignmentOptionsBar;

const styles = StyleSheet.create({
    upperIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopColor: `rgba(77, 77, 77, 0.5)`,
        borderTopWidth: 0.6,
        padding: 5,
        width: "101%",
        paddingHorizontal: 25,
        alignSelf: 'center',
        paddingVertical: 15
    },
    stopContainer: {
        width: 30,
        height: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: ColorsTile.blue500,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    stopCircle: {
        width: 15,
        height: 15,
        borderRadius: 20,
        backgroundColor: ColorsTile.blue500,
    },
    stopCircleActive: {
        transform: [{ translateX: 15 }],
    },
    text: {
        fontSize: 20,
        color: ColorsLighterGold.gold400,
        marginRight: 5,
        textAlign: 'center',
    }

})