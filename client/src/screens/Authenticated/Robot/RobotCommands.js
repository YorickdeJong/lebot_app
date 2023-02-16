
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, StyleSheet, Text, Modal } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SettingsTile from "../../../components/settings/SettingsTile";
import { robotData } from "../../../data/RobotData";
import { AuthContext } from "../../../store/auth-context";
import { ColorContext } from "../../../store/color-context";

function Settings() {
    const colorCtx = useContext(ColorContext)
    const authCtx = useContext(AuthContext)
    const navigation = useNavigation()

    function settingsGrid(itemData) {
        
        function onPressHandler() {
            console.log('pressed')
            switch(itemData.item.type) {
                case 'Connect':
                    navigation.replace('SSHConnectionScreen');
                    break;

                case 'Controll Robot':
                    navigation.replace('Controller')
                    break;
                
                case 'Lidar':
                    navigation.replace('AutonomousDrivingLidar');
                    break;

                case 'Sonar':
                    authCtx.logout('AutonomousDrivingSonar');
                    break;
                
                case 'Autonomous Driving':
                    authCtx.logout('AutonomousDrivingCombined');
                    break;
                }
        }
        return (
            <SettingsTile 
            {...itemData.item}
            onPress = {onPressHandler}
            />
            )
        
       
    }
    return (
        <View style = {styles.modalContainer}> 
            <FlatList 
            data = {robotData}
            keyExtractor = {item => item.id}
            renderItem = {settingsGrid}
            numColumns = {2}
            />
        </View>
    )
}


export default Settings

const styles = StyleSheet.create({
    iconContainer: {
        flex: 1
    },
    modalContainer: {
        marginTop: 50,
    }
})