
import {View, Text, StyleSheet, TextInput, Dimensions} from 'react-native'
import { ColorsBlue } from '../../constants/palet'



function TextInputThinkScreen({questions, inputText, setInputText, height}) {
    return (
        <View style={[styles.textInput, {flex: 1, minHeight:  height / 3.5 }]}>
        <Text style = {[styles.text, {color: 'black', paddingBottom: 3}]}>{questions}</Text>
        <View style = {{borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 10}}/>
                <TextInput
                    style={{flex: 1, lineHeight: 24, fontSize: 14}}
                    value={inputText}
                    onChangeText={text => setInputText(text)}
                    placeholder="Type hier jouw antwoord..."
                    multiline={true}   // Enable multiline input
                    textAlignVertical="top" // Align text to the top of the TextInput
                /> 
        </View>
    )
}

export default TextInputThinkScreen

const styles = StyleSheet.create({
    textInput: {
        borderColor: 'gray', 
        borderWidth: 1.2, 
        margin: 10, 
        backgroundColor: 'rgba(175, 175, 155, 0.9)', 
        paddingHorizontal: 20, 
        borderRadius: 15, 
        paddingTop: 10, 
        marginBottom: 10, 
        fontSize: 20,
                
    },
    text: {
        fontSize: 23,
        fontWeight: '300',
        color: ColorsBlue.blue50,
        textAlign: 'center',

    },
})