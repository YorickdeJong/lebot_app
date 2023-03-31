import { useIsFocused } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import InformationCodingScreen from "../../../components/assignments/CodingComponent.js/informationCodingScreen";
import { ASSIGNMENT_EXPLANATION } from "../../../data/InitialAssignmentExplanation";
import { ChatContext } from "../../../store/chat-context";




function CodingScreen({tabIndex, currentIndex}){
    const isFocused = tabIndex === currentIndex;


    console.log(`isFoccused: ${isFocused}`)


    return (
        <InformationCodingScreen 
        isFocused={isFocused}
        />
    )
}

export default CodingScreen