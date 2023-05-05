import { BlurView } from "expo-blur";;
import { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { ColorsBlue, ColorsGray, ColorsGreen, ColorsRed, ColorsTile } from "../../../constants/palet"
import { AssignmentDetailsContext } from "../../../store/assignment-Details-context";
import { CarContext } from "../../../store/car-context";
import { UserProfileContext } from "../../../store/userProfile-context";
import Icon from "../../Icon"
import SwitchScreensQuestions from "./SwitchScreensQuestions";
import MultipleChoiceContainer from "./MultipleChoiceContainer";
import { getSpecificAssignmentsDetail } from "../../../hooks/assignmentDetails";
import AnswerContainer from "../../UI/AnswerContainer";


function QuestionContainer({questionData, assignmentNumber, slideCount, prevSlideHandler, nextSlideHandler, slideCountEnd, normal_and_multiple_choice, generate_answer, performedMeasurement, CustomContainer, answersStudent, input, setInput}) {
    
    const [chartNumber, setChartNumber] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0); //make it such that this is set to data from context 
    const userprofileCtx = useContext(UserProfileContext);
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);
    const carCtx = useContext(CarContext);
    const completionStatus = assignmentDetailsCtx.getCompletionStatusAssignment(questionData.assignment_number, questionData.title)
    const [showDescription, setShowDescription] = useState(false);
    const addAssignmentDetails = assignmentDetailsCtx.addAssignmentDetails;
    const [filteredTry, setFilteredTry] = useState(0);
    const maxTries = 3;
 

    useEffect(() => {
        async function fetchData() {
            const data = await getSpecificAssignmentsDetail(school_id, class_id, group_id, questionData.assignment_id, questionData.subject);
            if (data && data.answers_open_questions.length > 0) {
                setFilteredTry(data.answers_open_questions.filter(answer => answer !== null).length)

                const correctAnswersFromData = data.answers_open_questions.filter(answer => answer.correct);
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
        if (data.length > 1) {
            answers_multiple_choice = data.map((dataObj, index) => {
                return { answer: dataObj, correct: correctness[index] }
            })
        }
        else{
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
            console.log('failed to send data to backend')
            console.log(error);
        }
    }
    
    function getBackgroundColor(correctAnswers, tries, maxTries) {
        if (correctAnswers === 1) {
            return ColorsGreen.green300;
        }
    
        if (tries === maxTries) {
            return correctAnswers === 1 ? ColorsGreen.green300 : ColorsRed.red700;
        }
    
        return ColorsBlue.blue200;
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
        console.log(input)
    }

    async function validateInput() {
        if (!school_id || !class_id || !group_id) {
            Alert.alert('Voeg eerst een klas en group toe om vragen te kunnen beantwoorden')
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
    const inputContainer = [styles.inputContainer, { backgroundColor }];

    console.log(questionData)
    return (
        <View style = {styles.container}>
            <BlurView intensity={10} tint = "dark" style = {styles.outerContainer}>
                <View style = {{zIndex: 1}}>
                    <SwitchScreensQuestions 
                        slideCount={slideCount}
                        prevSlideHandler={prevSlideHandler}
                        nextSlideHandler={nextSlideHandler}
                        slideCountEnd={slideCountEnd}
                    />
                </View>
                           
                <View style = {styles.header}>
                    <Text style = {styles.headerText}>{completionStatus ? "Vraag Voltooid" : `Vraag ${assignmentNumber}`}</Text>
                </View>
                    
                <View style = {styles.questionContainer}>
                    {((normal_and_multiple_choice || !questionData.multiple_choice) && !CustomContainer) &&
                        <Text style = {[styles.tries, {marginTop: 5}]}>Pogingen: {filteredTry ? filteredTry : 0 }/{maxTries}</Text>
                    }
                    
                    {!CustomContainer && <View style={styles.descriptionContainer}>
                        <Text style = {styles.question}>
                            {questions ? questions[0] : questionData.question}
                        </Text>

                        </View>
                    }
                    
                    {showDescription && completionStatus && <TouchableOpacity
                        onPress = {expandDescriptionHandler}>
                        <Text style = {[styles.question, {marginLeft: 15, marginTop: 10, color: ColorsBlue.blue50}]}>...minder</Text>
                    </TouchableOpacity>
                    }

                    {(!questionData.multiple_choice && !CustomContainer) &&
                    <AnswerContainer 
                        input = {input}
                        inputContainer={inputContainer}
                        setInputDetails = {setInputDetails}
                        validateInput = {validateInput}
                        performedMeasurement = {performedMeasurement}
                        maxTries = {maxTries}
                        filteredTry = {filteredTry}
                        correctAnswers = {correctAnswers}
                        chartNumber = {chartNumber}
                        setChartNumber = {setChartNumber}
                        placeholder = {"Jouw Antwoord"}
                    />}

                    {normal_and_multiple_choice &&
                    <>
                        <View style = {{marginHorizontal: 12}}>
                            <View style = {styles.border}/>
                        </View>
                        <View style={[styles.descriptionContainer, {marginTop: 10}]}>
                            <Text style = {styles.question}>
                                {questions[1]}
                            </Text>
                        </View>
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
                    />}
                </View>
            </BlurView>
        </View>
    )
}

export default QuestionContainer

const styles= StyleSheet.create({
    header: {
        height: 45,
        backgroundColor: `rgba(25, 25, 85, 0.6)`, //`rgba(45, 45, 85, 0.6)`,
        shadowColor: `rgba(11, 11, 11)`,
        shadowOffset: {height: 2, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 2,
    },
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
        paddingLeft: 5,
        color: ColorsBlue.blue1400
    },
    headerText: {
        color: ColorsBlue.blue50,
        fontSize: 25,
        paddingTop: 6,
        paddingRight: 0,
        textAlign: 'center',
        fontWeight: '300',
    },
    questionContainer: {
        marginHorizontal: 7,
        paddingTop: 10,
        paddingBottom: 5, 
        borderRadius: 5,
    },

    descriptionContainer: {
        flexDirection: 'row',
        marginLeft: 12,
        marginRight: 12,
        marginVertical: 4,
    },
    question: {
        fontSize: 16,
        color: ColorsGray.gray300,
        lineHeight: 21
    },
    outerContainer: {
        paddingBottom: 10,
        flex: 1
    },
    border: {
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.5)`,
        marginTop: 12,
    },
    tries: {
        fontSize: 20,
        fontWeight: '200',
        textAlign: 'center',
        marginBottom: 10,
        color: ColorsBlue.blue50,
        textShadowColor: ColorsBlue.blue1400,
        textShadowOffset: {height: 2, width: 0},
        textShadowRadius: 3,
    },
    container: {
        backgroundColor: 'rgba(0, 0, 20, 0.75)',
        marginVertical: 8,
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.5)`,
        shadowColor: `rgba(11, 11, 11)`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 2,
        marginHorizontal: 8,
    }
})