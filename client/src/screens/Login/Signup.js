import { View, KeyboardAvoidingView, StyleSheet, ScrollView, Alert, ImageBackground } from "react-native";
import {useContext, useState} from 'react'

import { ColorsGreen, ColorsBlue } from "../../constants/palet";
import TextForm from "../../components/Login/TextForm";
import { ColorContext } from "../../store/color-context";
import { UserProfileContext } from "../../store/userProfile-context";
import { createUser } from "../../hooks/auth";
import { AuthContext } from "../../store/auth-context";
import LoadingOverlay from "../../components/UI/LoadingOverlay";
import { AssignmentContext } from "../../store/assignment-context";
import { getAllAssignments } from "../../hooks/assignments";
import { CarContext } from "../../store/car-context";
import { createUserCarDetails } from "../../hooks/carDetails";
import { LinearGradient } from "expo-linear-gradient";

function Signup() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const colorCtx = useContext(ColorContext);
    const userCtx = useContext(UserProfileContext)
    const authCtx = useContext(AuthContext);
    const assignmentCtx = useContext(AssignmentContext);
    const carCtx = useContext(CarContext)

    async function signUpHandler({email, password, username, name, lastname, dob, school, classschool, level}) {
        setIsAuthenticating(true);
        const userProfile = {
            email: email,
            password: password,
            username: username,
            name: name,
            lastName: lastname,
            DOB: dob,
            school: school,
            classSchool: classschool,
            level: level,
            id: ''
        }
        try {
            const userData = await createUser(userProfile);
            const assignments = await getAllAssignments();
            userProfile.id = userData.id
            const carDetails = createUserCarDetails(userData.id);

            authCtx.authenticate(userData.token);
            userCtx.editUserProfile(userProfile);
            assignmentCtx.initializeAssignments(assignments);
            carCtx.initializeAssignments(carDetails);
        }
        catch (error) {
            Alert.alert('failed to create user, please check your credentials')
            setIsAuthenticating(false);
        }
    }

    if (isAuthenticating) {
        return <LoadingOverlay message= "Logging you in..." />;
    }

    return (
        <KeyboardAvoidingView behavior = "padding" keyboardVerticalOffset={64}
        style = {[styles.outerContainer, {borderTopColor: [colorCtx.isBlue ? ColorsGreen.green700 : ColorsBlue.blue700]}]}>
                <LinearGradient colors = {[ColorsBlue.blue1200, ColorsBlue.blue1200]} style = {styles.outerContainer}>
                    <ImageBackground
                        source={require('./../../../assets/highway(1).png')} 
                        style={styles.backgroundImage}
                        imageStyle={{opacity: 0.25}}>
                        <ScrollView >
                            <TextForm 
                            onCreateUser = {signUpHandler} />
                        </ScrollView>
                    </ImageBackground>
                </LinearGradient>
        </KeyboardAvoidingView>
    )
}

export default Signup



const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        borderWidth: "1%",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain',
        borderTopColor: ColorsBlue.blue100,
        borderTopWidth: 0.2,
        paddingBottom: 35
    }
})