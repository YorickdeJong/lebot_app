import { View, KeyboardAvoidingView, StyleSheet, ScrollView, Alert, ImageBackground, Text, Dimensions } from "react-native";
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

const {height: SCREEN_HEIGHT} = Dimensions.get('window')

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
            console.log('userData', userData)
            console.log('check 1')
            const assignments = await getAllAssignments();
            console.log('check 2')
            userProfile.id = userData.id

            console.log('check 3')
            userCtx.editUserProfile(userProfile);
            console.log('check 4')
            {user_role === "student" ? assignmentCtx.initializeAssignments(assignments) : null}
            console.log('check 5')
            
            authCtx.authenticate(userData.token);
            console.log('check 6')
        }
        catch (error) {
            console.log('error while making account', error)
            Alert.alert('Error', 'Het aanmaken an een account is niet gelukt')
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
        width: '100%',
        height: SCREEN_HEIGHT,
        resizeMode: 'contain',
    }
})