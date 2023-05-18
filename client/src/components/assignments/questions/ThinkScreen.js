
import {  ImageBackground, ScrollView, StyleSheet,  View, Text, TextInput, Dimensions, Keyboard, TouchableWithoutFeedback, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import {useRef, useState} from 'react';
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


const {height, width} = Dimensions.get('window');

function ThinkScreen({nextSlideHandler, prevSlideHandler, slideCount, questions, topic, slideCountEnd, setSlideCount}) {
    const [isCloseIcon, setIsCloseIcon] = useState(false);
    // const [inputTextOne, setInputTextOne] = useState('');
    const [inputTextTwo, setInputTextTwo] = useState('');
    const [inputTextThree, setInputTextThree] = useState('');
    const [yesButton, setYesButton] = useState(false);
    const [noButton, setNoButton] = useState(false);

    const [inputTextOne, setInputTextOne] = useLiveChat();

    console.log(inputTextOne, 'inputTextOne')
    console.log(inputTextTwo, 'inputTextTwo')

    function handleAgreementChoice(type) {
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
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LinearGradient 
            colors={['rgba(2,2,13,1)', 'rgba(2,2,8,1)']}  
            style = {styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            >
            <ImageBackground
            source={require('./../../../../assets/chatbackground.png')} 
            style={
            {flex: 1}
            }
            imageStyle={{opacity: 0.07}}
            >
                    <ScrollView>
                            <AssignmentOptionsBar 
                                slideCount = {slideCount}
                                nextSlideHandler = {nextSlideHandler}
                                prevSlideHandler = {prevSlideHandler}
                                slideCountEnd = {slideCountEnd}
                                setSlideCount = {setSlideCount}
                                text = {{text: 'Brainstorm', left: '38%'}}
                            />
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

                        {!isCloseIcon && 
                            <LinearGradient
                                colors = {[ColorsBlue.blue1400, ColorsBlue.blue1300, ColorsBlue.blue1400,]} 
                                style = {styles.textContainer}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                > 
                                    <Text style = {[styles.text,  {fontSize: 17,  marginHorizontal: 30, marginVertical: 10}]}>{questions[0]}</Text>
                        
                                </LinearGradient>
                        }
                      
                            <KeyboardAwareScrollView>

                            {/* <CustomFieldContainer 
                                questions = {questions[1]}
                            /> */}


                            {questions[1] && 
                                <View style = {{marginTop: 5}}>
                                    <TextInputThinkScreen 
                                        questions = {questions[1]}
                                        inputText = {inputTextOne}
                                        setInputText = {setInputTextOne}
                                        height = {height}
                                    />
                                </View>
                            }

                            {questions[2] && 
                                <TextInputThinkScreen 
                                    questions = {questions[2]}
                                    inputText = {inputTextTwo}
                                    setInputText = {setInputTextTwo}
                                    height = {height}
                                />
                            }

                            {questions[3] && 
                                <TextInputThinkScreen 
                                    questions = {questions[3]}
                                    inputText = {inputTextThree}
                                    setInputText = {setInputTextThree}
                                    height = {height}
                                />
                            }

                            {questions[4] && 
                                <View style={[styles.textInput, {flex: 1, minHeight: height / 3 }]}>
                                <Text style = {[styles.text, {color: 'black', paddingBottom: 3}]}>{questions[4]}</Text>
                                <View style = {{borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 10}}/>
                                <View style = {{flexDirection: 'row', justifyContent: 'center'}}>
                                    <View style = {{flexDirection: 'row', marginHorizontal: 20, marginBottom: 7}}>
                                        <Text style = {[styles.text, {color: ColorsGray.gray900}]}>Ja: </Text>
                                        <Icon 
                                            icon = {yesButton ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                                            size = {30}
                                            color = {ColorsGray.gray700}
                                            onPress={handleAgreementChoice.bind(this, 'yes')}
                                            differentDir={true}
                                        />
                                    </View>
                                    <View style = {{flexDirection: 'row', marginHorizontal: 20, marginBottom: 7}}>
                                        <Text style = {[styles.text, {color: ColorsGray.gray900}]}>Nee: </Text>
                                        <Icon 
                                            icon = {noButton ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                                            size = {30}
                                            color = {ColorsGray.gray700}
                                            onPress={handleAgreementChoice.bind(this, 'no')}
                                            differentDir={true}
                                        />
                                    </View>
                                </View>
                                <View style = {{borderBottomColor: 'gray', borderBottomWidth: 1, marginBottom: 10}}/>
                                        <TextInput
                                            style={{flex: 1}}
                                            value={inputTextThree}
                                            onChangeText={text => setInputTextThree(text)}
                                            placeholder="Type hier jouw antwoord..."
                                            multiline={true}   // Enable multiline input
                                            textAlignVertical="top" // Align text to the top of the TextInput
                                        /> 
                                </View>
                            }                




                            </KeyboardAwareScrollView>
                    </ScrollView>
                    </ImageBackground>
                </LinearGradient>
            </TouchableWithoutFeedback>
    )
}

export default ThinkScreen

const styles = StyleSheet.create({
    questionsText: {
        fontSize: 15,
        color: ColorsGray.gray400,
        textAlign: 'center',
        marginVertical: 5,
        marginHorizontal: 20
    },
    textInput: {
        borderColor: 'gray', 
        borderWidth: 1.2, 
        margin: 10, 
        backgroundColor: 'rgba(175, 175, 155, 0.9)', 
        paddingHorizontal: 20, 
        borderRadius: 15, 
        paddingTop: 10, 
        marginBottom: 10, 
        fontSize: 20,
        lineHeight: 27,
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
        backgroundColor: ColorsBlue.blue1400,
    },
    imageBackground: { 
        flex: 1, 
        resizeMode: 'contain',
    },
    textContainer: {
        backgroundColor: 'rgba(0, 0, 20, 0.75)',
        marginVertical: 8,
        elevation: 2,
        marginHorizontal: 8,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.18)`,
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
        color: ColorsBlue.blue50,
        textAlign: 'center',

    },
})