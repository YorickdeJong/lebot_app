import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Keyboard, Animated, View, StyleSheet, ImageBackground, Text, Alert } from 'react-native'
import Chat from '../../../chatgpt/Chat'
import { ColorsBlue, ColorsGray, ColorsRed } from '../../../../constants/palet';
import Icon from '../../../Icon';
import { ChatContext } from '../../../../store/chat-context';
import { UserProfileContext } from '../../../../store/userProfile-context';
import { AssignmentDetailsContext } from '../../../../store/assignment-Details-context';
import { getSpecificAssignmentsDetail } from '../../../../hooks/assignmentDetails';
import { TimeContext } from '../../../../store/time-context';


function ChatGPTQuestionsContainer({questionData}) {
    const keyboardHeight = useRef(new Animated.Value(0)).current;
    const chatCtx = useContext(ChatContext)
    const userprofileCtx = useContext(UserProfileContext)
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    const [filteredTry, setFilteredTry] = useState(0);
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);
    const addAssignmentDetails = assignmentDetailsCtx.addAssignmentDetails;
    const [isCorrect, setIsCorrect] = useState(false)
    const timeCtx = useContext(TimeContext);
    const maxTries = 100;

    useEffect(() => {
        async function fetchData() {
            const data = await getSpecificAssignmentsDetail(school_id, class_id, group_id, questionData.assignment_id, questionData.subject);
            
            if (data && data.answers_open_questions.length > 0) {
                console.log('answers user', data)
                const filteredData =  data.answers_open_questions.filter(answer => answer !== null)
                console.log('filteredData', filteredData)
                setFilteredTry(filteredData.length)
                
                const correctAnswersFromData = filteredData.filter(answer => answer.correct);
                console.log('correctAnswersFromData', correctAnswersFromData)
                setIsCorrect(correctAnswersFromData.length)
            }
        }
        fetchData();
    }, [])

    useEffect(() => {

        const keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', keyboardWillShow);
        const keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', keyboardWillHide);

        return () => {
            keyboardWillShowSub.remove();
            keyboardWillHideSub.remove();
            }

    }, []);

    const keyboardWillShow = useCallback((event) => {
        Animated.parallel([
        Animated.timing(keyboardHeight, {
            duration: event.duration,
            toValue: event.endCoordinates.height / 1.3,
            useNativeDriver: false
        }),
    ]).start();
    }, [keyboardHeight]);
    
    const keyboardWillHide = useCallback((event) => {
        Animated.parallel([
        Animated.timing(keyboardHeight, {
            duration: event.duration,
            toValue: 0,
            useNativeDriver: false
        }),
        ]).start();
    }, [keyboardHeight]);
    

    // add send data 
    // filter on Onjuist Correct bijna correct -> add to open answers 
    // validate answer 
    //define useEffect to getspefic assignment details
    async function sendData(correctness) {
        let answers_open_questions = null
        let answers_multiple_choice = null

        answers_open_questions = { answer: 'chatgpt', correct: correctness }

        const assignment_id = questionData.assignment_id
        const subject = questionData.subject
        
        try {
            addAssignmentDetails({
                school_id,
                class_id,
                group_id,
                assignment_id,
                subject,
                answers_multiple_choice,
                answers_open_questions
            });
        } 
        catch (error) {
            Alert.alert('Er is iets misgegaan met het beantwoorden van de vraag')
            console.log(error);
        }
    }

    function getBackgroundColor(correctAnswers, tries, maxTries) {
        if (correctAnswers === 1 ) {
            return 'rgba(10, 45, 40, 1)';
        }
        
        if (tries >= maxTries) {
            return correctAnswers === 1 ? 'rgba(10, 45, 40, 1)': 'rgba(60, 20, 10,1 )'
        }
        
        return ColorsBlue.blue1150;
    }

    async function validateInput(message, inputValue) { //SHOULD BE TRIGGERED WHEN USER SENDS A MESSAGE 
        // console.log('message', message.answer)

        if (!school_id || !class_id || !group_id) {
            Alert.alert('Voeg eerst een klas en group toe om vragen te kunnen beantwoorden')
            return 
        }
 
        if (!checkTimerActive()){
            return
        }

        if (isCorrect === 1 || filteredTry === maxTries) {
            Alert.alert('Je hebt deze vraag al beantwoord')
            return
        }

        console.log(inputValue)
        if (inputValue === '') {
            Alert.alert('Type eerst een antwoord')
            return
        }

        if (message.includes('Correct' || 'correct')){
            await sendData(true)
            setIsCorrect(true)
        }
        else {
            await sendData(false)
            setIsCorrect(false)
        }

        setFilteredTry(filteredTry + 1)
    }


    function checkTimerActive() {
        const activeLesson = timeCtx.filterActiveTimers(class_id);
        const {subject, planeet} = lessonSelection(activeLesson)
        

        if (activeLesson !== null) {
            Alert.alert('Discussie Tijd!', `Discussieer met elkaar over het onderwerp ${subject} ${planeet}`)
            return false
        }
        return true
    }

    const backgroundColor = getBackgroundColor(isCorrect, filteredTry, maxTries);
    const inputContainer = [styles.inputContainer, {backgroundColor: backgroundColor}];

    return (
        <Animated.View style = {[styles.container, {marginBottom: keyboardHeight ? keyboardHeight : 20}]}>
            <Icon 
                icon="trash-can-outline"
                size={28}
                onPress={() => chatCtx.deleteThread_ID(6)}
                color = {ColorsRed.red600}
                addStyle = {{position: 'absolute', top: 12, right: 18}}
                differentDir={true}
            />
            <View style = {{position: 'absolute', top: 12, left: '8%'}}>
                <Text style = {{fontSize: 20, color: ColorsGray.gray400}}>Pogingen {filteredTry}/{maxTries}</Text>
            </View>
            {userprofileCtx.userprofile.class_id &&
            <View style = {{marginTop: 40}}>
                <Chat 
                inputContainer = {inputContainer}
                validateInput = {validateInput}
                keyboardHeight={0}
                placeholder= {isCorrect === 1 ? "Vraag Correct beantwoord" : "Type hier je antwoord..."}
                customThread_id={6}
                customColor = 'rgba(15, 18, 70, 1)'
                />
            </View>
            }
            {!userprofileCtx.userprofile.class_id &&
            <View style = {{marginHorizontal: 20, marginBottom: 40}}>
                <Text style = {styles.text}>Voeg een klas toe om vragen te beantwoorden. Ga hiervoor naar instellingen en kies 'Groepen'</Text>
            </View>
            }
        
        
        </Animated.View>
    )
}

export default React.memo(ChatGPTQuestionsContainer)

function lessonSelection(lesson_number) {
    switch (lesson_number) {
        case 1:
            return {subject: 'Coderen Theorie', planeet: null}
        case 2: 
            return {subject: 'Beweging', planeet: 'Ga naar planeet 2 van de opdrachten over Fase 1'}
        case 3:
            return {subject: 'Reflecteer', planeet: 'Ga naar planeet 14'}
        case 4:
            return {subject: 'Schakelingen', planeet: 'Ga naar planeet 2 van de opdrachten over Fase 2'}
        case 5:
            return {subject: 'Reflecteer', planeet: 'Ga naar planeet 11 van de opdrachten over Fase 2'}
        case 6: 
            return {subject: 'Energie en Vermogen', planeet: 'Ga naar planeet 2 van de opdrachten over Fase 3'}
        case 7:
            return {subject: 'Reflecteer', planeet: 'Ga naar planeet 11 van de opdrachten over Fase 3'}
        default:
            return {subject: 'Unknown', planeet: null}; // default case
    }       
}

const styles = StyleSheet.create({
    container: {
        minHeight: 150,
        paddingTop: 40,
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.2)`,
        backgroundColor: ColorsBlue.blue1390,
        borderRadius: 20,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: {height: 3, width: 2},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 1,
        marginHorizontal: 8,
        marginTop: 0,
        marginBottom: 20,
    },
    text: {
        color: ColorsGray.gray300,
        fontSize: 22,
        textAlign: 'center',
        lineHeight: 26,

    },
    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
})