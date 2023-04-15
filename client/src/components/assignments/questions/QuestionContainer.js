import { BlurView } from "expo-blur";;
import { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { ColorsBlue, ColorsTile } from "../../../constants/palet"
import { AssignmentDetailsContext } from "../../../store/assignment-Details-context";
import { CarContext } from "../../../store/car-context";
import { UserProfileContext } from "../../../store/userProfile-context";
import Icon from "../../Icon"


function QuestionContainer({questionData, assignmentNumber}) {
    const [input, setInput] = useState();
    const userprofileCtx = useContext(UserProfileContext);
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);
    const carCtx = useContext(CarContext);
    const completionStatus = assignmentDetailsCtx.getCompletionStatusAssignment(questionData.assignment_number, questionData.title)
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        setShowDescription(false);
    }, [questionData])
    function expandDescriptionHandler(){
        setShowDescription(!showDescription)
    }

    function setInputDetails(textInput) {
        setInput(textInput);
        console.log(input)
    }

    function validateInput() {
        if (input === questionData.answer){
            //get user_id and assignment_id

            const assignmentObject = {
                user_id: userprofileCtx.userprofile.id, 
                assignment_id: questionData.assignment_id,
            }

            const assignmentLocalStorage = {
                assignment_id: questionData.assignment_id,
                assignment_number: questionData.assignment_number,
                title: questionData.title,
            }
            assignmentDetailsCtx.addAssignmentDetails(assignmentObject, assignmentLocalStorage)

            Alert.alert('Antwoord Correct!');
            carCtx.editMoney(questionData.currency);
          
        }   
    }

    return (
        <>
            <BlurView intensity={10} tint = "dark" style = {styles.outerContainer}>
                <View style = {styles.questionContainer}>
                    
                                 
                    <View style = {styles.questionCompletedContainer}>
                        <Text style = {styles.questionCompleted}>{completionStatus ? "Vraag Voltooid" : `Opdracht ${assignmentNumber}`}</Text>
                    </View>
                    
                    <View style={styles.descriptionContainer}>
                        <Text style = {styles.question}>
                            {questionData.question}
                        </Text>
                        
                        {!showDescription && completionStatus &&
                        <TouchableOpacity
                        onPress = {expandDescriptionHandler}>
                            <Text style = {[styles.question, {marginLeft: 8, color: ColorsBlue.blue50}]}>...meer</Text>
                        </TouchableOpacity>
                        }

                    </View>
                    {showDescription && completionStatus && <TouchableOpacity
                        onPress = {expandDescriptionHandler}>
                        <Text style = {[styles.question, {marginLeft: 15, marginTop: 10, color: ColorsBlue.blue50}]}>...minder</Text>
                    </TouchableOpacity>
                    }
                    {!completionStatus &&
                    <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 0,  marginLeft: 11, marginRight: 9}}>
                        <View style = {{flex: 1}}>
                            <TextInput 
                            style = {styles.inputContainer}
                            placeholder = "Your Answer"
                            onChangeText={setInputDetails}
                            value = {input}
                            keyboardType="number-pad"
                            />
                        </View>
                            <Icon 
                            size = {36}
                            color = {ColorsTile.blue200}
                            icon= 'checkbox'
                            onPress = {validateInput}/>
                    </View>}
                </View>
            </BlurView>
        </>
    )
}

export default QuestionContainer

const styles= StyleSheet.create({
    questionCompletedContainer: {
        marginHorizontal: 12,
    },
    questionCompleted: {
        color: ColorsTile.blue200,
        fontSize: 24,
        fontWeight: 'bold',
        paddingTop: 2
    },
    questionContainer: {
        marginHorizontal: 7,
        paddingTop: 5,
        paddingBottom: 5, 
        borderRadius: 5,
    },
    inputContainer: {
        marginRight: 5,
        height: 30,
        borderRadius: 5, 
        backgroundColor: ColorsTile.blue200,
        elevation: 2,
        shadowOffset: {height:2, width:0 },
        shadowRadius: 5,
        shadowColor: ColorsBlue.blue1300,
        shadowOpacity: 0.5,
        paddingLeft: 5
    },
    descriptionContainer: {
        flexDirection: 'row',
        marginLeft: 12,
        marginRight: 12,
        marginVertical: 4,
    },
    question: {
        fontSize: 16,
        color: ColorsBlue.blue50,
        lineHeight: 24
    },
    outerContainer: {
        paddingBottom: 5,
        marginVertical: 6,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.5)`,
        shadowColor: `rgba(11, 11, 11)`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
    }
})