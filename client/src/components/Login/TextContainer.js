import { useContext } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native"
import {ColorsBlue, ColorsGreen } from "../../constants/palet"
import { ColorContext } from "../../store/color-context";

function TextContainer({textContent, setUserDetails, value, isValid, addStyle, secure}) {
    const colorCtx = useContext(ColorContext);
    
    const backgroundChoice = colorCtx.isBlue ? ColorsGreen.green400 : ColorsBlue.blue400
    const shadow = colorCtx.isBlue ? ColorsGreen.green1200: ColorsBlue.blue1200
    const textInput = [styles.textInput, {backgroundColor: backgroundChoice,  shadowColor: shadow}]

    return(
    <View style = {addStyle}>
        <Text style={[styles.text, {color: colorCtx.isBlue ? ColorsGreen.green200 : ColorsBlue.blue200}]}>{textContent}</Text>
        <TextInput 
        style= {[textInput, isValid && {backgroundColor: ColorsGreen.error300}]}
        onChangeText = {setUserDetails}
        value={value}
        secureTextEntry={secure}
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
        marginTop: 5,
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