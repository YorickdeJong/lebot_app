import { View, KeyboardAvoidingView, StyleSheet, ScrollView, Alert, ImageBackground, Text } from "react-native";
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


function Signup({route}) {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const colorCtx = useContext(ColorContext);
    const userCtx = useContext(UserProfileContext)
    const authCtx = useContext(AuthContext);
    const assignmentCtx = useContext(AssignmentContext);
    const carCtx = useContext(CarContext)
    const authenticateType = route.params.type

    async function signUpHandler({email, password, username, name, lastname, dob, school_name, school_id, user_role}) {
        setIsAuthenticating(true);
        const userProfile = {
            email: email,
            password: password,
            username: username,
            name: name,
            lastname: lastname,
            dob: dob,
            school_name: school_name,
            school_id: school_id,
            user_role: user_role,
        }
        try {
            const userData = await createUser(userProfile);
            const assignments = await getAllAssignments();
            userProfile.id = userData.id
            const carDetails = await createUserCarDetails(userData.id);

            userCtx.editUserProfile(userProfile);
            {user_role === "student" ? assignmentCtx.initializeAssignments(assignments) : null}
            {user_role === "student" ? carCtx.initializeAssignments(carDetails) : null}

            authCtx.authenticate(userData.token);
        }
        catch (error) {
            console.log(error)
            Alert.alert('failed to create user, please check your credentials')
            setIsAuthenticating(false);
        }
    }


 
    return (
        <KeyboardAwareScrollView
        style={[
          styles.outerContainer,
          { borderTopColor: [colorCtx.isBlue ? ColorsGreen.green700 : ColorsBlue.blue700] },
        ]}
        extraHeight={64}
        enableOnAndroid
      >
            <ImageBackground
                source={require('./../../../assets/planets/login_page.png')} 
                style={styles.backgroundImage}
                imageStyle={{opacity: 0.8}}>
                <ScrollView >
                    <TextForm 
                    onCreateUser = {signUpHandler} 
                    authenticateType={authenticateType}
                    />
                </ScrollView>
            </ImageBackground>
         </KeyboardAwareScrollView>
    )
}

export default Signup



const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain',
        paddingBottom: 35
    }
})