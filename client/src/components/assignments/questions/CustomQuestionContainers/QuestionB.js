
import { useContext, useState } from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import { ColorsBlue, ColorsGray } from '../../../../constants/palet';
import Icon from '../../../Icon';
import { UserProfileContext } from '../../../../store/userProfile-context';

function QuestionB({filteredTryOpenQuestions, numberAnsweredCorrectMotors, getBackgroundColor, maxTriesTwo, validateInput}) {
    const [motorNumber, setMotorNumber] = useState("");
    const [requirement, setRequirement] = useState({
        reqOne: null,
        reqTwo: null,
        reqThree: null,
        reqFour: null,
        reqFive: null,
    });
    const userprofileCtx = useContext(UserProfileContext);
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;

    function checkAnswerHandler() {
        if (!school_id || !class_id || !group_id) {
            Alert.alert('Voeg eerst een klas en group toe om vragen te kunnen beantwoorden')
        }
                                                                                                                                                                                               
        if (filteredTryOpenQuestions >= maxTriesTwo) {
            Alert.alert("Je hebt geen pogingen meer over!");
            return;
        }

        Alert.alert(
            '',
            'Weet je zeker dat je dit antwoord wilt kiezen?',
            [
                {
                    text: 'No',
                    onPress: () => {console.log('pressed')},
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            setFilteredTry(filteredTry + 1);
                         
                            
                            const correctNumber = correctness.filter(correct => correct === true).length
                            
                            // if all answers are correct, show alert
                            if (correctNumber === 8) {           
                                Alert.alert('Antwoord is goed!')
                            }
                            else {
                                // haal te verdienen muntjes van vraag af
                                Alert.alert('Jouw antwoord is nog niet helemaal goed!')
                            }
                            

                            // Send the data after the tile color has been updated
                            await sendData(indexEquality, correctness, true);
                        }   
                        catch(error) {
                            console.log(error);
                            Alert.alert('Er is iets mis gegaan bij het beantwoorden van de vraag!')
                        }
                    }
                }
            ]
        )
    }

    function requirementHandler(type){
        switch(type){
            case 1:
                setRequirement({...requirement, reqOne: motorNumber});
                break;
            case 2:
                setRequirement({...requirement, reqTwo: motorNumber});
                break;
            case 3:
                setRequirement({...requirement, reqThree: motorNumber});
                break;
            case 4:
                setRequirement({...requirement, reqFour: motorNumber});
                break;
            case 5:
                setRequirement({...requirement, reqFive: motorNumber});
                break;
            default:
                break;
        }
    }




    function getBackgroundColor(correctAnswers, tries, maxTries) {
        if (correctAnswers === 1 ) {
            return 'rgba(10, 45, 40, 1)';
        }
        
        if (tries >= maxTries) { 
            return correctAnswers === 1 ? 'rgba(10, 45, 40, 1)': 'rgba(60, 20, 10,1 )'
        }
        
        return ColorsBlue.blue1100;
    }


    const backgroundColor = getBackgroundColor(numberAnsweredCorrectMotors, filteredTryOpenQuestions, maxTriesTwo);
    const inputContainer = [styles.inputContainer, { backgroundColor }];


    return (
        <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 5,  marginLeft: 11, marginRight: 9}}>
            <View style = {{flex: 2}}>
                <TextInput 
                style = {inputContainer}
                placeholder = "Motor nr."
                placeholderTextColor={ColorsGray.gray600}
                onChangeText={setMotorNumber}
                value = {motorNumber}
                keyboardType="number-pad"
                editable={numberAnsweredCorrectMotors === 1 || filteredTryOpenQuestions === maxTriesTwo ? false : true}
                />
            </View>
            <View style = {{flex: 1}}>
                <TextInput 
                style = {inputContainer}
                placeholder = "1."
                placeholderTextColor={ColorsGray.gray600}
                onChangeText={requirementHandler.bind(this, 1)}
                value = {requirement.reqOne}
                keyboardType="number-pad"
                editable={numberAnsweredCorrectMotors === 1 || filteredTryOpenQuestions === maxTriesTwo ? false : true}
                />
            </View>
            <View style = {{flex: 1}}>
                <TextInput 
                style = {inputContainer}
                placeholder = "2."
                placeholderTextColor={ColorsGray.gray600}
                onChangeText={requirementHandler.bind(this, 2)}
                value = {requirement.reqOne}
                keyboardType="number-pad"
                editable={numberAnsweredCorrectMotors === 1 || filteredTryOpenQuestions === maxTriesTwo ? false : true}
                />
            </View>
            <View style = {{flex: 1}}>
                <TextInput 
                style = {inputContainer}
                placeholder = "3."
                placeholderTextColor={ColorsGray.gray600}
                onChangeText={requirementHandler.bind(this, 3)}
                value = {requirement.reqOne}
                keyboardType="number-pad"
                editable={numberAnsweredCorrectMotors === 1 || filteredTryOpenQuestions === maxTriesTwo ? false : true}
                />
            </View>
            <View style = {{flex: 1}}>
                <TextInput 
                style = {inputContainer}
                placeholder = "4."
                placeholderTextColor={ColorsGray.gray600}
                onChangeText={requirementHandler.bind(this, 4)}
                value = {requirement.reqOne}
                keyboardType="number-pad"
                editable={numberAnsweredCorrectMotors === 1 || filteredTryOpenQuestions === maxTriesTwo ? false : true}
                />
            </View>
            <View style = {{flex: 1}}>
                <TextInput 
                style = {inputContainer}
                placeholder = "5."
                placeholderTextColor={ColorsGray.gray600}
                onChangeText={requirementHandler.bind(this, 5)}
                value = {requirement.reqOne}
                keyboardType="number-pad"
                editable={numberAnsweredCorrectMotors === 1 || filteredTryOpenQuestions === maxTriesTwo ? false : true}
                />
            </View>
            <Icon 
            size = {36}
            color = {ColorsBlue.blue200}
            icon= 'checkbox'
            onPress = {checkAnswerHandler}/>
        </View>
    )   
}

export default QuestionB;


const styles = StyleSheet.create({
    inputContainer: {
        marginRight: 5,
        height: 30,
        borderRadius: 5, 
        backgroundColor: ColorsBlue.blue200,
        elevation: 2,
        shadowOffset: {height:2, width:0 },
        shadowRadius: 5,
        shadowColor: ColorsBlue.blue1300,
        shadowOpacity: 0.5,
        borderWidth: 0.45,
        borderColor: ColorsBlue.blue700,
        textAlign: 'center'
    },
})