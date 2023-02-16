
import { useNavigation } from '@react-navigation/native';
import  {View, Text, StyleSheet} from 'react-native'
import {useContext} from 'react'
import TitleContainer from '../../components/settings/TitleContainer'
import UserProfileBar from '../../components/settings/UserProfileBar'
import { UserProfileContext } from '../../store/userProfile-context';
import Icon from '../../components/Icon';
import { ColorsBlue } from '../../constants/palet';
import { AuthContext } from '../../store/auth-context';

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
            case 'class': 
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
        <View>
            <View style = {styles.container}>
                <TitleContainer text = "Account Details" style = {{borderTopLeftRadius: 10, borderTopRightRadius: 10}}
                />
                <UserProfileBar text = "Username" isBorder={true} onPress = {onPressHandler.bind(this, "username")}
                userInfo = {userCtx.userprofile.username}
                />
                
                <UserProfileBar text = "Email" isBorder={true} onPress = {onPressHandler.bind(this,  "email")}
                userInfo = {userCtx.userprofile.email}/>
                <UserProfileBar text = "Password" 
                isBorder={false}
                style = {{height: 50}}
                onPress = {onPressHandler.bind(this, "password")}/>

                <TitleContainer text = "Personal Information" isBorder={true} />
                <UserProfileBar text = "Name" isBorder={true} onPress = {onPressHandler.bind(this, "name")}
                userInfo = {userCtx.userprofile.name}/>
                <UserProfileBar text = "Last Name" isBorder={true} onPress = {onPressHandler.bind(this, "lastName")}
                userInfo = {userCtx.userprofile.lastname}/>
                <UserProfileBar text = "Date of Birth" isBorder={true} onPress = {onPressHandler.bind(this, "DOB")}
                userInfo = {userCtx.userprofile.dob}/>
                <UserProfileBar text = "School" isBorder={true} onPress = {onPressHandler.bind(this, "school")}
                userInfo = {userCtx.userprofile.school}/>
                <UserProfileBar text = "class" isBorder={true} onPress = {onPressHandler.bind(this, "class")}
                userInfo = {userCtx.userprofile.classschool}/>
                <UserProfileBar text = "level" isBorder={false} style = {{height: 50, borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10}}
                onPress = {onPressHandler.bind(this, "level")}
                userInfo = {userCtx.userprofile.level}/>
            </View>
            <View style = {styles.delete}>
                <Icon 
                icon = 'trash'
                size = {35}
                color = {ColorsBlue.error300}
                onPress = {deleteAccountHandler}/>
            </View>

                <Text style={styles.text}>Delete Account</Text>
        </View>
    )
}

export default UserProfile

const styles = StyleSheet.create({
    container: {
        margin: 20,
        marginTop: 50,
        borderRadius: 10,
    },
    delete: {
        alignItems: 'center'
    },
    text: {
        marginTop: 5,
        color: ColorsBlue.blue200,
        textAlign: 'center'
    }
})