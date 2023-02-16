import {useState, useEffect, useContext} from 'react'
import UserTextContainer from '../../components/userProfile/UserTextContainer'
import {View, StyleSheet, Alert} from 'react-native'
import Icon from '../../components/Icon';
import { ColorsBlue } from '../../constants/palet';
import { UserProfileContext } from '../../store/userProfile-context';
import { changeUserProfile } from '../../hooks/auth';

function ChangeEmail({route, navigation}) {
    const email = route.params.email
    const userCtx = useContext(UserProfileContext)

    const [emailInput, setEmailInput] = useState(email)
    const [checkEmail, setCheckEmail] = useState(true);
    
    function inputHandler(input) {
        setEmailInput(input)
    }

    function onPressHandler() {
        setEmailInput('')
    }

    function iconHandler() {
        if (!emailInput.includes('@')) {
            setCheckEmail(false)
            Alert.alert("password is too short or passwords don't match, please try again");
        }
        userCtx.editEmail(emailInput)
        changeUserProfile(userCtx.userprofile)
        navigation.replace('userProfile')
    }

    useEffect(() => {
        setCheckEmail(true)
        setEmailInput(emailInput)
    }, [emailInput])

    return (
        <View>
            <UserTextContainer 
            text = "Email" 
            onPressHandler={onPressHandler}
            inputHandler={inputHandler}
            value = {emailInput}
            checkInput={checkEmail}/>

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

export default ChangeEmail

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        marginTop: 5
    }
})