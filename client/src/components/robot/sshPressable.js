import React, { useContext, useState, useEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { ColorsBlue } from "../../constants/palet";
import { SocketContext } from "../../store/socket-context";
import LoadingOverlay from "../UI/LoadingOverlay";
import {FileSystem} from 'expo-file-system';


function SSHPressable({output, currentPath, setCurrentPath}) {
    const socketCtx = useContext(SocketContext);

    function extractText() {
        socketCtx.Loading(true)


        if (socketCtx.os === "windows") {
            const lastRightArrowIndex = output.lastIndexOf('>');
            if (lastRightArrowIndex !== -1) {
                output = output.substring(lastRightArrowIndex + 1, output.length);
            }
        }

        output = output.trim()
        let executeCommand = currentPath ? `${currentPath}/${output}` : 'cd ' + output;
        const path = currentPath ? `${currentPath}/${output}`: output
        setCurrentPath(executeCommand);
        
        
        if (path.includes('.'))
        {
            Alert.alert('This is not a directory!');
            socketCtx.Loading(false)
            return
        }

        socketCtx.Command('cd', executeCommand); 
        
        executeCommand = executeCommand + ' && ' + 'dir'
        
        socketCtx.Command('dir', executeCommand); 
        
    }   

    return (
            <Pressable
    	    style = {({pressed}) => [styles.container, pressed && styles.pressed]}
            onPress={extractText}>
                <Text style={[styles.text, socketCtx.os === 'windows'? {fontSize: 14} : {fontSize: 18}, {marginBottom: 5}]}>
                    {output}
                </Text>
            </Pressable>
    )
}

export default React.memo(SSHPressable)

const styles = StyleSheet.create({
        text: {
        color: "white",
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginLeft: 10,
        textAlign: 'center'
    },
    pressed: {
        opacity: 0.7
    },
    container: {
        borderBottomWidth: "1%",
        borderBottomColor: ColorsBlue.blue100,
        marginHorizontal: 17,
    }
})