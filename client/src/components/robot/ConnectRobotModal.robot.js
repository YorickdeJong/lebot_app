import { WifiContext } from "../../store/robot-connect-context"
import {Modal, View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator} from 'react-native';
import Icon from "../Icon";
import { BlurView } from "expo-blur";
import { ColorsBlue, ColorsGray } from "../../constants/palet";
import { useContext, useState } from "react";
import { SocketContext } from "../../store/socket-context";
import BlurWrapper from "../UI/BlurViewWrapper";


function ConnectRobotModal({}) {
    const WifiCtx = useContext(WifiContext)
    const socketCtx = useContext(SocketContext)
    const [wifiName, setWifiName] = useState('')
    const [wifiPassword, setWifiPassword] = useState('')
    const [loading, setLoading] = useState(false);
    const [isNotSchoolNetwork, setIsNotSchoolNetwork] = useState(false);
    const [networkType, setNetworkType] = useState("wpa2-personal");
    const [wifiUsername, setWifiUsername] = useState("");

    // Connects raspi to wifi network via ssh
    async function handleConnect() {
        if (!socketCtx.isConnected && !socketCtx.isConnectedViaSSH) {
            Alert.alert("Niet verbonden met de robot!", "Verbind eerst met de robot, daarna kan je de robot verbinden met het wifi netwerk.");
            return;
        }
        if (wifiName === "" || wifiPassword === "" || (!isNotSchoolNetwork && wifiUsername === "")) {
            Alert.alert("Vul alle velden in!");
            return;
        }
        // Connects rolio wifi adapter to wifi
        setLoading(true);
        
        
        let command;
        if (networkType === "wpa2-enterprise") {
            command = `cd Documents/lebot_robot_code/catkin_work && sudo ./update_netplan_school.sh ${networkType} ${wifiName} ${wifiUsername} ${wifiPassword}`;
        }
        else {
            command = `cd Documents/lebot_robot_code/catkin_work && sudo ./update_netplan.sh ${wifiName} ${wifiPassword}`;
        }


        // Create a promise that resolves when the expected response is received
        const waitForResponse = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                socketCtx.socket.current.off("robotConnected");
                reject(new Error("Timeout waiting for response"));
            }, 15000); // Set a timeout for waiting (15 seconds in this example)

            socketCtx.socket.current.on("robotConnected", (data) => {
                if (data.message === "Robot connected") {
                    clearTimeout(timeout);
                    socketCtx.socket.current.off("robotConnected");
                    resolve(true);
                }
                if (data.message === "Wifi incorrect") {
                    clearTimeout(timeout);
                    socketCtx.socket.current.off("robotConnected");
                    resolve(false);
                }
                if (data.message === "Password incorrect") {
                    clearTimeout(timeout);
                    socketCtx.socket.current.off("robotConnected");
                    resolve(false);
                }
            });
        });

        try {
            socketCtx.Command("", command);
            const success = await waitForResponse; // Wait for the response
            setLoading(false);
            
            if (success) {
                Alert.alert("Verbinding gemaakt met het wifi netwerk!', 'Robot herstart, even geduld aub. Connect straks weer met het robot netwerk");
            } 
            else {
                Alert.alert("Verbinding maken met wifi mislukt!', 'Check of je wifi naam en wachtwoord correct zijn.");
            }
        } 
        catch (error) {
            setLoading(false);
            console.log(error);
            Alert.alert("Verbinding maken met wifi mislukt!', 'Check je of je wifi naam en wachtwoord correct zijn.");
        }
    }

    function closeHandler(){
        WifiCtx.showModalHandler(false);
    }
    
    function switchWifiHandler(){
        setIsNotSchoolNetwork(!isNotSchoolNetwork);
        if (isNotSchoolNetwork){
            setNetworkType("wpa2-enterprise");
        }
        else {
            setNetworkType("wpa2-personal");
        }
    }0

    console.log('wifi type', networkType)

    return (
        <Modal
        visible={WifiCtx.showModal}
        transparent
        animationType="fade"
        >
            <BlurWrapper 
            style={styles.modalContainer} 
            intensity={20}
            customColor={'rgba(40,40,72, 0.95)'}>
                {
                loading && (
                    <View style={{ position: 'absolute', top: "65%", left: "32%", zIndex: 100}}>
                        <ActivityIndicator size="large" color={ColorsBlue.blue50} />
                        <Text style = {{fontSize: 18, marginTop: 15, color: ColorsBlue.blue50, textAlign: 'center'}}>Even geduld aub...</Text>
                    </View>
                    )
                }
                <View style={styles.modal}>
                    <Text style={{fontSize: 21, marginBottom: 15, color: ColorsBlue.blue50}}>{!isNotSchoolNetwork ? 'School Netwerk' : 'Normaal Wifi' }</Text>
                    <View style={styles.closeIcon}>
                        <Icon 
                        icon="close-circle"
                        size={25}
                        color={ColorsGray.gray700}
                        onPress={() => closeHandler()}
                        />
                    </View>
                    <TextInput
                    placeholder="Wifi Naam"
                    placeholderTextColor={ColorsBlue.blue200}
                    value={wifiName}
                    onChangeText={setWifiName}
                    style={styles.input}
                    autoCapitalize="none"
                    />
                    {!isNotSchoolNetwork && <TextInput
                    placeholder="Gebruikersnaam"
                    placeholderTextColor={ColorsBlue.blue200}
                    value={wifiUsername}
                    onChangeText={setWifiUsername}
                    style={styles.input}
                    autoCapitalize="none"
                    /> }
                    <TextInput
                    placeholder="Wifi Wachtwoord"
                    placeholderTextColor={ColorsBlue.blue200}
                    value={wifiPassword}
                    onChangeText={setWifiPassword}
                    secureTextEntry={true}
                    style={styles.input}
                    autoCapitalize="none"
                    />
                    {!loading && 
                        <TouchableOpacity onPress={() => handleConnect()} style={styles.createButton}>
                            <Text style={styles.buttonText}>{'Connect'}</Text>
                        </TouchableOpacity>
                    }
                    {!loading && 
                        <TouchableOpacity onPress={() => switchWifiHandler()} style={[styles.createButton, {backgroundColor: ColorsBlue.blue700}]}>
                            <Text style={styles.buttonText}>{!isNotSchoolNetwork ? 'Normaal Netwerk' : 'School Netwerk' }</Text>
                        </TouchableOpacity>
                    }
                </View>
            </BlurWrapper>
        </Modal>
    )
}

export default ConnectRobotModal


const styles = StyleSheet.create({
    modal: {
        width: '70%',
        paddingVertical: 20,
        borderRadius: 20,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
        backgroundColor: ColorsBlue.blue1100,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: 180,
        color: ColorsBlue.blue50
      },
    createButton: {
        backgroundColor: '#4a90e2',
        borderRadius: 5,
        padding: 10,
        width: 180,
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },    
    closeIcon: {
        position: 'absolute',
        top: 5,
        left: 5
    }
})
