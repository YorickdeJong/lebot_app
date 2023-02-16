
import {View, Text, StyleSheet,} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Icon from '../../components/Icon'
import { ColorsBlue } from '../../constants/palet'


function UserTextContainer({text, onPressHandler, inputHandler, value, checkInput}) {
    return(
        <View style = {styles.outerContainer}>
            <Text style = {styles.text}>{text}</Text>
            <View style = {[checkInput ? styles.outerInputContainer : [styles.outerInputContainer, {backgroundColor: ColorsBlue.error300}]]}>
                <TextInput 
                style = {styles.innerInputContainer}
                onChangeText ={inputHandler}
                value = {value}
                />
                <Icon 
                icon = 'close'
                size = {24}
                color = {ColorsBlue.blue500}
                addStyle = {styles.iconStyle}
                onPress  = {onPressHandler}/>
            </View>
        </View>
    )
}

export default UserTextContainer

const styles = StyleSheet.create({
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: 'bold'
    },
    outerInputContainer: {
        marginTop: 10, 
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: ColorsBlue.blue200,
    },
    innerInputContainer: {
        height: 35,
        paddingLeft: 10,
        width: "80%"
    },
    iconContainer: {
        height: 40, 
        backgroundColor: ColorsBlue.blue400
    },
    outerContainer: {
        margin: 20
    },
    iconStyle: {
        marginTop: 5
    }
})