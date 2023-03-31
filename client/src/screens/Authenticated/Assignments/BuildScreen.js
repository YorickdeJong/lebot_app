import { useIsFocused } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import InformationBuildScreen from "../../../components/assignments/BuildComponent.js/InformationBuildScreen"
import { ASSIGNMENT_EXPLANATION } from "../../../data/InitialAssignmentExplanation"
import { ChatContext } from "../../../store/chat-context";

function BuildScreen({tabIndex, currentIndex}){
    const isFocused = tabIndex === currentIndex;


    return (
        <InformationBuildScreen 
        isFocused={isFocused}
        />
    )
}

export default BuildScreen
