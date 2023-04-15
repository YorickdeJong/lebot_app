import React, {useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorsBlue } from '../../constants/palet';
import Icon from '../../components/Icon';
import { AuthContext } from '../../store/auth-context';
import { useNavigation } from '@react-navigation/native';


const CustomHeader = ({ title , addChatHandler, chatBubbles, chatPlus, MoneyContainer}) => {
const authCtx = useContext(AuthContext);
const navigation = useNavigation()

  return (
    <View
      style={{
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 2,
      }}
    >
      <LinearGradient
        colors={[ColorsBlue.blue1400, ColorsBlue.blue1100]}
        style={styles.header}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
            {chatBubbles && <View style={{ marginLeft: 10, marginTop: 35
                }}>
                <Icon
                    icon="chatbubbles"
                    size={24}
                    color={ColorsBlue.blue100}
                    onPress={() => navigation.navigate('Chats')}
                />
            </View> }
            {chatPlus && <View style={{ marginLeft: 10, marginTop: 35
                }}>
                <Icon
                    icon="chat-plus"
                    size={24}
                    color={ColorsBlue.blue100}
                    onPress={addChatHandler}
                    differentDir
                />
            </View> }
            
            {MoneyContainer && <MoneyContainer />}


            <View style={{ right: 25, top: 48, position: 'absolute'
                }}>
                <Icon
                    icon="settings-sharp"
                    size={24}
                    color={ColorsBlue.blue100}
                    onPress={() => navigation.navigate('Settings')}
                />
            </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
});

export default CustomHeader;
