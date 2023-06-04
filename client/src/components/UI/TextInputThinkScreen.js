
import {View, Text, StyleSheet, TextInput, Dimensions} from 'react-native'
import { ColorsBlue, ColorsGray } from '../../constants/palet'



function TextInputThinkScreen({questions, inputText, setInputText, height}) {
    return (
        <View style={[styles.textInput, {flex: 1, minHeight:  height / 3.5 }]}>
        <Text style = {[styles.text, {color: ColorsGray.gray300, paddingBottom: 10}]}>{questions}</Text>
        <View style = {{borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 10}}/>
                <TextInput
                    style={{flex: 1, lineHeight: 24, fontSize: 14, color: ColorsGray.gray300}}
                    value={inputText}
                    onChangeText={text => setInputText(text)}
                    placeholder="Type hier jouw antwoord..."
                    placeholderTextColor = {ColorsGray.gray400}
                    multiline={true}   // Enable multiline input
                    textAlignVertical="top" // Align text to the top of the TextInput
                /> 
        </View>
    )
}

export default TextInputThinkScreen

const styles = StyleSheet.create({
    textInput: {
        margin: 10, 
        backgroundColor: ColorsBlue.blue1390, 
        paddingHorizontal: 20, 
        borderRadius: 15, 
        paddingTop: 10, 
        fontSize: 20,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: {height: 2, width: 1},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,     
        borderWidth: 0.8,
        borderColor: `rgba(77, 77, 77, 0.2)`,  
    },
    text: {
        fontSize: 23,
        fontWeight: '300',
        textAlign: 'center',

    },
})