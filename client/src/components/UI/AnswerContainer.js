
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Icon from '../Icon';
import { ColorsBlue, ColorsGray } from '../../constants/palet';
import { LinearGradient } from 'expo-linear-gradient';



function AnswerContainer({input, inputContainer, backgroundColor, setInputDetails, maxTries, filteredTry, correctAnswers, validateInput, performedMeasurement, chartNumber, setChartNumber, placeholder}){
    
    return (
        <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 5,  marginLeft: 17, marginRight: 15, shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: { height: 2, width: 1 },
        shadowRadius: 3,
        shadowOpacity: 1,
        }}>
            <View 
            style = {{flex: 2.7,  marginRight: 6,  backgroundColor: Platform.OS === 'android' ? 'rgba(0, 0, 0, 1)' : 'transparent',
            borderTopLeftRadius: 10, 
            borderBottomLeftRadius: 10, }}>
                <TextInput 
                style = {inputContainer}
                placeholder = {placeholder}
                placeholderTextColor={ColorsGray.gray300}
                onChangeText={setInputDetails}
                value = {input}
                editable={correctAnswers === 1 || filteredTry === maxTries ? false : true}
                />
            </View>
            {performedMeasurement &&
            <View 
            style = {{flex: 1.1, marginRight: 2, backgroundColor: Platform.OS === 'android' ? 'rgba(0, 0, 0, 1)' : 'transparent',
            }}>
                <TextInput 
                style = {[inputContainer, {paddingLeft: 5, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderColor: 'rgba(77,77,77, 0.2)'}]}
                placeholder = "Meting nr."
                placeholderTextColor={ColorsGray.gray300}
                onChangeText={setChartNumber}
                value = {chartNumber}
                keyboardType="number-pad"
                editable={correctAnswers === 1 || filteredTry === maxTries ? false : true}
                />
            </View>
            }
            <Icon
            size = {55}
            color = {ColorsBlue.blue1150}
            icon= 'md-checkbox-sharp'
            onPress = {validateInput}
            />
            <Icon
                icon='md-checkmark'
                size={41} // Adjust the size to fit within the checkbox
                color={ColorsGray.gray300}
                onPress={validateInput}
                addStyle={{position: 'absolute', top: 6.25, right: 8}}
                addBorder
            />
        </View>
    )
}

export default AnswerContainer;


const styles = StyleSheet.create({

})