
import {  ImageBackground, ScrollView, StyleSheet,  View, Text, TextInput, Dimensions, Keyboard, TouchableWithoutFeedback, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import { ColorsBlue, ColorsGray,} from '../../../constants/palet';
import ChatBoxGPT from '../../chatgpt/ChatBoxGPT';
import { LinearGradient } from 'expo-linear-gradient';
import VideoDisplay from '../BuildComponent.js/VideoDisplay';
import SwitchScreens from '../BuildComponent.js/SwitchScreens';
import SwitchScreensQuestions from '../questions/SwitchScreensQuestions';
import Icon from '../../Icon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TextInputThinkScreen from '../../UI/TextInputThinkScreen';
import { useLiveChat } from '../../../hooks/liveChat.hooks';
import CustomFieldContainer from '../../CustomDocs/CustomField';
import AssignmentOptionsBar from './assignmentOptionsBar';
import { useIsFocused } from '../../../hooks/isFocused.hooks';
import { createBrainstormText, getBrainstormText, updateBrainstormText } from '../../../hooks/thinkScreen.hooks';
import { UserProfileContext } from '../../../store/userProfile-context';
import MultipleChoiceOptions from '../../UI/MultipleChoiceOptions';
import { getSpecificAssignmentsDetail } from '../../../hooks/assignmentDetails';
import { AssignmentDetailsContext } from '../../../store/assignment-Details-context';

const {height, width} = Dimensions.get('window');

function ThinkScreen({
    nextSlideHandler, 
    assignmentNumber, 
    subject,
    currentSlidePosition, 
    prevSlideHandler, 
    slideTotal, 
    slideCount, 
    questions, 
    index, 
    slideCountEnd, 
    setSlideCount}) {
    const isScreenFocused = slideCount - 2 <= index && slideCount >= index
    const userprofileCtx = useContext(UserProfileContext);
    const user_id = userprofileCtx.userprofile.id;
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    
    const [isCloseIcon, setIsCloseIcon] = useState(false);
    const [inputTextOne, setInputTextOne] = useState('');
    const [inputTextTwo, setInputTextTwo] = useState('');
    const [inputTextThree, setInputTextThree] = useState('');
    const [inputTextFour, setInputTextFour] = useState('');
    const inputTextOneRef = useRef('');
    const inputTextTwoRef = useRef('');
    const inputTextThreeRef = useRef('');
    const inputTextFourRef = useRef('');
    const [yesButton, setYesButton] = useState(false);
    const [noButton, setNoButton] = useState(false);

    // multiple choice
    const multipleChoiceOptions = ['y = ax + b', 'ρ = m / V', 'a = dv / dt', 'F = m • a', 'P = U • I', 'Fv = C • u', 'v = ds / dt',  'I = G • U', ] 
    const multipleChoiceAnswers = ['true', 'false', 'true', 'true', 'false', 'false', 'true', 'false']
    const lenghtMultipleChoice = multipleChoiceOptions.length;
    const boolArray = Array.from({length: lenghtMultipleChoice }, () => false);
    const [tileColor,  setTileColor] = useState(boolArray);
    const maxTries = multipleChoiceAnswers.filter(multiple => multiple === 'true').length; //calculate amount of maxTries a student has
    const [filteredTry, setFilteredTry] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);
    const addAssignmentDetails = assignmentDetailsCtx.addAssignmentDetails;

    const fetchText = useCallback(async () => {

        // fetches multipleChoice data 
        const assignment_id = 1;
        const data = await getSpecificAssignmentsDetail(school_id, class_id, group_id, assignment_id, subject);

        if (data && data.answers_multiple_choice.length > 0) {
            const tileColorsFromData = Array.from({ length: multipleChoiceOptions.length }, () => false);
            const filteredData =  data.answers_multiple_choice.filter(answer => answer !== null)

            filteredData.forEach((answer) => {
                try {
                    tileColorsFromData[answer.answer] = true;
                }
                catch(error) {
                    console.log(error);
                    console.log('index likely out of bounds')
                }
            });


            setFilteredTry(filteredData.length)
            setTileColor(tileColorsFromData);
    
            const correctAnswersFromData = data.answers_multiple_choice.filter(answer => answer.correct).length;
            setCorrectAnswers(correctAnswersFromData);
        }

        // fetches brainstorm data
        const response = await getBrainstormText(user_id, assignmentNumber, subject);
        if (response){
            const {text_one, text_two, text_three, text_four} = response
            setInputTextOne(text_one);
            setInputTextTwo(text_two);
            setInputTextThree(text_three);
            setInputTextFour(text_four);

        }
    }, [ user_id, assignmentNumber, subject, school_id, class_id, group_id, multipleChoiceOptions.length]);

    useEffect(() => {
        if (index !== slideCount - 1) {
            return 
        }


        fetchText();
    }, [index, slideCount]);


    
    // Update refs when state changes
    useEffect(() => {
      inputTextOneRef.current = inputTextOne;
      inputTextTwoRef.current = inputTextTwo;
      inputTextThreeRef.current = inputTextThree;
      inputTextFourRef.current = inputTextFour;
    }, [inputTextOne, inputTextTwo, inputTextThree, inputTextFour]);
    
    useEffect(() => {
        return async () => {
            console.log('input text', inputTextOneRef.current, inputTextTwoRef.current, inputTextThreeRef.current, inputTextFourRef.current)
            await createBrainstormText(user_id, assignmentNumber, subject, inputTextOneRef.current, inputTextTwoRef.current, inputTextThreeRef.current, inputTextFourRef.current);
        }
    }, []); 


    const handleAgreementChoice = useCallback((type) => {
        switch(type) {
            case 'yes':
                setYesButton(!yesButton);
                setNoButton(false);
                break;
            case 'no':
                setNoButton(!noButton);
                setYesButton(false);
            break;
        }
    }, [yesButton, noButton]);

   //define useEffect to getspefic assignment details
   const sendData = useCallback(async (data, correctness) => {
        console.log('data', data)
        console.log('correctness', correctness)


        let answers_open_questions = null
        const answers_multiple_choice =  { answer: data, correct: correctness }
        const assignment_id = 1;

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
    }, [addAssignmentDetails, school_id, class_id, group_id, subject]);


    return (
            <View style = {styles.container}>

                    <AssignmentOptionsBar 
                        slideCount = {slideCount}
                        nextSlideHandler = {nextSlideHandler}
                        prevSlideHandler = {prevSlideHandler}
                        slideCountEnd = {slideCountEnd}
                        setSlideCount = {setSlideCount}
                        text = {{text: 'Brainstorm', left: '38%'}}
                        slideTotal = {slideTotal}
                        currentSlidePosition = {currentSlidePosition}
                    />
                    {isScreenFocused && 
                    <ScrollView style = {{flex: 1}}>
                        <View style = {{flex: 1}}>
                            
                            {isCloseIcon && 
                                <View style = {{position: 'absolute', top: "3%", right: '5%', zIndex: 10}}>
                                    <Icon
                                        icon = {"lock-open"}
                                        size = {30}
                                        color = {ColorsGray.gray400}
                                        onPress={() => setIsCloseIcon(!isCloseIcon)}
                                    />
                                </View>
                            }

                                <KeyboardAwareScrollView>
                                {!isCloseIcon && 
                                    <LinearGradient
                                        colors = {[ColorsBlue.blue1390, ColorsBlue.blue1390]} 
                                        style = {styles.textContainer}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        > 
                                            <Text style = {[styles.text,  {fontSize: 17,  marginHorizontal: 20, marginVertical: 10}]}>{questions[0]}</Text>
                                
                                        </LinearGradient>
                                }

                                {questions[1] && 
                                        <TextInputThinkScreen 
                                            questions = {questions[1]}
                                            inputText = {inputTextOne}
                                            setInputText = {setInputTextOne}
                                            height = {height}
                                        />
                                }
                                
                                { questions[2] &&
                                <View style={[styles.textInput, {flex: 1, minHeight: height / 2.5, paddingBottom: 10 }]}>
                                    <Text style = {[styles.text, {color: ColorsGray.gray300, paddingBottom: 10}]}>{questions[2]}</Text>
                                    <View style = {{borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 10}}/>
                                    <MultipleChoiceOptions 
                                        timer = {false}
                                        tileColor = {tileColor}
                                        setTileColor = {setTileColor}
                                        correctAnswers = {correctAnswers} 
                                        setCorrectAnswers = {setCorrectAnswers}
                                        filteredTry = {filteredTry} 
                                        setFilteredTry = {setFilteredTry}
                                        maxTries = {lenghtMultipleChoice} 
                                        checkTimerActive = {false} 
                                        sendData = {sendData} 
                                        title = {'ThinkScreen'}
                                        assignment_number = {assignmentNumber}
                                        subject = {subject}
                                        multipleChoiceOptions = {multipleChoiceOptions}
                                        multipleChoiceAnswers = {multipleChoiceAnswers}
                                    />
                                </View>
                                }

                                {/* Add multiple choice container here */}
                                {questions[3] && 
                                    <TextInputThinkScreen 
                                        questions = {questions[3]}
                                        inputText = {inputTextThree}
                                        setInputText = {setInputTextTwo}
                                        height = {height}
                                    />
                                }

                                {questions[4] && 
                                    <View style={[styles.textInput, {flex: 1, minHeight: height / 2.5 }]}>
                                    <Text style = {[styles.text, {color: ColorsGray.gray300, paddingBottom: 10}]}>{questions[4]}</Text>
                                    <View style = {{borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 10}}/>
                                    <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
                                        <View style = {{flexDirection: 'row', marginHorizontal: 20, marginBottom: 7}}>
                                            <Text style = {[styles.text, {color: ColorsGray.gray400}]}>Ja: </Text>
                                            <Icon 
                                                icon = {yesButton ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                                                size = {30}
                                                color = {ColorsGray.gray500}
                                                onPress={handleAgreementChoice.bind(this, 'yes')}
                                                differentDir={true}
                                            />
                                        </View>
                                        <View style = {{flexDirection: 'row', marginHorizontal: 20, marginBottom: 7}}>
                                            <Text style = {[styles.text, {color: ColorsGray.gray400}]}>Nee: </Text>
                                            <Icon 
                                                icon = {noButton ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                                                size = {30}
                                                color = {ColorsGray.gray500}
                                                onPress={handleAgreementChoice.bind(this, 'no')}
                                                differentDir={true}
                                            />
                                        </View>
                                    </View>
                                    <View style = {{borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 10}}/>
                                            <TextInput
                                                style={{flex: 1, color: ColorsGray.gray400, fontSize: 14, lineHeight: 26}}
                                                value={inputTextFour}
                                                onChangeText={text => setInputTextFour(text)}
                                                placeholder="Type hier jouw antwoord..."
                                                placeholderTextColor = {ColorsGray.gray400}
                                                multiline={true}   // Enable multiline input
                                                textAlignVertical="top" // Align text to the top of the TextInput
                                            /> 
                                    </View>
                                }                
                                </KeyboardAwareScrollView>
                            </View>
                    </ScrollView>
                    }
            </View>
    )
}

export default React.memo(ThinkScreen)

const styles = StyleSheet.create({
    questionsText: {
        fontSize: 15,
        color: ColorsGray.gray300,
        textAlign: 'center',
        marginVertical: 5,
        marginHorizontal: 20
    },
    textInput: {
        margin: 10, 
        backgroundColor: ColorsBlue.blue1390, 
        paddingHorizontal: 20, 
        borderRadius: 15, 
        paddingTop: 10, 
        marginBottom: 10, 
        fontSize: 20,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: {height: 2, width: 1},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,     
        borderWidth: 0.8,
        borderColor: `rgba(77, 77, 77, 0.2)`,  
    },
    customTextEditContainer: {
        height: 50,
        backgroundColor: ColorsGray.gray300,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: ColorsGray.gray500,
        borderTopWidth: 1,

    },
    container: {
        flex: 1, 
        width: width,
    },
    imageBackground: { 
        flex: 1, 
        resizeMode: 'contain',
    },
    textContainer: {
        backgroundColor: 'rgba(0, 0, 20, 0.75)',
        elevation: 2,
        marginHorizontal: 8,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.18)`,
        marginVertical: 5,
    },
    leftSlider: {
        position: 'absolute',
        top: 8,
        left: 8
    },
    rightSlider: {
        position: 'absolute',
        top: 8,
        right: 8
    },
    containerQuestions: {
        maxHeight: 221,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 23,
        fontWeight: '300',
        color: ColorsGray.gray300,
        textAlign: 'center',

    },
})