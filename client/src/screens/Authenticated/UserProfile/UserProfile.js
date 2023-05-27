
import { useNavigation } from '@react-navigation/native';
import  {View, Text, StyleSheet} from 'react-native'
import {useContext} from 'react'
import TitleContainer from '../../../components/settings/TitleContainer'
import UserProfileBar from '../../../components/settings/UserProfileBar'
import { UserProfileContext } from '../../../store/userProfile-context';
import Icon from '../../../components/Icon';
import { ColorsBlue } from '../../../constants/palet';
import { AuthContext } from '../../../store/auth-context';
import { ScrollView } from 'react-native-gesture-handler';

function UserProfile() {
    const userCtx = useContext(UserProfileContext);
    const authCtx = useContext(AuthContext);
    const navigation = useNavigation()

    function onPressHandler(inputType) {
        switch (inputType){
            case 'username': 
                navigation.navigate('changeUsername', {
                    username: userCtx.userprofile.username
                })
                break;
            case 'email': 
                navigation.navigate('changeEmail', {
                    email: userCtx.userprofile.email
                })
                break;
            case 'password': 
                navigation.navigate('changePassword')
                break;
            case 'name': 
                console.log('navigate to change name page');
                break;
            case 'lastName': 
                console.log('navigate to change lastName page');
                break;
            case 'DOB': 
                console.log('navigate to change DOB page');
                break;
            case 'school': 
                console.log('navigate to change school page');
                break;
            case 'klas': 
                console.log('navigate to change klas page');
                break;
            case 'groep': 
                console.log('navigate to change groep page');
                break;
            case 'gebruiker': 
                console.log('navigate to change class page');
                break;
            case 'level': 
                console.log('navigate to change level page');
                break;          
        }
    }

    function deleteAccountHandler() {
        console.log('pressed')
        const id = userCtx.userprofile.id
        deleteAccountHandler(id)
        authCtx.logout()
    }
    
    return (
        <ScrollView style = {{flex: 1, marginBottom: 50}}>
            <View style = {styles.container}>
                 <TitleContainer text = "Account Details"
                /> 
                
                <UserProfileBar text = "Gebruikers naam" isBorder={true} onPress = {onPressHandler.bind(this, "username")}
                userInfo = {userCtx.userprofile.username}
                />
                
                <UserProfileBar text = "Email address" isBorder={true} onPress = {onPressHandler.bind(this,  "email")}
                userInfo = {userCtx.userprofile.email}/>
                <UserProfileBar text = "Wachtwoord" 
                isBorder={false}
                style = {{height: 50}}
                onPress = {onPressHandler.bind(this, "password")}/>
            </View>

            <View style = {styles.container}> 
                <TitleContainer text = "Personal Information"  /> 
                    <UserProfileBar text = "Naam" isBorder={true} onPress = {onPressHandler.bind(this, "name")}
                    userInfo = {userCtx.userprofile.name}/>
                    <UserProfileBar text = "Achternaam" isBorder={true} onPress = {onPressHandler.bind(this, "lastName")}
                    userInfo = {userCtx.userprofile.lastname}/>
                    <UserProfileBar text = "Geboorte datum" isBorder={true} onPress = {onPressHandler.bind(this, "DOB")}
                    userInfo = {userCtx.userprofile.dob}/>
                    <UserProfileBar text = "School" isBorder={true} onPress = {onPressHandler.bind(this, "school")}
                    userInfo = {userCtx.userprofile.school_name}/>
                    <UserProfileBar text = "Klas" isBorder={true} onPress = {onPressHandler.bind(this, "klas")}
                    userInfo = {userCtx.userprofile.class_name}/>
                    <UserProfileBar text = "Groep" isBorder={true} onPress = {onPressHandler.bind(this, "groep")}
                    userInfo = {userCtx.userprofile.group_name}/>
                    <UserProfileBar text = "Gebruiker" isBorder={false} style = {{height: 50}}
                    onPress = {onPressHandler.bind(this, "level")}
                    userInfo = {userCtx.userprofile.user_role}/> 
            </View>

            <View style = {styles.delete}>
                <Icon 
                icon = 'trash'
                size = {35}
                color = {ColorsBlue.error300}
                onPress = {deleteAccountHandler}/>
        
            </View> 

                <Text style={styles.text}>Delete Account</Text>
        </ScrollView>
    )
}

export default UserProfile

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        margin: 10,
        marginTop: 30,
        borderRadius: 20,
        backgroundColor: ColorsBlue.blue1150,
    },
    delete: {
        alignItems: 'center',
        marginTop: 20
    },
    text: {
        marginTop: 5,
        color: ColorsBlue.blue200,
        textAlign: 'center'
    }
})