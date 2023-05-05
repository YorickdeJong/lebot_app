import { useNavigation } from "@react-navigation/native";
import {  useEffect, useState } from "react";
import { View, StyleSheet, Alert, Text, Platform, Dimensions } from "react-native"
import ChangeButton from "../UI/ChangeButton";
import TextContainer from "../../components/Login/TextContainer";
import { ColorsBlue, ColorsGreen } from "../../constants/palet";
import { deleteSpecificKey, getSpecificKey } from "../../hooks/keys.hooks";
import BlurWrapper from "../UI/BlurViewWrapper";



const screenHeight  = Dimensions.get('window').height;

function TextForm({LoginVariable, onAuthenticate, onAuthenticateAdmin, onCreateUser, authenticateType}) {
    const navigation = useNavigation()

    const [credentialsInvalid, setCredentialsInvalid] = useState({
        email: false,
        password: false,
        confirmEmail: false,
        confirmPassword: false,
        checkType: false,
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
    const [code, setCode] = useState('');

    useEffect(() => {
        setCredentialsInvalid({
            email: false,
            password: false,
            confirmEmail: false,
            confirmPassword: false,
            checkType: false,
            checkUsername: false,
            username: false,
            checkName: false,
            checkLastName: false,
            checkDOB: false,
            checkCode: false,
        });
        setEnteredEmail(enteredEmail)
    }, [enteredEmail]
    )
    
    async function onSubmitHandler(){
        let email= enteredEmail.trim();
        let password = enteredPassword.trim(); 
        
        let checkEmail = email.includes('@');
        let checkPassword  = password.length > 6;
        let checkPasswords = password === confirmPassword;
        
        let checkUsername = username.length > 2
        let checkName = name.length > 2;
        let checkLastName = lastname.length > 2;
        let checkDOB = dob.includes('-') && dob.length === 10
        
        //TODO: add check for type from received key
        let checkCode;
        let checkType; 
        
        if (!LoginVariable) {
            try{
                checkCode =  await getSpecificKey(code) //contains available key, school id, school name, user type -> if data received, key exists
                console.log(checkCode)
                if (checkCode.uuid_key !== code) {
                    Alert.alert('You did not provide the correct code')
                    return;
                }
                //check if user logs in as the correct user role -> admins cannot create an account this way
                checkType = authenticateType === checkCode.user_role;
                console.log('checkType: ', checkType)
            }
            catch(error) {
                console.log('code failed')
                return Alert.alert('Error while logging in')
            }
        }

        //check if all the credentials are valid, default is false
        if (!checkEmail || !checkPassword || (!LoginVariable && (
            !checkType || !checkPasswords || !checkUsername || !checkName 
            || !checkLastName || !checkDOB))) {
                Alert.alert('You did not provide the correct credentials')
                setCredentialsInvalid({
                    email: !checkEmail,
                    password: !checkPassword,
                    confirmPassword: !checkPassword || !checkPasswords,
                    checkType: !checkType,
                    checkUsername: !checkUsername,
                    checkName: !checkName,
                    checkLastName: !checkLastName,
                    checkDOB: !checkDOB,
                    checkCode: !checkCode,
                });
                return;
            }
            
            //Data for login
            if (LoginVariable) {
                if (authenticateType === 'student' || authenticateType === 'teacher') {
                    onAuthenticate({email, password})
                }
                else {
                    console.log('auth type', authenticateType)
                    onAuthenticateAdmin({email, password})
                }
            }

            //data for create account
            else {       
                const {uuid_key, school_id, school_name, user_role} = checkCode
                console.log(uuid_key, ' ',school_id, ' ', school_name, ' ', user_role)
                try{
                    await onCreateUser({email, password, username, name, lastname, dob, school_name, school_id, user_role})
                }
                catch(error){
                    console.log(error)
                    Alert.alert('Error while creating account')
                    return
                }
                const isDeleted = await deleteSpecificKey(uuid_key)
                if (!isDeleted) {
                    Alert.alert('Key not valid or already used')
                    return
                }
            }
        }
        
    function onSwitchScreenHandler(){
        console.log(authenticateType)
        if (LoginVariable){
            navigation.replace('Signup', {
                type: authenticateType
            })
        }
        else {
            navigation.replace('Login', {
                type: authenticateType
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
            case 'code':
                setCode(enteredValue);
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
            checkCode: false,
        });
    }

    let title;

    if (authenticateType === "student") {
        title = "Leerling"
    }
    else if (authenticateType === "teacher") {
        title = "Docent"
    }
    else if (authenticateType === "admin") {
        title = "Admin"
    }
    else {
        return
    }

    return(
        <>
        <View style = {styles.boxContainer}>
           <BlurWrapper intensity={15} tint = "dark" style={[styles.box, ]}
           customColor={'rgba(90,90,150, 0.45)'}>
                <Text style  = {styles.userTypeText}>{title}</Text>    
                <TextContainer 
                placeholder = "Email"
                setUserDetails={onUserInputHandler.bind(this, 'email')}
                value = {enteredEmail}
                isValid = {credentialsInvalid.email}
                keyboardType="email-address"
                />
                {!LoginVariable && 
                    <TextContainer 
                    placeholder = "Gebruikersnaam"
                    setUserDetails={onUserInputHandler.bind(this, 'username')}
                    value = {username}
                    isValid = {credentialsInvalid.checkUsername}
                />
                }
                <TextContainer 
                placeholder = "Wachtwoord"
                setUserDetails={onUserInputHandler.bind(this, 'password')}
                value = {enteredPassword}
                isValid = {credentialsInvalid.password}
                secure
                />
                {!LoginVariable && 
                    <TextContainer 
                    placeholder = "Bevestig Wachtwoord"
                    setUserDetails={onUserInputHandler.bind(this, 'confirmPassword')}
                    value = {confirmPassword}
                    isValid = {credentialsInvalid.confirmPassword}
                    secure
                    />
                }
                {!LoginVariable && 
                    <TextContainer  
                    placeholder = "Naam"
                    setUserDetails={onUserInputHandler.bind(this, 'name')}
                    value = {name}
                    isValid = {credentialsInvalid.checkName} 
                    addStyle = {{flex: 1}}/>
                }  
                {!LoginVariable && 
                    <TextContainer 
                    placeholder = "Achternaam"
                    setUserDetails={onUserInputHandler.bind(this, 'lastName')}
                    value = {lastname}
                    isValid = {credentialsInvalid.checkLastName}
                    addStyle = {{flex: 1}}
                    />
                }
                {!LoginVariable && 
                    <TextContainer 
                    placeholder = "Geboortedatum"
                    setUserDetails={onUserInputHandler.bind(this, 'dob')}
                    value = {dob}
                    isValid = {credentialsInvalid.checkDOB}
                />
                }
                {!LoginVariable && 
                    <TextContainer 
                    placeholder = "Code"
                    setUserDetails={onUserInputHandler.bind(this, 'code')}
                    value = {code}
                    isValid = {credentialsInvalid.checkCode}
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
            </BlurWrapper>
        </View>
            
         
        </>
    )
}

export default TextForm

const styles = StyleSheet.create({
    boxContainer: {
        ...Platform.select({
            ios: {
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 4,
            },
            android: {
              elevation: 0,
            },
          }),
    },
    box: {
        marginTop: 20,
        marginHorizontal: 15,
        paddingTop: 20,
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
