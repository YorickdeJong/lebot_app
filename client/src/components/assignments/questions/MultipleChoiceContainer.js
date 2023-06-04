import { TouchableOpacity } from "react-native-gesture-handler";
import {Alert, View, FlatList, StyleSheet, Text, SectionList, Platform} from 'react-native';
import { BlurView } from "expo-blur";
import { ColorsBlue, ColorsDarkerRed, ColorsGray, ColorsGreen, ColorsLighterGold, ColorsRed } from "../../../constants/palet";
import React, { useContext, useEffect, useState } from "react";
import { UserProfileContext } from "../../../store/userProfile-context";
import { AssignmentDetailsContext } from "../../../store/assignment-Details-context";
import { createAssignmentsDetail, getSpecificAssignmentsDetail } from "../../../hooks/assignmentDetails";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "../../Icon";


function MultipleChoiceContainer({multipleChoiceOptions, checkTimerActive, multipleChoiceAnswers, subject, assignment_number, assignment_id, title, sendData, currency}) {
    const boolArray = Array.from({length: multipleChoiceOptions.length }, () => false);
    const [tileColor,  setTileColor] = useState(boolArray);
    const userprofileCtx = useContext(UserProfileContext);
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    const maxTries = multipleChoiceAnswers.filter(multiple => multiple === 'true').length; //calculate amount of maxTries a student has
    const [filteredTry, setFilteredTry] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);


    useEffect(() => {
        async function fetchData() {

            const data = await getSpecificAssignmentsDetail(school_id, class_id, group_id, assignment_id, subject);

            console.log('data', data)
            if (data && data.answers_multiple_choice.length > 0) {
                const tileColorsFromData = Array.from({ length: multipleChoiceOptions.length }, () => false);
                const filteredData =  data.answers_multiple_choice.filter(answer => answer !== null)
                console.log('filteredData', filteredData)

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
        }
      
        fetchData();
    }, []);



    const setTileColorTrue = (index) => {
        const updatedTileColor = [...tileColor];
        updatedTileColor[index] = true;
        setTileColor(updatedTileColor);
    };

    function MultipleChoiceTileHandler({item, index}) {
        async function checkAnswerHandler() {
            if (!school_id || !class_id || !group_id) {
                Alert.alert('Voeg eerst een klas en group toe om vragen te kunnen beantwoorden')
            }
            if (!checkTimerActive()) {
                return 
            }
            if (tileColor[index]) {
                Alert.alert('Deze vraag is al beantwoord')
                return
            }
            if (filteredTry >= maxTries) {
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
                                if (filteredTry < maxTries) {
                                    assignmentDetailsCtx.incrementTriesMultipleChoice(subject, assignment_number, title);
                                }
                                // if multiple choice is true increment correct answers 
                                if (multipleChoiceAnswers[index] === 'true') {           
                                    Alert.alert('Antwoord is goed!')
                                    setCorrectAnswers(correctAnswers + 1);
                                }
                                else {
                                    // haal te verdienen muntjes van vraag af
                                    Alert.alert('Antwoord is fout!')
                                }

                                // verander kleur van tile 
                                setTileColorTrue(index)
                                setFilteredTry(filteredTry + 1);
                                const correctness = multipleChoiceAnswers[index] === 'true' 
                                // Send the data after the tile color has been updated
                                await sendData(index, correctness, true);
                            }   
                            catch(error) {
                                console.log('error', error);
                                Alert.alert('Er is iets mis gegaan bij het beantwoorden van de vraag!')
                            }
                        }
                    }
                ]
            )
        }


        return (
            <View style = {[styles.shadow2, { backgroundColor: (Platform.OS === 'android' && tileColor[index]) ? 'rgba(0, 0, 0, 1)' : 'transparent',}]}>
                <View style = {[styles.shadow, {backgroundColor: tileColor[index] ? ColorsBlue.blue1200 : null, borderWidth: tileColor[index] ? 1 : 0,
                        borderColor: Platform.OS === 'android' ? 'rgba(77, 77, 77, 0.35)' : 'rgba(77, 77, 77, 0.2)',}]}>
                        <TouchableOpacity 
                        onPress = {() => !tileColor[index] ? checkAnswerHandler() : Alert.alert('Deze vraag is al beantwoord')}
                        
                        >
                                <View style = {styles.textContainer}>
                                    <View style = {styles.icon}>
                                        <Icon 
                                            icon = {tileColor[index] ? (multipleChoiceAnswers[index] === 'true' ? "md-checkmark-circle-outline" : "md-close-circle-outline") : "md-add-circle-outline"}
                                            size = {30}
                                            color = {tileColor[index] ? (multipleChoiceAnswers[index] === 'true' ? ColorsGreen.green400 : ColorsRed.red500) : ColorsBlue.blue200}
                                        />
                                    </View>
                                    <View style = {styles.innerTextContainer}>
                                        <Text style = {styles.text}>{item}</Text>
                                    </View>
                                </View>
                        </TouchableOpacity>
                </View>
            </View>
        )
    }
    
    return (
        <View style = {{marginTop: 5}}>
            <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20}}>
                <Text style = {[styles.tries, {marginTop: 5}]}>Credits: €{currency}</Text>
                <Text style = {[styles.tries, {marginTop: 5}]}>Pogingen: {filteredTry ? filteredTry : 0 }/{maxTries}</Text>
            </View>
            <View style = {styles.list}>
                <FlatList
                    data={multipleChoiceOptions}
                    renderItem={({ item, index }) => MultipleChoiceTileHandler({ item, index })}
                    keyExtractor={(item, index) => index.toString()}
                    showVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
}


export default React.memo(MultipleChoiceContainer);


const styles = StyleSheet.create({ 
    shadow2: {
        shadowColor: `rgba(1, 1, 1, 1)`,
        shadowOffset: {height: 2, width: 1},
        shadowOpacity: 1,
        shadowRadius: 3,
        marginVertical: 3,
        borderRadius: 20,
        marginHorizontal: 5
    },
    list:  {
        marginTop: 10
    },
    shadow: {
        paddingVertical: 5,
        borderRadius: 20,

        marginRight: 2,
        marginBottom: 3
    },
    tile: {
        marginHorizontal: 10,
        marginVertical: 5,
        paddingVertical: 5,
        minHeight: 55,
        borderWidth: 0.8,
        borderColor: `rgba(77, 77, 77, 0.5)`,
        justifyContent: 'center',
        borderRadius: 20,
    },
    blurView: {
        flex: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center', 
        paddingHorizontal: 5
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center', 
    },
    text: {
        color: ColorsGray.gray300,
        fontSize: 16,
        fontWeight: '300',
        textAlign: 'center',
        lineHeight: 23,
    },
    tries: {
        fontSize: 20,
        fontWeight: '300',
        textAlign: 'center',
        marginBottom: 10,
        color: ColorsGray.gray300,
    },
    icon: {
        width: 50
    },
    innerTextContainer: {
        width: 260
    }
})