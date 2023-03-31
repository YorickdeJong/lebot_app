import { View, StyleSheet, Alert, ImageBackground } from "react-native";
import { useState, useContext, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

import {ColorsBlue, ColorsGreen, ColorsOrange } from "../../constants/palet";
import TextForm from "../../components/Login/TextForm";
import { AuthContext } from "../../store/auth-context";
import { getUserProfileDetails, login } from "../../hooks/auth";
import LoadingOverlay from "../../components/UI/LoadingOverlay";
import { ColorContext } from "../../store/color-context";
import { UserProfileContext } from "../../store/userProfile-context";
import { AssignmentContext } from "../../store/assignment-context";
import { getAllAssignments } from "../../hooks/assignments";
import { ImagesContext } from "../../store/images-context";
import { getAllImages } from "../../hooks/measurement_results";
import { AssignmentDetailsContext } from "../../store/assignment-Details-context";
import { getAllAssignmentDetails} from "../../hooks/assignmentDetails";
import { CarContext } from "../../store/car-context";
import { getUserCarDetails } from "../../hooks/carDetails";
import { ChatContext } from "../../store/chat-context";
import { getChatHistory } from "../../hooks/chatgpt";

function Login() {
    const authCtx = useContext(AuthContext);
    const userCtx = useContext(UserProfileContext)
    const assignmentCtx = useContext(AssignmentContext);
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);
    const carCtx = useContext(CarContext);
    const chatCtx = useContext(ChatContext);

    async function loginHandler({ email, password }) {
        setIsAuthenticating(true);
        try {
            const userData = await login(email, password);
            const userProfile = await getUserProfileDetails(userData.id);
            const assignments = await getAllAssignments();
            const assignmentDetails = await getAllAssignmentDetails(userData.id)
            const carDetails = await getUserCarDetails(userData.id);
            const chatHistory = await getChatHistory(userData.id);

            authCtx.authenticate(userData.token);
            userCtx.editUserProfile(userProfile);
            assignmentCtx.initializeAssignments(assignments)
            assignmentDetailsCtx.initializeAssignmentDetails(assignmentDetails)
            carCtx.initializeCarDetails(carDetails)
            chatCtx.initializeChatHistory(chatHistory)
        } 

        catch (error) {
            console.log(error)
            Alert.alert(
                'Authentication failed!',
                'Could not log you in. Please check your credentials or try again later!'
            );
            setIsAuthenticating(false);
        }
    }


    return (
        <LinearGradient colors = {[ColorsBlue.blue1200, ColorsBlue.blue1200]} style = {styles.outerContainer}>
            <ImageBackground
                source={require('./../../../assets/highway(1).png')} 
                style={styles.backgroundImage}
                imageStyle={{opacity: 0.25}}
                >
                <TextForm LoginVariable 
                onAuthenticate = {loginHandler} />
            </ImageBackground>
        </LinearGradient>
    )



}

export default Login



const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain',
        borderTopColor: ColorsBlue.blue100,
        borderTopWidth: 0.2,
        paddingTop: 50,
    }
})