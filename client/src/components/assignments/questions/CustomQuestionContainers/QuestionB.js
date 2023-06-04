
import { useContext, useEffect, useState } from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import { ColorsBlue, ColorsGray } from '../../../../constants/palet';
import Icon from '../../../Icon';
import { UserProfileContext } from '../../../../store/userProfile-context';
import { TouchableOpacity } from 'react-native-gesture-handler';

function QuestionB({filteredTry, correctAnswers, getBackgroundColor, maxTriesTwo, validateInput, setInput, input}) {
    const [motorNumber, setMotorNumber] = useState("");
    const [requirement, setRequirement] = useState([ 0, 0, 0, 0, 0]);

    const userprofileCtx = useContext(UserProfileContext);
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;

    //make useEffect that sets motorNumber and reuirement based on input
    useEffect(() => {
        if(input) {
            const inputArray = input.split(",");
            setMotorNumber(inputArray[0])
            setRequirement(inputArray.slice(1))
        }
    }, [input])

    function requirementHandler(index) {
        let newRequirement = [...requirement];
        newRequirement[index] = newRequirement[index] === 1 ? 0 : 1;
        setRequirement(newRequirement);
        const newInput = [motorNumber, ...newRequirement].join(",");  // Use newRequirement instead of requirement
        setInput(newInput);
    }


    function getBackgroundColor(correctAnswers, tries, maxTries) {
        if (correctAnswers === 1 ) {
            return ['rgba(10, 45, 40, 1)', 2];
        }
        
        if (tries >= maxTries) { 
            return correctAnswers === 1 ? ['rgba(10, 45, 40, 1)', 2.3]: ['rgba(80, 20, 10,1 )', 2.3]
        }
        
        return [ColorsBlue.blue700, 0.45];
    }


    const [borderColor, borderWidth] = getBackgroundColor(correctAnswers, filteredTry, maxTriesTwo);
    const inputContainer = [styles.inputContainer, { borderColor: borderColor, borderWidth: borderWidth}];

    const tiles = requirement.map((value, index) => {
        return (
            <View style={{ flex: 1 }} key={index}>
            <TouchableOpacity
                style={inputContainer}
                disabled={correctAnswers === 1 || filteredTry === maxTriesTwo}
                onPress={() => requirementHandler(index)}
            >
                <Text style={{ color: ColorsGray.gray300, textAlign: 'center' }}>
                {value}
                </Text>
            </TouchableOpacity>
            </View>
        ); 
    });

    return (
        <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 5,  marginLeft: 11, marginRight: 9}}>
            <View style = {{flex: 2}}>
                <TextInput 
                style = {inputContainer}
                placeholder = "Motor nr."
                placeholderTextColor={ColorsGray.gray300}
                onChangeText={setMotorNumber}
                value = {motorNumber}
                keyboardType="number-pad"
                editable={correctAnswers === 1 || filteredTry === maxTriesTwo ? false : true}
                />
            </View>
            {tiles}
            <Icon
                size={34}
                color={ColorsBlue.blue400}
                icon='checkbox'
                onPress={validateInput.bind(this, true)}
            />
        </View>
        
    )   
}

export default QuestionB;


const styles = StyleSheet.create({
    inputContainer: {
        marginRight: 5,
        height: 30,
        borderRadius: 5, 
        color: ColorsGray.gray300,
        elevation: 2,
        shadowOffset: {height:2, width:0 },
        shadowRadius: 5,
        shadowColor: ColorsBlue.blue1300,
        shadowOpacity: 0.5,
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: ColorsBlue.blue1100,
    },
})