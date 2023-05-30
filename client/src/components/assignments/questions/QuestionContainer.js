import { BlurView } from "expo-blur";;
import React, { useContext, useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { ColorsBlue, ColorsDarkerGreen, ColorsGray, ColorsGreen, ColorsLighterGold, ColorsRed, ColorsTile } from "../../../constants/palet"
import { AssignmentDetailsContext } from "../../../store/assignment-Details-context";
import { CarContext } from "../../../store/car-context";
import { UserProfileContext } from "../../../store/userProfile-context";
import Icon from "../../Icon"
import SwitchScreensQuestions from "./SwitchScreensQuestions";
import MultipleChoiceContainer from "./MultipleChoiceContainer";
import { getSpecificAssignmentsDetail } from "../../../hooks/assignmentDetails";
import AnswerContainer from "../../UI/AnswerContainer";
import { TimeContext } from "../../../store/time-context";
import { LinearGradient } from "expo-linear-gradient";




function QuestionContainer({
    questionData, 
    assignmentNumber, 
    normal_and_multiple_choice, 
    generate_answer, 
    performedMeasurement, 
    CustomContainer, 
    answersStudent, 
    input, 
    setInput,
    chatgptAnswer,
    chartAvailable,
    }) {
    
    const [chartNumber, setChartNumber] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0); //make it such that this is set to data from context 
    const userprofileCtx = useContext(UserProfileContext);
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);
    const completionStatus = assignmentDetailsCtx.getCompletionStatusAssignment(questionData.assignment_number, questionData.title)
    const [showDescription, setShowDescription] = useState(false);
    const addAssignmentDetails = assignmentDetailsCtx.addAssignmentDetails;
    const [filteredTry, setFilteredTry] = useState(0);
    const maxTries = 3;
    const timeCtx = useContext(TimeContext);
    
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
                setCorrectAnswers(correctAnswersFromData.length)
                setInput(correctAnswersFromData[0].answer)
                setChartNumber(correctAnswersFromData[0].chartNumber)
            }
        }
        fetchData();
    }, [])
    
    useEffect(() => {
        setShowDescription(false);
    }, [questionData])
    
    
    //define useEffect to getspefic assignment details
    async function sendData(data, correctness, isMultipleChoice, answerNumber) {
        let answers_multiple_choice = null
        let answers_open_questions = null

        // change either open questions or multiple choice
        if (Array.isArray(data)) {
            if (data.length > 1) {
                answers_multiple_choice = data.map((dataObj, index) => {
                    return { answer: dataObj, correct: correctness[index] };
                });
            } 
        }
        else{
            //distinguish between answer with both multiple choice and open questions
            if (isMultipleChoice) {
                answers_multiple_choice =  { answer: data, correct: correctness }
            }
            else {
                answers_open_questions = { answer: data, correct: correctness, chartNumber: chartNumber, answerNumber: answerNumber }
            }
        }
        
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
    
    function checkTimerActive() {
        const activeLesson = timeCtx.filterActiveTimers(class_id);
        const {subject, planeet} = lessonSelection(activeLesson)
        

        if (activeLesson !== null) {
            Alert.alert('Discussie Tijd!', `Discussieer met elkaar over het onderwerp ${subject} ${planeet}`)
            return false
        }
        return true
    }

    function expandDescriptionHandler(){
        setShowDescription(!showDescription)
    }
    
    let questions = '';
    
    if (normal_and_multiple_choice || CustomContainer) {
        questions = questionData.question.split('§');
    }

    

    function setInputDetails(textInput) {
        setInput(textInput);
    }

    async function validateInput() {
        if (!school_id || !class_id || !group_id) {
            Alert.alert('Voeg eerst een klas en group toe om vragen te kunnen beantwoorden')
            return 
        }
 
        if (!checkTimerActive()){
            return
        }

        if (correctAnswers === 1 || filteredTry === maxTries) {
            Alert.alert('Je hebt deze vraag al beantwoord')
            return
        }


        if (input === '' || (performedMeasurement && chartNumber === null)) {
            Alert.alert('Vul alle velden in')
            return
        }

        if (performedMeasurement && !chartAvailable) {
            Alert.alert('Doe eerst een meting voordat je een antwoord kan geven')
            return
        }

        assignmentDetailsCtx.incrementTriesOpenQuestions(questionData.subject, questionData.assignment_number, questionData.title)
        setFilteredTry(filteredTry + 1)
        //calculates answer based on users findings
        if (generate_answer) {
            // call generate answers here                                                                                                                               
            const isCorrect = await generate_answer(input, chartNumber, school_id, class_id, group_id, questionData.title, questionData.assignment_number, questionData.subject)
            if (isCorrect) {
                setCorrectAnswers(correctAnswers + 1);
                Alert.alert('Antwoord Correct!');
                //Add different color to answer container + display answer in answer container
            }
            else {
                Alert.alert('Antwoord Incorrect!');
            }
            await sendData(input, isCorrect, false)
            
        }
        else{
            let isCorrect = false;
            if (input === questionData.answer){
                isCorrect = true;
                setCorrectAnswers(correctAnswers + 1);
                Alert.alert('Antwoord Correct!');
            }   
            else{
                Alert.alert('Antwoord Incorrect!');
            }
            await sendData(input, isCorrect, false)
        }
    }



    const backgroundColor = getBackgroundColor(correctAnswers, filteredTry, maxTries);
    const inputContainer = [styles.inputContainer, {backgroundColor: backgroundColor}];

    return (
        <View style = {styles.shadow}>

            <View style = {styles.container}>

                    <View intensity={0} tint = "dark" style = {styles.outerContainer}>
                                
                        <LinearGradient 
                        colors = {[ColorsBlue.blue1300, ColorsBlue.blue1200, ColorsBlue.blue1300,]} 
                        style = {styles.header}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        >
                            <Text style = {styles.headerText}>{completionStatus ? "Vraag Voltooid" : `Vraag ${assignmentNumber}`}</Text>
                        </LinearGradient>
                            
                        <View style = {styles.questionContainer}>

                            {((normal_and_multiple_choice || !questionData.multiple_choice) && !CustomContainer) &&
                                <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 40}}>
                                    <Text style = {[styles.tries, {marginTop: 5, color: ColorsGray.gray300}]}>Credits: €{questionData.currency}</Text>
                                    <Text style = {[styles.tries, {marginTop: 5}]}>Pogingen: {filteredTry ? filteredTry : 0 }/{maxTries}</Text>
                                </View>
                            }
                            
                            {!CustomContainer && 
                                <>
                                    <View style = {[styles.border, {marginHorizontal: 15}]}/>
                                        <View style = {{alignItems: 'center'}}>
                                            <View style={styles.descriptionContainer}>
                                                <Text style = {styles.question}>
                                                    {questions ? questions[0] : questionData.question}
                                                </Text>
                                            </View>
                                        </View>
                                    <View style = {[styles.border, {marginTop: 20, marginHorizontal: 15, marginBottom: 10}]}/>
                                </>
                            }
                            
                            {showDescription && completionStatus && 
                                <TouchableOpacity
                                    onPress = {expandDescriptionHandler}>
                                    <Text style = {[styles.question, {marginLeft: 15, marginTop: 10, color: ColorsBlue.blue50}]}>...minder</Text>
                                </TouchableOpacity>
                            }

                            {(!questionData.multiple_choice && !CustomContainer && !chatgptAnswer ) && 
                                <AnswerContainer 
                                    input = {input}
                                    inputContainer={inputContainer}
                                    backgroundColor = {backgroundColor}
                                    setInputDetails = {setInputDetails}
                                    validateInput = {validateInput}
                                    performedMeasurement = {performedMeasurement}
                                    maxTries = {maxTries}
                                    filteredTry = {filteredTry}
                                    correctAnswers = {correctAnswers}
                                    chartNumber = {chartNumber}
                                    setChartNumber = {setChartNumber}
                                    placeholder = {"Jouw Antwoord"}
                                />
                            }

                            {normal_and_multiple_choice &&
                            <>
                                <View style = {[styles.border, {marginHorizontal: 15, marginBottom: 10, marginTop: 20}]}/>
                                <View style={[styles.descriptionContainer, {marginTop: 10}]}>
                                    <Text style = {styles.question}>
                                        {questions[1]}
                                    </Text>
                                </View>
                                <View style = {[styles.border, {marginHorizontal: 15, marginBottom: 15}]}/>
                            </>
                            }

                            {(questionData.multiple_choice || normal_and_multiple_choice) && 
                                <MultipleChoiceContainer 
                                    multipleChoiceOptions={questionData.options}
                                    multipleChoiceAnswers={questionData.answers_multiple_choice}
                                    subject={questionData.subject}
                                    assignmentNumber={questionData.assignment_number}
                                    title={questionData.title}
                                    assignment_id={questionData.assignment_id}
                                    setCorrectAnswers={setCorrectAnswers}
                                    correctAnswers={correctAnswers}
                                    sendData={sendData}
                                    currency={questionData.currency}
                                    checkTimerActive={checkTimerActive}
                                />
                            }

                            {CustomContainer && 
                            <CustomContainer inputContainer={inputContainer}
                                questions = {questions}
                                answersStudent = {answersStudent}
                                filteredTry = {filteredTry}
                                subject={questionData.subject}
                                assignmentNumber={questionData.assignment_number}
                                title={questionData.title}
                                assignment_id={questionData.assignment_id}
                                setFilteredTry={setFilteredTry}
                                multipleChoiceAnswers={questionData.answers_multiple_choice}
                                sendData={sendData}
                                getBackgroundColor={getBackgroundColor}
                                openQuestionAnswer = {questionData.answer}
                                performedMeasurement = {performedMeasurement}
                                checkTimerActive={checkTimerActive}
                            />}
                        </View>


                        {/* Add chatgpt container here. Students have 2 tries. After 2 tries the answer is wrong, but they can still chat */}
                    </View>
            </View>
        </View>
    )
}

export default React.memo(QuestionContainer)

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


const styles= StyleSheet.create({
    header: {
        height: 45,
        shadowOffset: {height: 2, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 2,
    
    },
    inputContainer: {
        height: 40,
        paddingLeft: 10,
        color: ColorsGray.gray400,
        // backgroundColor: ColorsBlue.blue1150,
        borderTopLeftRadius: 10, 
        borderBottomLeftRadius: 10,
        marginRight: Platform.OS === 'android' ? 2 : 0,
        marginBottom: Platform.OS === 'android' ? 3 : 0,
        borderColor: 'rgba(77,77,77, 0.3)',
        borderWidth: 1,
    },
    headerText: {
        color: ColorsGray.gray500,
        fontSize: 25,
        paddingTop: 6,
        paddingRight: 0,
        textAlign: 'center',
        fontWeight: '302',
    },
    questionContainer: {
        marginHorizontal: 7,
        paddingTop: 10,
        paddingBottom: 5, 
        borderRadius: 5,
    },

    descriptionContainer: {
        flexDirection: 'row',
        marginVertical: 4,
        marginTop: 20,
        marginHorizontal: 20
    },
    question: {
        fontSize: 16,
        color: ColorsGray.gray500,
        lineHeight: 29
    },
    outerContainer: {
        paddingBottom: 10,
        flex: 1,
        overflow: 'hidden',
    },
    border: {
        borderWidth: 0.6,
        borderColor: `rgba(33, 33, 55, 0.7)`,
        marginTop: 10,
    },
    tries: {
        fontSize: 20,
        fontWeight: '200',
        textAlign: 'center',
        marginBottom: 10,
        color: ColorsGray.gray400,
        textShadowColor: ColorsBlue.blue1400,
        textShadowOffset: {height: 2, width: 0},
        textShadowRadius: 3,
    },
    container: {
        backgroundColor: ColorsBlue.blue1390,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 0.6,
        borderColor: `rgba(77, 77, 77, 0.2)`,
    },
    shadow: {
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: { height: 3, width: 1 },
        shadowRadius: 3,
        shadowOpacity: 1,
        backgroundColor: Platform.OS === 'android' ? 'rgba(0, 0, 0, 0.4)' :'transparent',
        paddingBottom: 3, 
        paddingRight: 2,
        marginHorizontal: 8,
        borderRadius: 20,
        marginVertical: 8,
    }
})