
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, StyleSheet, Text, Modal, ImageBackground } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SettingsTile from "../../../components/settings/SettingsTile";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { ColorsBlue } from "../../../constants/palet";
import { settingsData } from "../../../data/settingsData";
import { AuthContext } from "../../../store/auth-context";
import { ColorContext } from "../../../store/color-context";

function Settings() {
    const colorCtx = useContext(ColorContext)
    const authCtx = useContext(AuthContext)
    const navigation = useNavigation()
    const [isLoading, setIsLoading] = useState(true);

    function settingsGrid(itemData) {
        
        function onPressHandler() {

            switch(itemData.item.type) {
                case 'UserProfile':
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
            <ImageBackground
                source={require('./../../../../assets/planets/user_screen16.png')} 
                style={styles.backgroundImage}
                imageStyle={{opacity: 0.8}}
            >
                <FlatList 
                data = {settingsData}
                keyExtractor = {item => item.id}
                renderItem = {settingsGrid}
                numColumns = {2}
                />
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
        flex: 1, 
        backgroundColor: ColorsBlue.blue1200,
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 10,
        paddingHorizontal: 5,
    }
})