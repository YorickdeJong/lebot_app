import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet, View } from "react-native";
import CodingQuestions from "../../../components/assignments/CodingQuestions/CodingQuestions";
import { ColorsBlue } from "../../../constants/palet";

function CodeAnswerScreen({tabIndex, currentIndex}) {

    console.log(`tabIndex: ${tabIndex}`)
    console.log(`currentIndex: ${currentIndex}`)
    const isFocused = tabIndex === currentIndex
    return (
        <CodingQuestions 
        isFocused = {isFocused}/>
    )
}


export default CodeAnswerScreen


