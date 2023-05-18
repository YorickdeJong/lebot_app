
import {View, StyleSheet} from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { ColorsBlue } from '../../constants/palet';
import Icon from '../Icon';

function InputContainer({inputValue, setInputValue, sendMessage, marginBottomTextInput, heightTextInput, marginTopTextInput, placeholder}) {
    
    
    return(
        <View style = {[styles.inputContainer, {marginBottom: marginBottomTextInput + 5, height: heightTextInput, marginTop: marginTopTextInput}]}>
            <TextInput
                value={inputValue} 
                onChangeText={setInputValue} 
                style={styles.textInput}
                placeholder = {placeholder}    
                />
            <View style = {{justiyContent: 'center', alignItems: 'center', marginRight: 5}}>
                <Icon 
                icon = "send-outline"
                onPress = {sendMessage}
                color = {ColorsBlue.blue400}
                size = {28}

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
        backgroundColor: ColorsBlue.blue200,
        shadowOffset: { height: 2, width: 1 },
        shadowRadius: 3,
        shadowColor: ColorsBlue.blue1400,
        shadowOpacity: 1,
        elevation: 2,
        marginHorizontal: 20,
        borderRadius: 20,
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: 16,
        color: ColorsBlue.blue900,
        height: "100%"
    },
})