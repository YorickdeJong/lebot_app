
import {View, StyleSheet} from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { ColorsBlue, ColorsGray, ColorsTile } from '../../constants/palet';
import Icon from '../Icon';

function InputContainer({inputValue, setInputValue, sendMessage, marginBottomTextInput, inputContainer, heightTextInput, marginTopTextInput, placeholder}) {
    
    const input = inputContainer ? inputContainer : styles.inputContainer
    return(
        <View style = {[input, {marginBottom: marginBottomTextInput + 5, height: heightTextInput, marginTop: marginTopTextInput}]}>
            <TextInput
                value={inputValue} 
                onChangeText={setInputValue} 
                style={styles.textInput}
                placeholder = {placeholder}   
                placeholderTextColor = {ColorsGray.gray500}//ColorsBlue.blue400} 
                />
            <View style = {{justiyContent: 'center', alignItems: 'center', marginRight: 5}}>
                <Icon 
                icon = "send"
                onPress = {sendMessage}
                color = {ColorsBlue.blue500}
                size = {26}

                />
            </View>
        </View>
    )
}

export default InputContainer;

const styles = StyleSheet.create({
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorsBlue.blue1150,
        shadowOffset: { height: 3, width: 1 },
        shadowRadius: 3,
        shadowColor: ColorsBlue.blue1400,
        shadowOpacity: 1,
        elevation: 2,
        marginHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.15)`,
        shadowColor: `rgba(1, 1, 1, 1)`,
        shadowOffset: {height: 2, width: 1},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 5,
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: 16,
        color: ColorsGray.gray400,
        height: "100%"
    },
})