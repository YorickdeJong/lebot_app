
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, StyleSheet, Text, Modal, ImageBackground, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SettingsTile from "../../../components/settings/SettingsTile";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { ColorsBlue } from "../../../constants/palet";
import { settingsData } from "../../../data/settingsData";
import { AuthContext } from "../../../store/auth-context";
import { ColorContext } from "../../../store/color-context";
import { SocketContext } from "../../../store/socket-context";

function Settings() {
    const colorCtx = useContext(ColorContext)
    const authCtx = useContext(AuthContext)
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(true);
    const socketCtx = useContext(SocketContext);

    function settingsGrid({item, index}) {
        
        function onPressHandler() {

            switch(item.type) {
                case 'Profiel':
                    navigation.replace('userProfile');
                    break;

                case 'Groepen':
                    navigation.goBack();
                    navigation.navigate('groups')
                    break;
                
                case 'Results':
                    navigation.replace('results');
                    break;

                case 'LogOut':
                    authCtx.logout();
                    break;

                case 'Zet Rover Uit':
                    Alert.alert(
                        'Alert',
                        'Weet je zeker dat je de rover wilt uitzetten?',
                        [
                            {
                                text: 'Nee',
                                onPress: () => {},
                                style: 'cancel',
                            },
                            {
                                text: 'Ja',
                                onPress: () => {
                                    try {
                                        socketCtx.Command('', 'sudo shutdown -h now'); // maybe this should be an echo command
                                    }
                                    catch(error){
                                        Alert.alert('Er is iets fout gegaan', 'Ben je verbonden met de rover?')
                                        console.log('failed to add groep', error)
                                    }
                                },
                            },
                        ],
                    );
                    break;

                }
        }
        return (
            <SettingsTile 
            index = {index}
            {...item}
            onPress = {onPressHandler}
            />
            )
    }
    
    return (
        <View style = {styles.modalContainer}> 
                <FlatList 
                data = {settingsData}
                keyExtractor = {item => item.id}
                renderItem = {settingsGrid}
                numColumns = {1}
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
        flex: 1, 
        backgroundColor: 'rgba(8, 8, 25,1)',
        elevation: 8
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 10,
        paddingHorizontal: 5,
    }
})