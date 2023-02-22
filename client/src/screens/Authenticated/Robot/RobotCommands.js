
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, StyleSheet, Text, Modal, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SettingsTile from "../../../components/settings/SettingsTile";
import { robotData } from "../../../data/RobotData";
import { AuthContext } from "../../../store/auth-context";
import { ColorContext } from "../../../store/color-context";
import { SocketContext } from "../../../store/socket-context";

function Settings() {
    const socketCtx = useContext(SocketContext)
    const authCtx = useContext(AuthContext)
    const navigation = useNavigation()

    function settingsGrid(itemData) {
        function onPressHandler() {
            switch(itemData.item.type) {
                case 'Connect':
                    navigation.replace('SSHConnectionScreen');
                    break;

                case 'Controll Robot':
                    if (!socketCtx.isConnected) {
                        Alert.alert('You must connect first!');
                        return;
                    }
                    navigation.replace('Controller')
                    break;
                
                case 'Lidar':
                    if (!socketCtx.isConnected) {
                        Alert.alert('You must connect first!');
                        return;
                    }
                    navigation.replace('AutonomousDrivingLidar');
                    break;

                case 'Sonar':
                    if (!socketCtx.isConnected) {
                        Alert.alert('You must connect first!');
                        return;
                    }
                    authCtx.logout('AutonomousDrivingSonar');
                    break;
                
                case 'Autonomous Driving':
                    if (!socketCtx.isConnected) {
                        Alert.alert('You must connect first!');
                        return;
                    }
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