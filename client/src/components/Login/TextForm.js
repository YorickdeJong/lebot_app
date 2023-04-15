import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native"
import ChangeButton from "../UI/ChangeButton";
import TextContainer from "../../components/Login/TextContainer";
import { ColorsBlue, ColorsGreen } from "../../constants/palet";
import { ColorContext } from "../../store/color-context";
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur";

function TextForm({LoginVariable, onAuthenticate, onCreateUser, authenticateType}) {
    const navigation = useNavigation()

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
        console.log(authenticateType)
        if (LoginVariable){
         navigation.replace('Signup', {
            authenticateType: {authenticateType}
         })
        }
        else {
            navigation.replace('Login', {
                authenticateType: {authenticateType}
            })
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
        <View style = {styles.boxContainer}>
            <BlurView intensity={15} tint = "dark" style={[styles.box, ]}>
                <Text style  = {styles.userTypeText}>{authenticateType}</Text>    
                <TextContainer 
                placeholder = "Email"
                setUserDetails={onUserInputHandler.bind(this, 'email')}
                value = {enteredEmail}
                isValid = {credentialsInvalid.email}
                keyboardType="email-address"
                />
                {!LoginVariable && 
                    <TextContainer 
                    placeholder = "Username"
                    setUserDetails={onUserInputHandler.bind(this, 'username')}
                    value = {username}
                    isValid = {credentialsInvalid.checkUsername}
                />
                }
                <TextContainer 
                placeholder = "Password"
                setUserDetails={onUserInputHandler.bind(this, 'password')}
                value = {enteredPassword}
                isValid = {credentialsInvalid.password}
                secure
                />
                {!LoginVariable && 
                    <TextContainer 
                    placeholder = "Confirm Password"
                    setUserDetails={onUserInputHandler.bind(this, 'confirmPassword')}
                    value = {confirmPassword}
                    isValid = {credentialsInvalid.confirmPassword}
                    secure
                    />
                }
                {!LoginVariable && 
                    <TextContainer  
                    placeholder = "Name"
                    setUserDetails={onUserInputHandler.bind(this, 'name')}
                    value = {name}
                    isValid = {credentialsInvalid.checkName} 
                    addStyle = {{flex: 1}}/>
                }  
                {!LoginVariable && 
                    <TextContainer 
                    placeholder = "Last Name"
                    setUserDetails={onUserInputHandler.bind(this, 'lastName')}
                    value = {lastname}
                    isValid = {credentialsInvalid.checkLastName}
                    addStyle = {{flex: 1}}
                    />
                }
                {!LoginVariable && 
                    <TextContainer 
                    placeholder = "Date of Birth"
                    setUserDetails={onUserInputHandler.bind(this, 'dob')}
                    value = {dob}
                    isValid = {credentialsInvalid.checkDOB}
                />
                }
                {!LoginVariable && 
                    <TextContainer 
                    placeholder = "School"
                    setUserDetails={onUserInputHandler.bind(this, 'school')}
                    value = {school}
                    isValid = {credentialsInvalid.checkSchool}
                    />
                }
                {!LoginVariable && 
                    <TextContainer  
                    placeholder = "Class"
                    setUserDetails={onUserInputHandler.bind(this, 'classSchool')}
                    value = {classschool}
                    isValid = {credentialsInvalid.checkClassSchool} 
                    addStyle = {{flex: 1}}/>
                }
                {!LoginVariable && 
                    <TextContainer 
                    placeholder = "Level"
                    setUserDetails={onUserInputHandler.bind(this, 'level')}
                    value = {level}
                    isValid = {credentialsInvalid.checkLevel}
                    addStyle = {{flex: 1}}
                    />
                }
                <View style={styles.buttonContainer}>
                    <ChangeButton 
                    onPress={onSubmitHandler}>
                    {LoginVariable ? "Login" :  "Create Account"}
                    </ChangeButton>

                    <ChangeButton 
                    onPress = {onSwitchScreenHandler}>
                    {LoginVariable ? "Create Account" : "Login Instead"} 
                    </ChangeButton>
                </View>
            </BlurView>
        </View>
    )
}

export default TextForm

const styles = StyleSheet.create({
    boxContainer: {
        shadowOffset: {height: 2, width:0 },
        shadowRadius: 5,
        shadowColor: ColorsBlue.blue1300,
        shadowOpacity: 0.8,
    },
    box: {
        marginTop: 20,
        marginHorizontal: 15,
        paddingTop: 20,
        elevation: 2,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: ColorsBlue.blue1200,
    },
    buttonContainer: { 
        marginTop: 15,
        marginBottom: 20
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userTypeText: {
        fontSize: 20,
        fontWeight: '400',
        color: ColorsBlue.blue100,
        textAlign: 'center',
        marginBottom: 0,
    }
})