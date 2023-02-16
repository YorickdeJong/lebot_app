import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import Icon from '../../../components/Icon';
import UserTextContainer from '../../../components/userProfile/UserTextContainer';
import { ColorsBlue } from '../../../constants/palet';

const SSHConnectionScreen = () => {
    const [output, setOutput] = useState('');
    const [ipAddress, setIpAddress] = useState('10.7.191.114');
    const [username, setUsername] = useState('yoric');
    const [password, setPassword] = useState('Spincity1')
    const [credentialsInvalid, setCredentialsInvalid] = useState({
        checkIP: false,
        checkUsername: false,
        checkPassword: false,
    })

    const handleExecuteCommand = async () => {
        let checkIP = ipAddress.length >= 12 && ipAddress.includes('.');
        let checkUsername = username.length > 0;
        let checkPassword = password.length > 0;


        if (!checkIP || !checkUsername || !checkPassword ){
            Alert.alert('Incorrect credentials, please fill in the correct ones')
            setCredentialsInvalid({
                checkIP: !checkIP,
                checkUsername: !checkUsername,
                checkPassword: !checkPassword
            })
            return;
        }

        const config = {
            host: ipAddress,
            port: 22,
            username: username,
            password: password,
        };
    }

    function inputHandler(inputType, input) {
        switch (inputType) {
            case 'ipAddress': 
                setIpAddress(input);
                break;
            case 'username':
                setUsername(input);
                break;
            case 'password': 
                setPassword(input);
                break; 
        }
    }

    function resetContent(inputType) {
        switch (inputType) {
            case 'ipAddress': 
                setIpAddress('');
                break;
            case 'username':
                setUsername('');
                break;
            case 'password': 
                setPassword('');
                break; 
        }
    }

    return (
        <View>
            <UserTextContainer 
            text = {"IP Address"}
            checkInput = {!credentialsInvalid.checkIP}
            inputHandler = {inputHandler.bind(this, 'ipAddress')}
            value = {ipAddress}
            onPressHandler = {resetContent.bind(this, 'ipAddress')}
            />

            <UserTextContainer 
            text = {"Username of Host Device"}
            checkInput = {!credentialsInvalid.checkUsername}
            inputHandler = {inputHandler.bind(this, 'username')}
            value = {username}
            onPressHandler = {resetContent.bind(this, 'username')}
            />

            <UserTextContainer 
            text = {"Password of Host Device"}
            checkInput = {!credentialsInvalid.checkPassword}
            inputHandler = {inputHandler.bind(this, 'password')}
            value = {password}
            onPressHandler = {resetContent.bind(this, 'password')}
            />
        <View style = {styles.container}>
            <Text style={styles.text}>Connect</Text>
            <Icon 
            icon = 'lock-open'
            size = {40}
            color = {ColorsBlue.blue200}
            onPress = {handleExecuteCommand}
            />
        </View>
        <View style = {styles.outputContainer}>
            <Text style = {[styles.text, {marginTop: 10}]}>Output</Text>
            <Text style = {styles.text}>{output}</Text>
        </View>
    </View>
    );
};

export default SSHConnectionScreen

const styles = StyleSheet.create({
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginRight: 10,
    },
    container: {
        alignItems: 'center'
    },
    outputContainer: {
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: ColorsBlue.blue500,
        height: 80,
        margin: 20
    }
})