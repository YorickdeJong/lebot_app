import {useState, useEffect, useContext} from 'react'
import UserTextContainer from '../../components/userProfile/UserTextContainer'
import {View, StyleSheet, Alert} from 'react-native'
import Icon from '../../components/Icon';
import { ColorsBlue } from '../../constants/palet';
import { UserProfileContext } from '../../store/userProfile-context';
import { changeUserProfile } from '../../hooks/auth';

function ChangeUserName({route, navigation}) {
    const username = route.params.username
    const userCtx = useContext(UserProfileContext)

    const [usernameInput, setUsernameInput] = useState(username)
    const [checkUsername, setCheckUsername] = useState(true)

    function inputHandler(input) {
        setUsernameInput(input)
    }
    
    function onPressHandler() {
        setUsernameInput('')
    }
    
    function iconHandler() {
        if (usernameInput.length < 6) {
            setCheckUsername(false)
            Alert.alert("Username is too short, please include more characters");
        }
        
        userCtx.editUsername(usernameInput)
        changeUserProfile(userCtx.userprofile)
        navigation.replace('userProfile')
    }

    useEffect(() => {
        setCheckUsername(true)
        setUsernameInput(usernameInput)
    }, [usernameInput])


    return (
        <View>
            <UserTextContainer
            text="Username" 
            onPressHandler={onPressHandler}
            inputHandler={inputHandler}
            value={usernameInput}
            checkInput = {checkUsername}/> 
            <View style = {styles.iconContainer}>
                <Icon   
                icon = "checkmark-done-circle-outline"
                size = {50}
                color = {ColorsBlue.blue200}
                onPress = {iconHandler}/>
            </View>
        </View>
    )
}

export default ChangeUserName

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        marginTop: 5
    }
})