import React, { useContext, useEffect, useState } from "react";
import { ColorsBlue, ColorsGray, ColorsGreen, ColorsRed } from "../../../../constants/palet";
import { View, StyleSheet, Text, Alert, TouchableOpacity } from "react-native";
import Icon from "../../../Icon"
import Signs from "./Signs";
import ModalOptions from "./ModalOoptions";
import { UserProfileContext } from "../../../../store/userProfile-context";
import { AssignmentDetailsContext } from "../../../../store/assignment-Details-context";
import { getSpecificAssignmentsDetail } from "../../../../hooks/assignmentDetails";
import QuestionB from "./QuestionB";


function ProjectOneCustomContainer({checkTimerActive, filteredTry, questions, subject, assignment_number, assignment_id, title, setFilteredTry, multipleChoiceAnswers, sendData, getBackgroundColor, openQuestionAnswer}) {
    const [answersStudent, setAnswersStudent] = useState([])
    
    useEffect(() => {
        async function fetchData() {
            const studentAnswerQ2 = await getSpecificAssignmentsDetail(school_id, class_id, group_id, 34, 'MOTOR');
            const studentAnswerQ5 = await getSpecificAssignmentsDetail(school_id, class_id, group_id, 36, 'MOTOR');
    
            const studentAnswerQ2Filtered = studentAnswerQ2.answers_open_questions.filter(answer => answer !== null)
            const studentAnswerQ5Filtered = studentAnswerQ5.answers_open_questions.filter(answer => answer !== null)

            const arrayAnswers = [studentAnswerQ2Filtered[studentAnswerQ2Filtered.length - 1].answer, 
            studentAnswerQ5Filtered[studentAnswerQ5Filtered.length - 1].answer]
            setAnswersStudent(arrayAnswers)
        }
        fetchData()
  
      }, [])
    
    

    const [toggleModal, setToggleModal] = useState(false);
    const [indexEquality, setIndexEquality] = useState([
        {questionNumber: 1, index: 0, answer: '', color: ColorsBlue.blue200}, 
        {questionNumber: 1, index: 1, answer: '', color: ColorsBlue.blue200},
        {questionNumber: 2, index: 0, answer: '', color: ColorsBlue.blue200},
        {questionNumber: 3, index: 0, answer: '', color: ColorsBlue.blue200},
        {questionNumber: 3, index: 1, answer: '', color: ColorsBlue.blue200},
        {questionNumber: 4, index: 0, answer: '', color: ColorsBlue.blue200},
        {questionNumber: 5, index: 0, answer: '', color: ColorsBlue.blue200},
        {questionNumber: 5, index: 1, answer: '', color: ColorsBlue.blue200},   
    ]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [numberAnsweredCorrectSigns, setNumberAnsweredCorrectSigns] = useState(0);
    const [numberAnsweredCorrectMotors, setNumberAnsweredCorrectMotors] = useState(0);
    const [filteredTryOpenQuestions, setFilteredTryOpenQuestions] = useState(0);
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);
    const userprofileCtx = useContext(UserProfileContext);
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;

    const maxTriesOne = 4;
    const maxTriesTwo = 2;
    
    useEffect(() => {
        async function fetchData() {
            const data = await getSpecificAssignmentsDetail(school_id, class_id, group_id, assignment_id, subject);
            
            if (data && data.answers_open_questions.length > 0) {
                const filteredData = data.answers_multiple_choice.filter(answer => answer !== null)
                setFilteredTry(filteredData.length)
                // setFilteredTryOpenQuestions(filteredData.length)
                filteredData.forEach((innerArray) => {
                        innerArray.forEach((element) => {
                        // Find the corresponding indexEquality element and update it
                            const indexEqualityElement = indexEquality.find(
                                (item) =>
                                item.questionNumber === element.answer.questionNumber &&
                                item.index === element.answer.index
                            );
                    
                            console.log('element', element)
                            if (indexEqualityElement) {
                                indexEqualityElement.answer = element.answer.answer;
                                indexEqualityElement.color = element.correct ? ColorsGreen.green500 : ColorsRed.red500;
                            }
                        });
                  });
                  setNumberAnsweredCorrectSigns(indexEquality.filter((element) => element.color === ColorsGreen.green500).length);
                  setNumberAnsweredCorrectMotors(filteredData.filter((element) => element.correct === true).length);
                  
                  // Set the updated indexEquality state
                  setIndexEquality([...indexEquality]);
            }
        }
        fetchData();
    }, [])

    function checkAnswerHandler() {
        if (!school_id || !class_id || !group_id) {
            Alert.alert('Voeg eerst een klas en group toe om vragen te kunnen beantwoorden')
        }
        if (!checkTimerActive()){
            return
        }

        const hasEmptyField = indexEquality.some(indexObject => indexObject.answer === '');

        if (hasEmptyField) {
          Alert.alert('Vul alle velden in');
          return;
        }

        if (filteredTry >= maxTriesOne) {
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
                            // increment tries
                            if (filteredTry < maxTriesOne) {
                                assignmentDetailsCtx.incrementTriesMultipleChoice(subject, assignment_number, title);
                            }
                            
                            setFilteredTry(filteredTry + 1);
                            const correctness = indexEquality.map((element, index) => 
                            element.answer === multipleChoiceAnswers[index])       
                            
                            const updatedIndexEquality = indexEquality.map((element, index) => {
                                return {
                                    ...element,
                                    color: correctness[index] ? ColorsGreen.green500 : ColorsRed.red500
                                };
                            });
                            
                            setIndexEquality(updatedIndexEquality);
                            
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



    function toggleModalHandler(questionNumber, index) {
        setCurrentIndex({questionNumber, index})
        setToggleModal(true)
    }

    function chooseEqualityHandler(questionNumber, index, answer) {
        setIndexEquality(prevIndexEquality => prevIndexEquality.map(row => {
            if (row.questionNumber === questionNumber && row.index === index) {
                return {
                    ...row,
                    answer: answer
                };
            }
            return row;
        }));
        setToggleModal(false);
    }

    //set input container like: motornumber,eis1,eis2,etc.
    return (
        <View>
            <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 32}}>
                <Text style = {[styles.tries, {marginTop: 5}]}>Pogingen: {filteredTry ? filteredTry : 0 }/{maxTriesOne}</Text>
                <Text style = {[styles.tries, {marginTop: 5}]}>Aantal goed: {numberAnsweredCorrectSigns}/{8}</Text>
            </View>
            
            <View style = {[styles.border, {marginHorizontal: 15}]}/>

            <View style={styles.descriptionContainer}>
                <Text style = {styles.question}>
                    {questions[1]}
                </Text>
            </View>

            <View style = {[styles.border, {marginHorizontal: 15}]}/>

            <View style = {{marginHorizontal: 10, marginVertical: 20}}>
                <Signs 
                    number = {1}
                    left 
                    right 
                    unit = "m/s²"
                    quantity = "a const"
                    onPress = {toggleModalHandler}
                    indexEquality = {indexEquality.filter(row => row.questionNumber === 1)}  
                    customAnswer = {(parseFloat(answersStudent[1]))}
                />

                <Signs 
                    number = {2}
                    right 
                    unit = "m/s"
                    quantity = "vgem"
                    onPress = {toggleModalHandler}
                    indexEquality = {indexEquality.filter(row => row.questionNumber === 2)} 
                    customAnswer = {(parseFloat(answersStudent[0]))}
                />

                <Signs 
                    number = {3}
                    double 
                    unit = "m voor "
                    quantity = "s"
                    unitDouble={"s"}
                    quantityDouble={"t"}
                    valueDouble = {15}
                    onPress = {toggleModalHandler}
                    indexEquality = {indexEquality.filter(row => row.questionNumber === 3)}  
                    customAnswer = {15.0 * parseFloat(answersStudent[0])}
                />

                <Signs 
                    number = {4}
                    right
                    unit = "m/s"
                    quantity = "vmax"
                    customAnswer = {0.30}
                    onPress = {toggleModalHandler}
                    indexEquality = {indexEquality.filter(row => row.questionNumber === 4)} 
                />


                <Signs 
                    number = {5}
                    double 
                    unit = "m/s voor "
                    quantity = "v"
                    unitDouble={"t"}
                    quantityDouble={"s"}
                    valueDouble = {2}
                    onPress = {toggleModalHandler}
                    indexEquality = {indexEquality.filter(row => row.questionNumber === 5)} 
                    customAnswer = {0}
                />
            </View>
            
            <TouchableOpacity onPress={() => checkAnswerHandler()} style = {styles.createButton}>
                <Text style={styles.buttonText}>{'Check Antwoord'}</Text>
            </TouchableOpacity>

            <View style = {{marginHorizontal: 12}}>
                <View style = {styles.border}/>
            </View>

            <Text style = {[styles.tries, {marginTop: 5}]}>Pogingen: {filteredTryOpenQuestions ? filteredTryOpenQuestions : 0 }/{maxTriesTwo}</Text>
            <View style={styles.descriptionContainer}>
                <Text style = {styles.question}>
                    {questions[1]}
                </Text>
            </View>

            <View style = {[styles.border, {marginHorizontal: 12}]}/>

            <QuestionB 
                numberAnsweredCorrectMotors = {numberAnsweredCorrectMotors}
                filteredTryOpenQuestions = {filteredTryOpenQuestions}
                getBackgroundColor = {getBackgroundColor}
                maxTriesTwo = {maxTriesTwo}
            />


            <ModalOptions 
                toggleModal={toggleModal}
                setToggleModal={setToggleModal}
                chooseEqualityHandler={chooseEqualityHandler}
                currentIndex = {currentIndex}
            />
        </View>
    )
}

export default React.memo(ProjectOneCustomContainer);


const styles= StyleSheet.create({
    descriptionContainer: {
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
        marginVertical: 4,
    },
    question: {
        fontSize: 16,
        color: ColorsGray.gray400,
        lineHeight: 26
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
    createButton: {
        backgroundColor: '#4a90e2',
        borderRadius: 5,
        padding: 10,
        width: 180,
        alignSelf: 'center',
        marginBottom: 20
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    border: {
        borderWidth: 0.6,
        borderColor: `rgba(33, 33, 55, 0.7)`,
        marginVertical: 10,
    },

})