import { TouchableOpacity } from "react-native-gesture-handler";
import {Alert, View, FlatList, StyleSheet, Text, SectionList} from 'react-native';
import { BlurView } from "expo-blur";
import { ColorsBlue, ColorsGreen } from "../../../constants/palet";
import { useContext, useEffect, useState } from "react";
import { UserProfileContext } from "../../../store/userProfile-context";
import { AssignmentDetailsContext } from "../../../store/assignment-Details-context";
import { createAssignmentsDetail, getSpecificAssignmentsDetail } from "../../../hooks/assignmentDetails";


function MultipleChoiceContainer({multipleChoiceOptions, multipleChoiceAnswers, subject, assignment_number, assignment_id, title, sendData}) {
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
            <TouchableOpacity onPress = {() => !tileColor[index] ? checkAnswerHandler() : Alert.alert('Deze vraag is al beantwoord')} 
                style = {[styles.tile, tileColor[index] && {backgroundColor: multipleChoiceAnswers[index] === 'true' ? 'rgba(10,100,10, 0.2)' : 'rgba(100,10,10,0.3)'}]}>
                <BlurView intensity={tileColor[index] ? 15 : 40} tint = {tileColor[index] ? 'light' : 'dark'} style = {styles.blurView}>
                    <View style = {styles.textContainer}>
                        <Text style = {styles.text}>{item}</Text>
                    </View>
                </BlurView>
            </TouchableOpacity>
        )
    }
    
    return (
        <View style = {{marginTop: 12}}>
            <Text style = {styles.tries}>Pogingen: {filteredTry ? filteredTry : 0 }/{maxTries}</Text>
            
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
    tile: {
        marginHorizontal: 10,
        marginVertical: 5,
        height: 55,
        borderWidth: 0.8,
        borderColor: `rgba(77, 77, 77, 0.5)`,
        shadowColor: `rgba(11, 11, 11)`,
        shadowOffset: {height: 2, width: 1},
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 2,
        backgroundColor: 'rgba(10,10,100, 0.15)'
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
        paddingHorizontal: 5
    },
    text: {
        color: ColorsBlue.blue50,
        fontSize: 19,
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