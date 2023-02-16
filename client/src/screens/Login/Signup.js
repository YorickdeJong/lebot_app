import { View, KeyboardAvoidingView, StyleSheet, ScrollView, Alert } from "react-native";
import {useContext, useState} from 'react'

import { ColorsGreen, ColorsBlue } from "../../constants/palet";
import TextForm from "../../components/Login/TextForm";
import { ColorContext } from "../../store/color-context";
import { UserProfileContext } from "../../store/userProfile-context";
import { createUser } from "../../hooks/auth";
import { AuthContext } from "../../store/auth-context";
import LoadingOverlay from "../../components/UI/LoadingOverlay";

function Signup() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const colorCtx = useContext(ColorContext);
    const userCtx = useContext(UserProfileContext)
    const authCtx = useContext(AuthContext);

    async function signUpHandler({email, password, username, name, lastname, dob, school, classschool, level}) {
        console.log(email);
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
            userProfile.id = userData.id

            authCtx.authenticate(userData.token);
            userCtx.editUserProfile(userProfile);
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
            <ScrollView >
                    <TextForm 
                    onCreateUser = {signUpHandler}/>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Signup



const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        borderWidth: "1%",
        
    },
})