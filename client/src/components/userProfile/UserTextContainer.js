
import {View, Text, StyleSheet,} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Icon from '../../components/Icon'
import { ColorsBlue } from '../../constants/palet'


function UserTextContainer({text, onPressHandler, inputHandler, value, checkInput, connectedText,
onSubmitEditing, secure}) {
    return(
        <View style = {styles.outerContainer}>
            <View style={styles.textContainer}>
                <Text style = {styles.text}>{text}</Text>
                <Text style = {[styles.text, {marginRight: 5, color: ColorsBlue.blue100}]}>{connectedText}</Text>
            </View>
            {/* <Text style = {styles.text}>{text}</Text> */}
            <View style = {[checkInput ? styles.outerInputContainer : [styles.outerInputContainer, {backgroundColor: ColorsBlue.error300}]]}>
                <TextInput 
                style = {styles.innerInputContainer}
                onChangeText ={inputHandler}
                value = {value}
                onSubmitEditing={onSubmitEditing}
                autoCapitalize='none'
                secureTextEntry = {secure}
                />
                <Icon 
                icon = 'close'
                size = {24}
                color = {ColorsBlue.blue500}
                addStyle = {styles.iconStyle}
                onPress  = {onPressHandler}   
                />
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
    textContainer:{
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },  
    outerInputContainer: {
        marginTop: 10,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: ColorsBlue.blue200,
        Platform: { 
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 1, height: 2 },
                shadowRadius: 3,
                shadowOpacity: 1,
            },
            android: {
                elevation: 5,
            }
        }

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
        marginTop: 5,
        marginRight: 5
    }
})