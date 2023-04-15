import { useContext } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native"
import {ColorsBlue, ColorsGray, ColorsGreen } from "../../constants/palet"
import { ColorContext } from "../../store/color-context";

function TextContainer({placeholder, setUserDetails, value, isValid, addStyle, secure}) {
 
    const backgroundChoice = ColorsBlue.blue200
    const shadow = ColorsBlue.blue1200
    const textInput = [styles.textInput, {backgroundColor: backgroundChoice,  shadowColor: shadow}]

    return(
    <View style = {addStyle}>
        <TextInput 
        style= {[textInput, isValid && {backgroundColor: ColorsGreen.error300}]}
        onChangeText = {setUserDetails}
        value={value}
        secureTextEntry={secure}
        placeholder={placeholder}
        placeholderTextColor={ColorsGray.gray700}
        />
    </View>
    )
}

export default TextContainer

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1
    },
    text: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 17,
        fontWeight: 'bold'
    },
    textInput: {
        marginTop: 20,
        marginHorizontal: 20,
        height: 30,
        borderRadius: 5, 
        elevation: 2,
        shadowOffset: {height:2, width:0 },
        shadowRadius: 5,
        shadowColor: ColorsBlue.blue200,
        shadowOpacity: 0.5,
        paddingLeft: 5
    }
})