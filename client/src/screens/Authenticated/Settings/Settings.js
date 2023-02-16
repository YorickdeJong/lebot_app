
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, StyleSheet, Text, Modal } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SettingsTile from "../../../components/settings/SettingsTile";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
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

                case 'Change Color':
                    colorCtx.setColor();
                    setIsLoading(false)
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
            <FlatList 
            data = {settingsData}
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