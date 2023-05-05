
import {View, StyleSheet, Text, Alert} from 'react-native';
import AnswerContainer from '../../../UI/AnswerContainer';
import { useContext, useEffect, useState } from 'react';
import { ColorsBlue, ColorsGray, ColorsGreen, ColorsRed } from '../../../../constants/palet';
import { UserProfileContext } from '../../../../store/userProfile-context';
import { generateAnswerCarQ4 } from '../generateAnswers';
import { ChartContext } from '../../../../store/chart-context';
import { getSpecificAssignmentsDetail } from '../../../../hooks/assignmentDetails';


function MultipleAnswersContainer({questions, title, subject, setFilteredTry, filteredTry, assignmentNumber, assignment_id, performedMeasurement, sendData}){
    const userprofileCtx = useContext(UserProfileContext);
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    const [correctAnswers, setCorrectAnswers] = useState({
        q1: false,
        q2: false,
        q3: false,
        q4: false,
    }); 
    const [input, setInput] = useState({
        power1: '',
        power2: '',
        power3: '',
        power4: '',
    });
    const [chartNumber, setChartNumber] = useState({
        chart1: null,
        chart2: null,
        chart3: null,
        chart4: null,
    });
    const maxTries = 5;
    

    useEffect(() => {
        async function fetchData() {
            const data = await getSpecificAssignmentsDetail(school_id, class_id, group_id, assignment_id, subject);
            const newData = {
                ...data,
                answers_open_questions: data.answers_open_questions.filter(answer => answer !== null)
            };
            if (newData && newData.answers_open_questions.length > 0) {
                // Create an empty array for each answerNumber
                const answersByNumber = { 1: [], 2: [], 3: [], 4: [] };
    
                // Group the answers by answerNumber
                data.answers_open_questions.forEach(answer => {
                    if (answer.answerNumber in answersByNumber) {
                        answersByNumber[answer.answerNumber].push(answer);
                    }
                });
    
                // Process each group of answers
                Object.keys(answersByNumber).forEach(answerNumber => {
                    const answers = answersByNumber[answerNumber];
    
                    // If the answers array is empty, skip to the next iteration
                    if (answers.length === 0) {
                        return;
                    }

                    // Determine if there are any correct answers in this group
                    const correctAnswersFromData = answers.filter(answer => answer.correct);
    
                    if (correctAnswersFromData.length > 0) {
                        // If there are correct answers, set the correctAnswers, input, and chartNumber accordingly
                        correctAnswersFromData.forEach(answer => {
                            setCorrectAnswers(prevState => ({ ...prevState, ['q' + answerNumber]: true }));
                            setInput(prevState => ({ ...prevState, ['power' + answerNumber]: answer.answer }));
                            setChartNumber(prevState => ({ ...prevState, ['chart' + answerNumber]: answer.chartNumber }));
                        });
                    } else {
                        // If there are no correct answers for the question, take the last index of the answers array
                        const lastAnswer = answers[answers.length - 1];
                        setCorrectAnswers(prevState => ({ ...prevState, ['q' + answerNumber]: false }));
                        setInput(prevState => ({ ...prevState, ['power' + answerNumber]: lastAnswer.answer }));
                        setChartNumber(prevState => ({ ...prevState, ['chart' + answerNumber]: lastAnswer.chartNumber }));
                    }
                });
    
                setFilteredTry(data.answers_open_questions.length);
            }
        }
        fetchData();
    }, []);

    const setInputDetails = (text, power) => {
        setInput(prevState => ({
            ...prevState,
            [power]: text
        }));
    };

    const setChartNumberDetails = (chartNumber, chartName) => {
        setChartNumber(prevState => ({
            ...prevState,
            [chartName]: chartNumber
        }));
    };

    async function validateInput(answerNumber, answersStudent, chartNumber){
        if (!school_id || !class_id || !group_id) {
            Alert.alert('Voeg eerst een klas en group toe om vragen te kunnen beantwoorden')
            return 
        }

        if (correctAnswers[answerNumber - 1] === true || filteredTry === maxTries) {
            Alert.alert('Je hebt deze vraag al beantwoord')
            return
        }

        if (answersStudent === '' || chartNumber === null) {
            Alert.alert('Vul alle velden in')
            return
        }

        //check correct answer
        const correctAnswer = await generateAnswerCarQ4(answersStudent, chartNumber, school_id, class_id, group_id, title, assignmentNumber, subject)
        
        //if correct answer is -1, measurement doesn't exist
        if (correctAnswer === -1){
            return
        }
        
        setFilteredTry(filteredTry + 1)
        if (correctAnswer){
            Alert.alert('Antwoord is goed')
        }
        else {
            Alert.alert('Antwoord is fout')
        }
        await sendData(input, isCorrect, false, answerNumber)
    }

    function getBackgroundColor(correctAnswers, tries, maxTries) {
        if (correctAnswers=== true) {
            return ColorsGreen.green300;
        }
    
        if (tries === maxTries) {
            return correctAnswers === true ? ColorsGreen.green300 : ColorsRed.red700;
        }
    
        return ColorsBlue.blue200;
    }

    const backgroundColor = Object.keys(correctAnswers).map(key => getBackgroundColor(correctAnswers[key], filteredTry, maxTries));
    const inputContainer = backgroundColor.map(color => [styles.inputContainer, { backgroundColor: color }]);

    return (
        <View>
            <View style = {styles.border}/>
            <Text style = {[styles.tries, {marginTop: 5}]}>Pogingen: {filteredTry ? filteredTry : 0 }/{maxTries}</Text>
            <View style={styles.descriptionContainer}>
                <Text style = {styles.question}>
                    {questions[0]}
                </Text>            
            </View>
                
            
            <AnswerContainer 
                input = {input.power1}
                inputContainer={inputContainer[0]}
                setInputDetails = {(text) => setInputDetails(text, 'power1')}
                validateInput = {validateInput.bind(this, 1, input.power1, chartNumber.chart1)}
                performedMeasurement = {performedMeasurement}
                maxTries = {maxTries}
                filteredTry = {filteredTry}
                correctAnswers = {correctAnswers}
                chartNumber = {chartNumber.chart1}
                setChartNumber = {(text) => setChartNumberDetails(text, 'chart1')}
                placeholder = {"Vermogen Motorstand 1"}
            />
            <AnswerContainer 
                input = {input.power2}
                inputContainer={inputContainer[1]}
                setInputDetails = {(text) => setInputDetails(text, 'power2')}
                validateInput = {validateInput.bind(this, 2, input.power2, chartNumber.chart2)}
                performedMeasurement = {performedMeasurement}
                maxTries = {maxTries}
                filteredTry = {filteredTry}
                correctAnswers = {correctAnswers}
                chartNumber = {chartNumber.chart2}
                setChartNumber = {(text) => setChartNumberDetails(text, 'chart2')}
                placeholder = {"Vermogen Motorstand 2"}
            />
            <AnswerContainer 
                input = {input.power3}
                inputContainer={inputContainer[2]}
                setInputDetails = {(text) => setInputDetails(text, 'power3')}
                validateInput = {validateInput.bind(this, 3, input.power3, chartNumber.chart3)}
                performedMeasurement = {performedMeasurement}
                maxTries = {maxTries}
                filteredTry = {filteredTry}
                correctAnswers = {correctAnswers}
                chartNumber = {chartNumber.chart3}
                setChartNumber = {(text) => setChartNumberDetails(text, 'chart3')}
                placeholder = {"Vermogen Motorstand 3"}
            />
            <AnswerContainer 
                input = {input.power4}
                inputContainer={inputContainer[3]}
                setInputDetails = {(text) => setInputDetails(text, 'power4')}
                validateInput = {validateInput.bind(this, 4, input.power4, chartNumber.chart4)}
                performedMeasurement = {performedMeasurement}
                maxTries = {maxTries}
                filteredTry = {filteredTry}
                correctAnswers = {correctAnswers}
                chartNumber = {chartNumber.chart4}
                setChartNumber = {(text) => setChartNumberDetails(text, 'chart4')}
                placeholder = {"Vermogen Motorstand 4"}
            />
        </View>
    )
}

export default MultipleAnswersContainer;


const styles= StyleSheet.create({
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
    border: {
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.5)`,
        marginTop: 12,
        marginHorizontal: 12,
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
})