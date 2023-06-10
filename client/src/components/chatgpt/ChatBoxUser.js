
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import { ColorsBlue, ColorsGray } from '../../constants/palet'

function ChatBoxUser({ question }) {
  return (
    <View style={styles.textBox}>
        <View style={styles.userTextBox}>
            <TouchableOpacity>
                <Text 
                style={styles.userText}
                selectable={true}
                >
                {question}
                </Text>
            </TouchableOpacity>
        </View>
        <View>
            <Image
            style={styles.profilePicture}
            source={require("./../../../assets/Yorick.jpg")}
            resizeMode="contain"
            />
        </View>
    </View>
  );
}

export default ChatBoxUser;

const styles = StyleSheet.create({
    userTextBox: {
        backgroundColor: ColorsBlue.blue1100,
        borderRadius: 20,
        padding: 10,
    },
    userText: {
        color: ColorsGray.gray300,
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
    textBox: {
        flexDirection: "row",
        marginVertical: 10,
        maxWidth: 300,
        alignItems: 'center',
        justifyContent: 'flex-end',
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: { height: 2, width: 1 },
        shadowRadius: 3,
        shadowOpacity: 1,
        elevation: 4,
        marginTop: 20
    },
    profilePicture: {
        width: 30,
        height: 30,
        borderRadius: 30,
        marginLeft: 10,
    },
});
