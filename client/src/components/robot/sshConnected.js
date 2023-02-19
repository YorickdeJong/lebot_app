import { SocketContext } from '../../store/socket-context';
import { useContext, useState, useEffect } from 'react'
import { View, Text, Alert, StyleSheet} from 'react-native'
import UserTextContainer from '../userProfile/UserTextContainer';
import { ColorsBlue } from '../../constants/palet';
import SSHPressable from './sshPressable';
import LoadingOverlay from "../UI/LoadingOverlay";
import Icon from '../Icon';
import { FlatList } from 'react-native-gesture-handler';

function SSHConnected({inputHandler, command, resetContent, serverOutput}) {
    const socketCtx = useContext(SocketContext);

    // ssh commands
    const [currentPath, setCurrentPath] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function onInputSubmitWindows() {
        let executeCommand; 
        let inputType = '';
        
        // If command is 'cd', reset currentPath
         if (command === 'cd') {
             setCurrentPath('');
             executeCommand = '';
             inputType = 'cd';
         }

        // If command is 'cd ..', go back to previous folder
        if (command === 'cd ..') {
            const lastSlashIndex = currentPath.lastIndexOf('/');
            if (lastSlashIndex !== -1) {
                setCurrentPath(currentPath.substring(0, lastSlashIndex));
                executeCommand = currentPath.substring(0, lastSlashIndex);
            }
            if (!executeCommand) {
                setCurrentPath('')
                executeCommand = '';
            }
            inputType = 'cdBack';
        }

        if (command.startsWith('cd ') && !(command === 'cd ..')) {
            // Otherwise, append command to current path
            const newCommand = command.substring(3, command.length)
            const newPath = currentPath ? `${currentPath}/${newCommand}` : 'cd ' + newCommand;
            setCurrentPath(newPath);
            executeCommand = newPath;
            inputType = 'cd';
        }

        if (command.startsWith('mkdir ')) {
            executeCommand = currentPath + ' && ' + command;
            inputType = 'mkdir';
        }

        if (command.startsWith('dir')) {
            executeCommand = currentPath ? currentPath + ' && ' + command : command;
            inputType = 'dir';
        }

        if (!executeCommand && !inputType) {
            Alert.alert('Please Provide a valid command');
            return;
        }
        

        socketCtx.Command(inputType, executeCommand)
    }

    function handleBackButton() {
        let executeCommand;
        setIsLoading(true)
        const lastSlashIndex = currentPath.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
            setCurrentPath(currentPath.substring(0, lastSlashIndex));
            executeCommand = currentPath.substring(0, lastSlashIndex);
        }
        if (!executeCommand) {
            setCurrentPath('')
            executeCommand = '';
        }
        socketCtx.Command('cdBack', executeCommand)
        // check if command is empty
        if (executeCommand)
        {
            executeCommand = executeCommand + ' && ' + 'dir'
        }
        else {
            executeCommand = 'dir'
        }
        socketCtx.Command('dir', executeCommand) 
        setIsLoading(false)
    }

    if (isLoading) {
        return(
            <LoadingOverlay message= 'Loading Data...' />
        )
    }

    // output for FlatList
    const data = serverOutput.split('\n').map((line) => ({ key: line }));
    return (
        <View>
            {socketCtx.isConnected && 
                <UserTextContainer 
                text = "Command"
                connectedText= "Connected"
                checkInput={true}
                inputHandler={inputHandler.bind(this, 'command')}
                value = {command}
                onPressHandler = {resetContent.bind(this, 'command')}
                onSubmitEditing={onInputSubmitWindows}
                />
            }
            {socketCtx.isConnected &&
            <Text style = {[styles.text, {paddingLeft: 5, marginTop: 0}]}>Current Dir: {socketCtx.dir}</Text>
            }
            {socketCtx.isConnected && 
            <View style={styles.outputContainer}>
                <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: "92%"}}>
                    <Icon 
                    icon='arrow-back-sharp'
                    size = {23}
                    color = "white"
                    addStyle = {{marginTop: 6}}
                    onPress = {handleBackButton}
                    />
                    <Text style={[styles.text, {marginLeft: 0, marginRight: 30}]}>Output</Text>
                    <Text></Text>
                </View>
                <View style={styles.border} />
                
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <SSHPressable
                             output = {item.key}
                             currentPath={currentPath}
                             setCurrentPath={setCurrentPath}
                             />
                        )
                    } 
                }
                />
            </View>
            }
        </View>
    )
}

export default SSHConnected

const styles = StyleSheet.create({
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginRight: 10,
        marginLeft: 15
    },
    outputContainer: {
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: ColorsBlue.blue500,
        marginTop: 10, 
        margin: 20,
        paddingBottom: 20
    },
    border: {
        height: 3,
        marginTop: 5,
        marginHorizontal: 20,
        width:"90%",
        borderRadius: 8,
        backgroundColor: ColorsBlue.blue100
    }
})