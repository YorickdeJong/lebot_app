import { useContext, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { ColorsBlue } from "../../constants/palet";
import { SocketContext } from "../../store/socket-context";
import LoadingOverlay from "../UI/LoadingOverlay";


function SSHPressable({output, currentPath, setCurrentPath}) {
    const socketCtx = useContext(SocketContext);
    const [isLoading, setIsLoading] = useState(false);

    function extractText() {
        setIsLoading(true)
        const lastRightArrowIndex = output.lastIndexOf('>');
        if (lastRightArrowIndex !== -1) {
            output = output.substring(lastRightArrowIndex + 1, output.length);
            output = output.trim()
            let executeCommand = currentPath ? `${currentPath}/${output}` : 'cd ' + output;
            setCurrentPath(executeCommand);

            socketCtx.Command('cd', executeCommand); 
            executeCommand = executeCommand + ' && ' + 'dir'
            socketCtx.Command('dir', executeCommand); 
            console.log(`execute command ${executeCommand}`)
        }
        else {
            Alert.alert('This is not a directory!');
            return;
        }
        setIsLoading(false)
    }   

    if (isLoading) {
        return(
            <LoadingOverlay message= 'Loading Data...' />
        )
    }

    return (
        <View>
            <Pressable
    	    style = {({pressed}) => [styles.container, pressed && styles.pressed]}
            onPress={extractText}>
                <Text style={[styles.text, {fontSize: 14}]}>
                    {output}
                </Text>
            </Pressable>
        </View>
    )

}

export default SSHPressable

const styles = StyleSheet.create({
        text: {
        color: "white",
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginRight: 10,
        marginLeft: 15
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