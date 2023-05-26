import { View, StyleSheet, Alert, ImageBackground } from "react-native";
import { useState, useContext, useEffect } from "react";

import {ColorsBlue, ColorsGreen, ColorsOrange } from "../../constants/palet";
import TextForm from "../../components/Login/TextForm";
import { AuthContext } from "../../store/auth-context";
import { getAdminProfileDetails, getUserProfileDetails, login, loginAdmin } from "../../hooks/auth";
import { UserProfileContext } from "../../store/userProfile-context";
import { AssignmentContext } from "../../store/assignment-context";
import { getAllAssignments } from "../../hooks/assignments";
import { AssignmentDetailsContext } from "../../store/assignment-Details-context";
import { getAllAssignmentDetails} from "../../hooks/assignmentDetails";
import { CarContext } from "../../store/car-context";
import { getUserCarDetails } from "../../hooks/carDetails";
import { ChatContext } from "../../store/chat-context";
import { getChatHistory } from "../../hooks/chatgpt";

function Login({route}) {
    const authCtx = useContext(AuthContext);
    const userCtx = useContext(UserProfileContext)
    const assignmentCtx = useContext(AssignmentContext);
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext);
    const carCtx = useContext(CarContext);
    const chatCtx = useContext(ChatContext);
    const authenticateType = route.params.type

    console.log('auth type', authenticateType)

    async function loginHandler({ email, password }) {
        try {
            const userData = await login(email, password);
            const user_role = userData.user_role
            if (authenticateType !== user_role) {
                Alert.alert(
                    'Authenticatie mislukt!',
                    'Je hebt de verkeerde inlog rol!'
                );
                return;
            }
            
            authCtx.authenticate(userData.token);
            

            const userProfile = await getUserProfileDetails(userData.id);
            console.log(userProfile)
            userCtx.editUserProfile(userProfile);
            
            const assignments = await getAllAssignments(); //
            assignmentCtx.initializeAssignments(assignments)
            
            if (user_role === 'student') {
                const carDetails = await getUserCarDetails(userData.id);
                console.log(carDetails)
                carCtx.initializeCarDetails(carDetails)
                
                const chatHistory = await getChatHistory(userData.id);
                chatCtx.initializeChatHistory(chatHistory)
                
            }
            
        } 

        catch (error) {
            console.log(error)
            Alert.alert(
                'Authentication failed!',
                'Could not log you in. Please check your credentials or try again later!'
            );
        }
    }

    async function adminLoginHandler({email, password}) {
        try {
            const userData = await loginAdmin(email, password);
            console.log(authenticateType)
            console.log('userData', userData)
            if (authenticateType !== userData.user_role) {
                Alert.alert(
                    'Authenticatie mislukt!',
                    'Je hebt de verkeerde inlog rol!'
                );
                return;
            }
            //ADD edit adminProfile
            const userProfile = await getAdminProfileDetails(userData.id);
            userCtx.editAdminProfile(userProfile);
            authCtx.authenticate(userData.token);
        }
        catch(error) {
            console.log(error)
            Alert.alert( 
                'Authentication failed!',
                'Could not log you in. Please check your credentials or try again later!'
            );
        } 
    }

    return (
            <ImageBackground
                source={require('./../../../assets/planets/login_page.png')} 
                style={styles.backgroundImage}
                imageStyle={{opacity: 0.75}}
                >
                <TextForm LoginVariable 
                onAuthenticate = {loginHandler} 
                onAuthenticateAdmin = {adminLoginHandler}
                authenticateType = {authenticateType}
                />
            </ImageBackground>
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
        paddingTop: 50,
    }
})