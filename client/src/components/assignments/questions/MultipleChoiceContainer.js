import { TouchableOpacity } from "react-native-gesture-handler";
import {Alert, View, FlatList, StyleSheet, Text, SectionList} from 'react-native';
import { BlurView } from "expo-blur";
import { ColorsBlue, ColorsDarkerRed, ColorsGreen, ColorsLighterGold } from "../../../constants/palet";
import { useContext, useEffect, useState } from "react";
import { UserProfileContext } from "../../../store/userProfile-context";
import { AssignmentDetailsContext } from "../../../store/assignment-Details-context";
import { createAssignmentsDetail, getSpecificAssignmentsDetail } from "../../../hooks/assignmentDetails";
import { LinearGradient } from "expo-linear-gradient";


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
        
            console.log('multiple choice data', data)
            if (data && data.answers_multiple_choice.length > 0) {
                const tileColorsFromData = Array.from({ length: multipleChoiceOptions.length }, () => false);
                
                data.answers_multiple_choice.forEach((answer) => {
                    // Check if answer.answer is not an integer, skip
                    if (!Number.isInteger(answer.answer) || answer.answer === null) {
                        return;
                    }
                    try {
                        tileColorsFromData[answer.answer] = true;
                    }
                    catch(error) {
                        console.log(error);
                        console.log('index likely out of bounds')
                    }
                });


                setFilteredTry(data.answers_multiple_choice.filter(answer => answer !== null).length)
                setTileColor(tileColorsFromData);
        
                const correctAnswersFromData = data.answers_multiple_choice.filter(answer => answer.correct).length;
                console.log('correctAnswered', correctAnswersFromData)
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
                                console.log(error);
                                Alert.alert('Er is iets mis gegaan bij het beantwoorden van de vraag!')
                            }
                        }
                    }
                ]
            )
        }


        return (
            <View style = {styles.shadow}>
                <LinearGradient 
                    colors = {[tileColor[index] ? (multipleChoiceAnswers[index] === 'true' ? 'rgba(8, 30, 8, 1)' : ColorsDarkerRed.red1000) : ColorsBlue.blue1400, 
                    tileColor[index] ? (multipleChoiceAnswers[index] === 'true' ? 'rgba(25, 130, 25, 1)' : 'rgba(150, 70, 51, 1)') : ColorsBlue.blue1200, 
                    tileColor[index] ? (multipleChoiceAnswers[index] === 'true' ? 'rgba(8, 30, 8, 1)' : ColorsDarkerRed.red1000) : ColorsBlue.blue1400]} 
                    style = {styles.tile}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <TouchableOpacity onPress = {() => !tileColor[index] ? checkAnswerHandler() : Alert.alert('Deze vraag is al beantwoord')} 
                    >
                            <View style = {styles.textContainer}>
                                <Text style = {styles.text}>{item}</Text>
                            </View>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        )
    }
    
    return (
        <View style = {{marginTop: 12}}>
            <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 40}}>
                <Text style = {[styles.tries, {marginTop: 5, color: ColorsBlue.blue50}]}>Credits: €{currency}</Text>
                <Text style = {[styles.tries, {marginTop: 5}]}>Pogingen: {filteredTry ? filteredTry : 0 }/{maxTries}</Text>
            </View>
            
            <FlatList
                data={multipleChoiceOptions}
                renderItem={({ item, index }) => MultipleChoiceTileHandler({ item, index })}
                keyExtractor={(item, index) => index.toString()}
                showVerticalScrollIndicator={false}
            />
        </View>
    )
}


export default MultipleChoiceContainer;


const styles = StyleSheet.create({ 
    shadow: {
        shadowColor: `rgba(1, 1, 1, 1)`,
        shadowOffset: {height: 2, width: 1},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 4,
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
        justifyContent: 'center',
        alignItems: 'center', 
        paddingHorizontal: 10
    },
    text: {
        color: ColorsBlue.blue100,
        fontSize: 18,
        fontWeight: '200',
        textAlign: 'center',
        lineHeight: 23,
        textShadowColor: ColorsBlue.blue1400,
        textShadowOffset: {height: 2, width: 0},
        textShadowRadius: 3,
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
    }
})