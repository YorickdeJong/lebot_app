
import {View, StyleSheet} from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { ColorsBlue } from '../../constants/palet';
import Icon from '../Icon';

function InputContainer({inputValue, setInputValue, sendMessage, marginBottomTextInput, heightTextInput, marginTopTextInput}) {
    
    
    return(
        <View style = {[styles.inputContainer, {marginBottom: marginBottomTextInput, height: heightTextInput, marginTop: marginTopTextInput}]}>
            <TextInput
                value={inputValue} 
                onChangeText={setInputValue} 
                style={styles.textInput}/>
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
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ColorsBlue.blue100,
        shadowOffset: { height: 2, width: 0 },
        shadowRadius: 5,
        shadowColor: ColorsBlue.blue500,
        shadowOpacity: 0.5,
        elevation: 2,
        marginHorizontal: 20,
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 10,
        fontSize: 16,
        color: ColorsBlue.blue900,
         height: "100%"
    },
})