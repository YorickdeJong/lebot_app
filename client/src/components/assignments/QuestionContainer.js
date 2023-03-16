import { useContext, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { ColorsBlue, ColorsGray, ColorsTile } from "../../constants/palet"
import { AssignmentDetailsContext } from "../../store/assignment-Details-context";
import { CarContext } from "../../store/car-context";
import { UserProfileContext } from "../../store/userProfile-context";
import Icon from "../Icon"



function QuestionContainer({questionData}) {
    const [input, setInput] = useState();
    const userprofileCtx = useContext(UserProfileContext);
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);
    const carCtx = useContext(CarContext);
    const completionStatus = assignmentDetailsCtx.getCompletionStatusAssignment(questionData.assignment_number, questionData.title)

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
        <View style = {styles.assignment}>
            <View style = {styles.borderNumber}>
                <Text style = {styles.questionNumber}>Vraag {questionData.assignment_number}</Text>
            </View>
            <Text style = {styles.question}>{questionData.question}</Text>
            {completionStatus ?             
            (<View style = {styles.borderNumber}>
                <Text style = {styles.questionNumber}>Vraag Voltooid</Text>
            </View>)  :
            (
            <>
            <View style = {styles.borderNumber}>
                <Text style = {styles.questionNumber}>Antwoord</Text>
            </View>
            <View style = {{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 15}}>
                <TextInput 
                style = {styles.inputContainer}
                textContent = "Your Answer"
                onChangeText={setInputDetails}
                value = {input}
                keyboardType="number-pad"
                />
                <Icon 
                size = {36}
                color = {ColorsTile.blue200}
                icon= 'checkbox'
                onPress = {validateInput}/>
            </View>
            </>)}

        </View>
    )
}

export default QuestionContainer

const styles= StyleSheet.create({
    assignment: {
        borderColor: ColorsTile.blue200,
        borderRadius: 5,
        paddingBottom: 15
    },
    borderNumber: {
        borderBottomColor: ColorsTile.blue200,
        borderBottomWidth: 1,
        marginHorizontal: 22,
        paddingBottom: 5
    },
    questionNumber: {
        color: ColorsTile.blue200,
        textAlign: 'center',
        fontSize: 24,
    },
    question: {
        color: ColorsGray.gray200,
        textAlign: 'flex-start',
        margin: 20,
        fontSize: 16,
        hyphenationFrequency: 1,
        hyphenationFactor: 1
    },
    inputContainer: {
        marginLeft: 20,
        marginRight: 10,
        width: "78%",
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
})