
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Text, Modal, Alert, ImageBackground, StatusBar } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import AssignmentDetailsModal from "../../../components/robot/robot_commands/assignmentDetailsModal";
import SettingsTile from "../../../components/settings/SettingsTile";
import { ColorsBlue } from "../../../constants/palet";
import { robotData } from "../../../data/RobotData";;
import { SocketContext } from "../../../store/socket-context";
import {  Header } from 'react-navigation-stack';

function RobotCommands() {
    const socketCtx = useContext(SocketContext);
    const navigation = useNavigation();
    const [headerHeight, setHeaderHeight] = useState(0);
    const [showAssignmentDetailsModal, setShowAssignmentDetailsModal] = useState(false);
    
    useEffect(() => {
        const headerHeight = Header.HEIGHT + StatusBar.currentHeight;
        setHeaderHeight(headerHeight);
    }, []);

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
                    setShowAssignmentDetailsModal(true);
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
            blurFactor = {8}
            />
            )
    }

    if (showAssignmentDetailsModal) {
        console.log('check')
        return (
            <AssignmentDetailsModal 
            headerHeight={headerHeight}/>
        )
    }

    return (
        <View style={styles.backgroundColor}>
          <ImageBackground
            source={require("./../../../../assets/planets/robot_screen3.png")}
            style={styles.backgroundImage}
            imageStyle={{ opacity: 1 }}
          >
            <View style={styles.content}>
              <FlatList
                data={robotData}
                keyExtractor={(item) => item.id}
                renderItem={settingsGrid}
                numColumns={2}
              />
            </View>
          </ImageBackground>
        </View>
      );
    }
    
    // Rest of the code
export default RobotCommands;

const styles = StyleSheet.create({
      iconContainer: {
        flex: 1,
      },
      modalContainer: {
        marginTop: 70,
      },
      content: {
        justifyContent: "center",
        flex: 1,
        marginTop: 20,
      },
      backgroundImage: {
        flex: 1,
        resizeMode: "contain",
        justifyContent: "center",
      },
      backgroundColor: {
        flex: 1,
        backgroundColor: ColorsBlue.blue1300,
        justifyContent: "center",
      },
});