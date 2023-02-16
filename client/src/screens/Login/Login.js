import { View, StyleSheet, Alert } from "react-native";
import { useState, useContext } from "react";
import {ColorsBlue, ColorsGreen } from "../../constants/palet";
import TextForm from "../../components/Login/TextForm";
import { AuthContext } from "../../store/auth-context";
import { getUserProfileDetails, login } from "../../hooks/auth";
import LoadingOverlay from "../../components/UI/LoadingOverlay";
import { ColorContext } from "../../store/color-context";
import { UserProfileContext } from "../../store/userProfile-context";

function Login() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const authCtx = useContext(AuthContext);
    const colorCtx = useContext(ColorContext);
    const userCtx = useContext(UserProfileContext)

    async function loginHandler({ email, password }) {

        setIsAuthenticating(true);
        try {
            const userData = await login(email, password);
            console.log(userData)
            console.log(userData.id)
            console.log(userData.token)
            const userProfile = await getUserProfileDetails(userData.id);
            authCtx.authenticate(userData.token);
            userCtx.editUserProfile(userProfile);
            
        } catch (error) {
        Alert.alert(
            'Authentication failed!',
            'Could not log you in. Please check your credentials or try again later!'
        );
        setIsAuthenticating(false);
        }
    }

    if (isAuthenticating) {
        return <LoadingOverlay message="Logging you in..." />;
    }

    return (
        <View style = {[styles.outerContainer, {borderTopColor: colorCtx.isBlue ? ColorsGreen.green700 : ColorsBlue.blue700}]}>
            <TextForm LoginVariable 
            onAuthenticate = {loginHandler} />
        </View>
    )
}

export default Login



const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        borderWidth: "1%",
        
    },
})