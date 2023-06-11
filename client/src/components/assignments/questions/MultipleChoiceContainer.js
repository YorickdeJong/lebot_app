import { TouchableOpacity } from "react-native-gesture-handler";
import {Alert, View, FlatList, StyleSheet, Text, SectionList, Platform} from 'react-native';
import { BlurView } from "expo-blur";
import { ColorsBlue, ColorsDarkerRed, ColorsGray, ColorsGreen, ColorsLighterGold, ColorsRed } from "../../../constants/palet";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserProfileContext } from "../../../store/userProfile-context";
import { AssignmentDetailsContext } from "../../../store/assignment-Details-context";
import { createAssignmentsDetail, getSpecificAssignmentsDetail } from "../../../hooks/assignmentDetails";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "../../Icon";
import MultipleChoiceOptions from "../../UI/MultipleChoiceOptions";


function MultipleChoiceContainer({
    multipleChoiceOptions, 
    checkTimerActive, 
    multipleChoiceAnswers, 
    subject, 
    assignment_number, 
    assignment_id, 
    title, 
    sendData, 
    currency,
    index, 
    slideCount,
    answerHandler
}) {
    const boolArray = Array.from({length: multipleChoiceOptions.length }, () => false);
    const [tileColor,  setTileColor] = useState(boolArray);
    const userprofileCtx = useContext(UserProfileContext);
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    const maxTries = multipleChoiceAnswers.filter(multiple => multiple === 'true').length; //calculate amount of maxTries a student has
    const [filteredTry, setFilteredTry] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    const fetchData = useCallback(async() => {
        try {
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
        }
        catch(error) {
            return 
        }
    }, [school_id, class_id, group_id, assignment_id, subject, multipleChoiceOptions.length]);


    useEffect(() => {
        if (index !== slideCount - 1) {
            return;
        }
        fetchData();
    }, [index, slideCount]);



    
    return (
        <View style = {{marginTop: 5}}>
            <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20}}>
                <Text style = {[styles.tries, {marginTop: 5}]}>Credits: €{currency}</Text>
                <Text style = {[styles.tries, {marginTop: 5}]}>Pogingen: {filteredTry ? filteredTry : 0 }/{maxTries}</Text>
            </View>
            <MultipleChoiceOptions 
                timer = {true}
                tileColor = {tileColor}
                setTileColor = {setTileColor}
                correctAnswers = {correctAnswers} 
                setCorrectAnswers = {setCorrectAnswers}
                filteredTry = {filteredTry} 
                setFilteredTry = {setFilteredTry}
                maxTries = {maxTries} 
                checkTimerActive = {checkTimerActive} 
                sendData = {sendData} 
                title = {title}
                assignment_number = {assignment_number}
                subject = {subject}
                multipleChoiceOptions = {multipleChoiceOptions}
                multipleChoiceAnswers = {multipleChoiceAnswers}
                answerHandler = {answerHandler}
            />
        </View>
    )
}


export default React.memo(MultipleChoiceContainer);


const styles = StyleSheet.create({ 
    tries: {
        fontSize: 20,
        fontWeight: '300',
        textAlign: 'center',
        marginBottom: 10,
        color: ColorsGray.gray300,
    },
})