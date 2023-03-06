import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native"
import ChangeButton from "../UI/ChangeButton";
import TextContainer from "../../components/Login/TextContainer";
import { ColorsBlue, ColorsGreen } from "../../constants/palet";
import { ColorContext } from "../../store/color-context";
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur";

function TextForm({LoginVariable, onAuthenticate, onCreateUser}) {
    const navigation = useNavigation()
    const colorCtx = useContext(ColorContext);

    const [credentialsInvalid, setCredentialsInvalid] = useState({
        email: false,
        password: false,
        confirmEmail: false,
        confirmPassword: false,
        checkUsername: false,
        checkName: false,
        checkLastName: false,
        checkDOB: false,
        checkSchool: false,
        checkClassSchool: false,
        checkLevel: false,
    });
    
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('')
    const [name, setName] = useState('');
    const [lastname, setLastName] = useState('');
    const [dob, setDOB] = useState('');
    const [school, setSchool] = useState('');
    const [classschool, setClassSchool] = useState('');
    const [level, setLevel] = useState('');
    
    useEffect(() => {
        setCredentialsInvalid({
            email: false,
            password: false,
            checkUsername: false,
            confirmEmail: false,
            confirmPassword: false,
            username: false,
            checkName: false,
            checkLastName: false,
            checkDOB: false,
            checkSchool: false,
            checkClassSchool: false,
            checkLevel: false,
        });
        setEnteredEmail(enteredEmail)
    }, [enteredEmail]
    )


    
    function onSubmitHandler(){
        let email= enteredEmail.trim();
        let password = enteredPassword.trim(); 

        let checkEmail = email.includes('@');
        let checkPassword  = password.length > 6;
        let checkPasswords = password === confirmPassword;
        
        let checkUsername = username.length > 2
        let checkName = name.length > 2;
        let checkLastName = lastname.length > 2;
        let checkDOB = dob.includes('-') && dob.length === 10
        let checkSchool = school.length > 2;
        let checkClassSchool = classschool.length === 1;
        let checkLevel = level.length > 2
    

        if (!checkEmail || !checkPassword || (!LoginVariable && (
            !checkPasswords || ! checkUsername || !checkName 
            || !checkLastName || !checkDOB || !checkSchool
            || !checkClassSchool || !checkLevel))) {
                Alert.alert('You did not provide the correct credentials')
                setCredentialsInvalid({
                    email: !checkEmail,
                    password: !checkPassword,
                    confirmPassword: !checkPassword || !checkPasswords,
                    checkUsername: !checkUsername,
                    checkName: !checkName,
                    checkLastName: !checkLastName,
                    checkDOB: !checkDOB,
                    checkSchool: !checkSchool,
                    checkClassSchool: !checkClassSchool,
                    checkLevel: !checkLevel,
                });
                return;
            }

            if (LoginVariable) {
                onAuthenticate({email, password})
            }
            else {       
                onCreateUser({email, password, username, name, lastname, dob, school, classschool, level})
            }
        }
        

    function onSwitchScreenHandler(){
        if (LoginVariable){
         navigation.replace('Signup')
        }
        else {
            navigation.replace('Login')
        }    
    }

    function onUserInputHandler(inputType, enteredValue) {
        switch(inputType){
            case 'email': 
                setEnteredEmail(enteredValue);
                break;
            case 'username':
                setUsername(enteredValue)
                break;
            case 'password': 
                setEnteredPassword(enteredValue);
                break;
            case 'confirmPassword':
                setConfirmPassword(enteredValue);
                break;
            case 'name':
                setName(enteredValue);
                break;
            case 'lastName':
                setLastName(enteredValue);
                break;
            case 'dob':
                setDOB(enteredValue);
                break;
            case 'school':
                setSchool(enteredValue);
                break;
            case 'classSchool':
                setClassSchool(enteredValue);
                break;
            case 'level':
                setLevel(enteredValue);
                break;
        }
        setCredentialsInvalid({
            email: false,
            password: false,
            confirmEmail: false,
            confirmPassword: false,
            username: false,
            checkName: false,
            checkLastName: false,
            checkDOB: false,
            checkSchool: false,
            checkClassSchool: false,
            checkLevel: false,
        });
    }

    return(
    <BlurView intensity={1} style={[styles.box, {backgroundColor: 'rgba(30, 50, 87, 0.4)',}]}>     
        <TextContainer 
        textContent = "Email"
        setUserDetails={onUserInputHandler.bind(this, 'email')}
        value = {enteredEmail}
        isValid = {credentialsInvalid.email}
        keyboardType="email-address"
        />
        {!LoginVariable && <TextContainer 
        textContent = "Username"
        setUserDetails={onUserInputHandler.bind(this, 'username')}
        value = {username}
        isValid = {credentialsInvalid.checkUsername}
        />}
        <TextContainer 
        textContent = "Password"
        setUserDetails={onUserInputHandler.bind(this, 'password')}
        value = {enteredPassword}
        isValid = {credentialsInvalid.password}
        secure
        />
        {!LoginVariable && <TextContainer 
        textContent = "Confirm Password"
        setUserDetails={onUserInputHandler.bind(this, 'confirmPassword')}
        value = {confirmPassword}
        isValid = {credentialsInvalid.confirmPassword}
        secure
        />}
        {
        !LoginVariable && 
        <View style = {styles.textContainer}>
            <TextContainer  
            textContent = "Name"
            setUserDetails={onUserInputHandler.bind(this, 'name')}
            value = {name}
            isValid = {credentialsInvalid.checkName} 
            addStyle = {{flex: 1}}/>
            
            <TextContainer 
            textContent = "Last Name"
            setUserDetails={onUserInputHandler.bind(this, 'lastName')}
            value = {lastname}
            isValid = {credentialsInvalid.checkLastName}
            addStyle = {{flex: 1}}
            />
        </View>
        }
        {!LoginVariable && <TextContainer 
        textContent = "Date of Birth"
        setUserDetails={onUserInputHandler.bind(this, 'dob')}
        value = {dob}
        isValid = {credentialsInvalid.checkDOB}
        />}
        {!LoginVariable && <TextContainer 
        textContent = "School"
        setUserDetails={onUserInputHandler.bind(this, 'school')}
        value = {school}
        isValid = {credentialsInvalid.checkSchool}
        />}
        {
        !LoginVariable && 
        <View style = {styles.textContainer}>
            <TextContainer  
            textContent = "Class"
            setUserDetails={onUserInputHandler.bind(this, 'classSchool')}
            value = {classschool}
            isValid = {credentialsInvalid.checkClassSchool} 
            addStyle = {{flex: 1}}/>
            
            <TextContainer 
            textContent = "Level"
            setUserDetails={onUserInputHandler.bind(this, 'level')}
            value = {level}
            isValid = {credentialsInvalid.checkLevel}
            addStyle = {{flex: 1}}
            />
        </View>
        }
        <View style={styles.buttonContainer}>
            <ChangeButton 
            onPress={onSubmitHandler}>
            {LoginVariable ? "Login" :  "Create Account"}
            </ChangeButton>

            <ChangeButton 
            onPress = {onSwitchScreenHandler}>
            {LoginVariable ? "Create Account Instead" : "Login Instead"} 
            </ChangeButton>
        </View>
     </BlurView>
    )
}

export default TextForm

const styles = StyleSheet.create({
    box: {
        marginTop: 10,
        marginHorizontal: 15,
        elevation: 2,
        borderRadius: 10,
        shadowOffset: {height:1, width:0 },
        shadowRadius: 5,
        shadowColor: ColorsBlue.blue600,
        shadowOpacity: 0.5,
        overflow: 'hidden'
    },
    buttonContainer: { 
        marginTop: 20,
        marginBottom: 20
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})