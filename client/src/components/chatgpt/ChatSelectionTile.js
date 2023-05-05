import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect } from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import { ColorsBlue, ColorsGray, ColorsRed, ColorsTile } from '../../constants/palet';
import { ChatContext } from '../../store/chat-context';
import Icon from '../Icon';


function ChatSelectionTile({thread_id, navigateToChatHandler}) {
    const chatCtx = useContext(ChatContext)
    const {description, title}  = chatCtx.getDescriptionsForThreadId(thread_id)

    function deleteChatHandler() {
        chatCtx.deleteThread_ID(thread_id)
    }

    return(
        <Pressable 
        style = {styles.chatBox}
        onPress={navigateToChatHandler}>
            <LinearGradient 
                colors={[ColorsBlue.blue1300, ColorsBlue.blue1000]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style = {styles.colorGradient}
            >
                <View style = {styles.textBox}>
                    <Text style = {styles.text}>{title}</Text>
                    <Text style = {styles.description}>{description}</Text>
                </View>
                <View style={styles.iconWrapper}>
                    <Icon 
                    icon = "trash-can-outline"
                    size = {40}
                    color = {ColorsRed.red500}
                    onPress = {deleteChatHandler}
                    differentDir
                    />
                </View>
            </LinearGradient>
        </Pressable>
    )
}

export default ChatSelectionTile;

const styles = StyleSheet.create({
    chatBox: {
        borderColor: ColorsBlue.blue900,
        borderWidth: 0.9,
        flex: 1,
        marginTop: 20, 
        margin: 10,
        height: 140,
        borderRadius: 6, 
        elevation: 4, 
        shadowColor: ColorsBlue.blue1150,
        shadowOffset: {height: 3, width: 2},
        shadowRadius: 2,
        shadowOpacity: 1,
    },
    colorGradient: {
        borderRadius: 6, 
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    textBox: {
        width: 300,
        height: 90,
        padding: 10
    },  
    text: {
        color: ColorsBlue.blue50,
        fontSize: 26,
        textAlign: 'center',
        marginBottom: 5
    },
    description: {
        color: ColorsGray.gray400,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 5
    },
    iconWrapper: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
})