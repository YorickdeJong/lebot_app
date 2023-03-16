
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, StyleSheet, Text, Modal, Alert, ImageBackground } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SettingsTile from "../../../components/settings/SettingsTile";
import { ColorsBlue } from "../../../constants/palet";
import { robotData } from "../../../data/RobotData";
import { AuthContext } from "../../../store/auth-context";
import { ColorContext } from "../../../store/color-context";
import { SocketContext } from "../../../store/socket-context";

function Settings() {
    const socketCtx = useContext(SocketContext)
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
                    break;
                
                case 'Autonomous Driving':
                    if (!socketCtx.isConnected) {
                        Alert.alert('You must connect first!');
                        return;
                    }
                    break;

                case 'Robot Store':
                    navigation.replace('RobotStore')
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
        <View style = {styles.backgroundColor}>
            <ImageBackground 
                source={require('./../../../../assets/chatbackground.png')} 
                style={styles.backgroundImage}
                imageStyle={{opacity: 0.15}}
                >
                <View style={styles.content}>
                    <FlatList 
                    data = {robotData}
                    keyExtractor = {item => item.id}
                    renderItem = {settingsGrid}
                    numColumns = {2}
                    />
                </View>
            </ImageBackground>
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
    },
    content: {
        justifyContent: 'center',
        flex: 1,
        marginTop: 13

    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain',
        borderTopColor: ColorsBlue.blue100,
        borderTopWidth: 0.2
    },
    backgroundColor: {
        flex: 1,
        backgroundColor: ColorsBlue.blue1300
    }
})