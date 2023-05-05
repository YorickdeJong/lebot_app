
import { useNavigation } from "@react-navigation/native";
import { useContext, } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SettingsTile from "../../components/settings/SettingsTile";
import { ColorsBlue } from "../../constants/palet";
import { AuthContext } from "../../store/auth-context";

function Settings() {
    const authCtx = useContext(AuthContext)
    const navigation = useNavigation()
    const settingsData = [{type: 'LogOut'}]

    function settingsGrid({item}) {
        
        function onPressHandler() {

            switch(item.type) {
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
        flex: 1, 
        backgroundColor: ColorsBlue.blue1200
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
    }
})