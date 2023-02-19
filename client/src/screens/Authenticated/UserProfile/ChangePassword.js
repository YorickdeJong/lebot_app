import {useState, useContext} from 'react'
import {View, StyleSheet, Alert} from 'react-native'
import Icon from '../../../components/Icon';
import UserTextContainer from '../../../components/userProfile/UserTextContainer';
import { ColorsBlue } from '../../../constants/palet';
import { UserProfileContext } from '../../../store/userProfile-context';
import { changeUserProfile } from '../../../hooks/auth';

function ChangePassword({route, navigation}) {
    const userCtx = useContext(UserProfileContext)
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState(true);

    function inputHandler(inputType, input) {
        switch(inputType){
            case 'password':
            setPasswordInput(input)
            break;
            
            case 'confirmPassword':
            setConfirmPassword(input)
            break; 
        }
    }

    function onPressHandler(inputType) {
        switch(inputType){
            case 'password':
            setPasswordInput('')
            break;
            
            case 'confirmPassword':
            setConfirmPassword('');
            break;
        }
    }

    function iconHandler() {
        if (passwordInput.length < 6 || passwordInput != confirmPassword) {
            setCheckPassword(false)
            Alert.alert("password is too short or passwords don't match, please try again");
        }
        userCtx.editPassword(passwordInput)
        changeUserProfile(userCtx.userprofile)
        navigation.replace('userProfile')
    }
    return (
        <View>
            <UserTextContainer 
            text = "Password" 
            onPressHandler={onPressHandler.bind(this, "password")}
            inputHandler={inputHandler.bind(this, "password")}
            value = {passwordInput}
            checkInput = {checkPassword} />

            <UserTextContainer 
            text = "Password" 
            onPressHandler={onPressHandler.bind(this, "confirmPassword")}
            inputHandler={inputHandler.bind(this, "confirmPassword")}
            value = {confirmPassword}
            checkInput = {checkPassword}/>
            
            <View style = {styles.iconContainer}>
                <Icon   
                icon = "checkmark-done-circle-outline"
                size = {50}
                color = {ColorsBlue.blue200}
                onPress={iconHandler}/>
            </View>
        </View>
    )
}

export default ChangePassword

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        marginTop: 10
    }
})