import { View, Text, Alert} from 'react-native'
import { useContext, useState, useEffect } from 'react'
import Icon from '../Icon';
import UserTextContainer from '../userProfile/UserTextContainer';
import {StyleSheet, FlatList } from 'react-native';
import { ColorsBlue } from '../../constants/palet';
import { SocketContext } from '../../store/socket-context';

import SSHRemoteInput from './sshRemoteInput';
import SSHConnected from './sshConnected';

function SSHForm({handleExecuteCommand, setIpAddress, 
    setUsername, setPassword,  ipAddress,
    username, password, credentialsInvalid, serverOutput}) {
    
    const socketCtx = useContext(SocketContext);
    const [command, setCommand] = useState('');

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
            case 'command': 
                setCommand(input);
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
            case 'command': 
                setCommand('');
                break; 
        }
    }

    return (
        <View>
            <SSHRemoteInput 
            inputHandler={inputHandler}
            resetContent={resetContent}
            credentialsInvalid={credentialsInvalid}
            ipAddress={ipAddress}
            username={username}
            password={password}
            />
            <SSHConnected
            inputHandler={inputHandler}
            resetContent={resetContent} 
            serverOutput={serverOutput}
            command={command}
            />


        <View style = {styles.container}>
            <Icon 
            icon = {socketCtx.isConnected? 'lock-closed': 'lock-open' }
            size = {50}
            color = {ColorsBlue.blue200}
            onPress = {handleExecuteCommand}
            />
        </View>
    </View>
    )
}

export default SSHForm


const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },

})