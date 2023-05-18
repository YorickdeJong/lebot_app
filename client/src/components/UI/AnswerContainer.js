
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Icon from '../Icon';
import { ColorsBlue, ColorsGray } from '../../constants/palet';
import { LinearGradient } from 'expo-linear-gradient';



function AnswerContainer({input, inputContainer, backgroundColor, setInputDetails, maxTries, filteredTry, correctAnswers, validateInput, performedMeasurement, chartNumber, setChartNumber, placeholder}){
    
    console.log('performedMeasurement', performedMeasurement)
    return (
        <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 5,  marginLeft: 17, marginRight: 15}}>
            <LinearGradient 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors = {[backgroundColor[0], backgroundColor[1]]}
            style = {{flex: 2.7, borderRadius: 12, marginRight: 5}}>
                <TextInput 
                style = {inputContainer}
                placeholder = {placeholder}
                placeholderTextColor={ColorsGray.gray900}
                onChangeText={setInputDetails}
                value = {input}
                editable={correctAnswers === 1 || filteredTry === maxTries ? false : true}
                />
            </LinearGradient>
            {performedMeasurement &&
            <LinearGradient 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors = {[backgroundColor[0], backgroundColor[1]]} 
            style = {{flex: 1, marginRight: 3, borderRadius: 12}}>
                <TextInput 
                style = {inputContainer}
                placeholder = "Meting nr."
                placeholderTextColor={ColorsGray.gray900}
                onChangeText={setChartNumber}
                value = {chartNumber}
                keyboardType="number-pad"
                editable={correctAnswers === 1 || filteredTry === maxTries ? false : true}
                />
            </LinearGradient>
            }
                <Icon
                size = {36}
                color = {backgroundColor[1]}
                icon= 'checkbox'
                onPress = {validateInput}/>
        </View>
    )
}

export default AnswerContainer;


const styles = StyleSheet.create({

})