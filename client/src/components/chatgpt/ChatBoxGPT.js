
import {View, Text, StyleSheet, Image} from 'react-native'
import { ColorsBlue } from '../../constants/palet'

function ChatBoxGPT({ answer }) {
  return (
    <View style={styles.textBox}>
        <View>
            <Image
            style={styles.profilePicture}
            source={require("./../../../assets/chatgptLogo.png")}
            resizeMode="contain"
            />
        </View>
        <View style={styles.chatGPTTextBox}>
            <Text style={styles.chatGPTText}>{answer}</Text>
        </View>
    </View>
  );
}

export default ChatBoxGPT;

const styles = StyleSheet.create({
    chatGPTTextBox: {
        backgroundColor: ColorsBlue.blue1100,
        borderRadius: 10,
        padding: 10,
    },
    chatGPTText: {
        color: ColorsBlue.blue50,
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
    textBox: {
        flexDirection: "row",
        marginVertical: 10,
        maxWidth: 300,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    profilePicture: {
        width: 30,
        height: 30,
        borderRadius: 30,
        marginRight: 10,
    },
});
