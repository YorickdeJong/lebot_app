
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Icon from '../Icon';
import { ColorsBlue, ColorsGray } from '../../constants/palet';



function AnswerContainer({input, inputContainer, setInputDetails, maxTries, filteredTry, correctAnswers, validateInput, performedMeasurement, chartNumber, setChartNumber, placeholder}){
    
    console.log('performedMeasurement', performedMeasurement)
    return (
        <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 5,  marginLeft: 11, marginRight: 9}}>
            <View style = {{flex: 2.7}}>
                <TextInput 
                style = {inputContainer}
                placeholder = {placeholder}
                placeholderTextColor={ColorsGray.gray600}
                onChangeText={setInputDetails}
                value = {input}
                editable={correctAnswers === 1 || filteredTry === maxTries ? false : true}
                />
            </View>
            {performedMeasurement &&
            <View style = {{flex: 1}}>
                <TextInput 
                style = {inputContainer}
                placeholder = "Meting nr."
                placeholderTextColor={ColorsGray.gray600}
                onChangeText={setChartNumber}
                value = {chartNumber}
                keyboardType="number-pad"
                editable={correctAnswers === 1 || filteredTry === maxTries ? false : true}
                />
            </View>
            }
                <Icon
                size = {36}
                color = {ColorsBlue.blue200}
                icon= 'checkbox'
                onPress = {validateInput}/>
        </View>
    )
}

export default AnswerContainer;


const styles = StyleSheet.create({

})