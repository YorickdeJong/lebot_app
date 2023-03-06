import { View, Text, Alert, ImageBackground} from 'react-native'
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
        <View style={{backgroundColor: ColorsBlue.blue1200, flex: 1}}>
        <ImageBackground
            source={require('./../../../assets/grid.jpg')} 
            style= {styles.background}
            imageStyle={{opacity: 0.4}}
            >
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


        <View style = {[socketCtx.isConnected? styles.container: [styles.container, {flexDirection: 'row', justifyContent: 'space-around'}]]}>
            <View style = {styles.button}>
                <Icon 
                icon = {socketCtx.isConnected? 'lan-disconnect': 'logo-windows' }
                size = {50}
                color = {ColorsBlue.blue200}
                onPress = {handleExecuteCommand.bind(this, 'windows')}
                differentDir={socketCtx.isConnected ? true: false}
                />
                {!socketCtx.isConnected && <Text style={styles.text}>Windows</Text>}
            </View>
            
            {!socketCtx.isConnected && 
            <View style = {styles.button}>
                <Icon 
                icon = {'ubuntu'}
                size = {53}
                color = {ColorsBlue.blue200}
                differentDir={true}
                onPress = {handleExecuteCommand.bind(this, 'linux')}
                />
                <Text style={[styles.text, {marginRight: 10}]}>Linux</Text>
            </View>}
            
            </View>
        </ImageBackground>
    </View>
   
    )
}

export default SSHForm


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        margin: 20
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center'
    },
    button: {
        alignItems: 'center',
        textAlign: 'center'
    },
    background: {
        flex: 1,
        borderTopColor: ColorsBlue.blue100,
        borderTopWidth: 0.2,
    }
})