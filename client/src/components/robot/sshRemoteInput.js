import { SocketContext } from '../../store/socket-context';
import { useContext, useState, useEffect } from 'react'
import { View, Text, Alert} from 'react-native'
import UserTextContainer from '../userProfile/UserTextContainer';

function SSHRemoteInput({inputHandler, credentialsInvalid, ipAddress, username, password, resetContent}) {
    const socketCtx = useContext(SocketContext);
    return (
        <View>
            {!socketCtx.isConnected  &&
                <UserTextContainer 
                text = "IP Address"
                connectedText = "Not Connected"
                checkInput = {!credentialsInvalid.checkIP}
                inputHandler = {inputHandler.bind(this, 'ipAddress')}
                value = {ipAddress}
                onPressHandler = {resetContent.bind(this, 'ipAddress')}
                />
            }

            {!socketCtx.isConnected  &&
                <UserTextContainer 
                text = {"Username of Host Device"}
                checkInput = {!credentialsInvalid.checkUsername}
                inputHandler = {inputHandler.bind(this, 'username')}
                value = {username}
                onPressHandler = {resetContent.bind(this, 'username')}
                />
            }

            {!socketCtx.isConnected  &&
                <UserTextContainer 
                text = {"Password of Host Device"}
                checkInput = {!credentialsInvalid.checkPassword}
                inputHandler = {inputHandler.bind(this, 'password')}
                value = {password}
                onPressHandler = {resetContent.bind(this, 'password')}
                />
            }
        </View>
    )
}

export default SSHRemoteInput