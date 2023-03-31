import { SocketContext } from '../../store/socket-context';
import React, { useContext, useState, useEffect, useRef } from 'react'
import { View, Text, Alert, StyleSheet} from 'react-native'
import UserTextContainer from '../userProfile/UserTextContainer';
import { ColorsBlue } from '../../constants/palet';
import SSHPressable from './sshPressable';
import LoadingOverlay from "../UI/LoadingOverlay";
import Icon from '../Icon';
import { FlatList } from 'react-native-gesture-handler';

function SSHConnected({inputHandler, command, resetContent, serverOutput}) {
    const socketCtx = useContext(SocketContext);
    const [currentPath, setCurrentPath] = useState('');
    const [showFooter, setShowFooter] = useState(true);
    let data;

    useEffect(() => {
        socketCtx.Loading(true);
        console.log('executed')
        if (socketCtx.output && socketCtx.output !== ''){
            console.log('exeucted twice')
            socketCtx.Loading(false);
        }
    }, [])

    useEffect(() => {
        socketCtx.Loading(true);
        if (socketCtx.output && socketCtx.output !== ''){
            socketCtx.Loading(false);
        }
    }, [socketCtx.output])

    // Comaptible for windows and linux
    function onInputSubmit() {
        console.log(`Before: ${socketCtx.isLoading}`)
        socketCtx.Loading(true)
        console.log(`After: ${socketCtx.isLoading}`)
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

        if (command.startsWith('roslaunch')) {
            executeCommand = currentPath + ' && ' + command;
            inputType = 'roslaunch'
        }

        if (!executeCommand && !inputType) {
            Alert.alert('Please Provide a valid command');
            return;
        }
        

        socketCtx.Command(inputType, executeCommand)
    }

    // Comaptible for windows and linux
    function handleBackButton() {
        let executeCommand;
        socketCtx.Loading(true)
        const lastSlashIndex = currentPath.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
            setCurrentPath(currentPath.substring(0, lastSlashIndex));
            executeCommand = currentPath.substring(0, lastSlashIndex);
        }
        if (!executeCommand) {
            setCurrentPath('')
            executeCommand = '';
        }
        socketCtx.Command('cdBack', executeCommand, (data) => {
        });

        // check if command is empty
        if (executeCommand)
        {
            executeCommand = executeCommand + ' && ' + 'dir'
        }
        else {
            executeCommand = 'dir'
        }
        socketCtx.Command('dir', executeCommand) 
    }

    // output for FlatList

    if (serverOutput){
        if (socketCtx.os === 'windows'){
            data = serverOutput.split('\n').map((line) => ({ key: line })); // if windows split \n, if linux split(' ')
        }
        else {
            data = serverOutput.split(/\t|  |\n/).map((line) => ({ key: line })); // splits bot \t and '  '
            data = data.filter(obj => obj.key != '')
        }
    }


    //Showing footer message for flatlist
    const listRef = useRef(null);
    const containerHeight = 300; // change this to the height of your container

    const handleContentSizeChange = (contentWidth, contentHeight) => {
        const listHeight = contentHeight + 20; // add some padding
        const isListTooTall = listHeight > containerHeight;

        setShowFooter(isListTooTall);
    };

    const renderFooter = () => {
        if (!showFooter) {
        return null;
        }

        return (
        <View style={{ alignItems: 'center' }}>
            <Text style={{ color: 'gray' }}>There are more items if you scroll down</Text>
        </View>
        );
    };


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
                onSubmitEditing={onInputSubmit}
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
                    addStyle = {{marginTop: 6, marginLeft: 18}}
                    onPress = {handleBackButton}
                    />
                    <Text style={[styles.text, {marginLeft: 0}]}>Output</Text>
                    <Text></Text>
                </View>
                <View style={styles.border} />
                {socketCtx.isLoading && <LoadingOverlay message = 'Loading Data'/>}
                {!socketCtx.isLoading &&
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={renderFooter}
                        onContentSizeChange={handleContentSizeChange}
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
                }
                </View>
            }
        </View>
    )
}

export default React.memo(SSHConnected)

const styles = StyleSheet.create({
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginRight: 10,
        marginLeft: 15,
    },
    outputContainer: {
        borderRadius: 8,
        backgroundColor: ColorsBlue.blue500,
        marginTop: 10, 
        margin: 20,
        paddingBottom: 20,
        maxHeight: 420
    },
    border: {
        height: 3,
        marginTop: 5,
        marginHorizontal: 20,
        width:"90%",
        borderRadius: 8,
        backgroundColor: ColorsBlue.blue100
    },
})