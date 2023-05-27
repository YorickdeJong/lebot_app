import React, {useContext, useLayoutEffect} from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorsBlue } from '../../constants/palet';
import Icon from '../../components/Icon';
import { AuthContext } from '../../store/auth-context';
import { useNavigation } from '@react-navigation/native';
import { GroupTeacherContext } from '../../store/group-teacher-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');
const CustomHeader = ({ title, height, goBack, goBackTwice, onCustomHeaderLayout, chatBubbles, chatPlus, MoneyContainer, addHandler, navigtor, robotConnect}) => {
  
    const navigation = useNavigation()
    const groupTeacherCtx = useContext(GroupTeacherContext)
    
    return (
      <>
            <LinearGradient
              colors={[ColorsBlue.blue1300, ColorsBlue.blue1300]}
              style={[styles.header, { height: height ? verticalScale(height) : (height > 750 ? verticalScale(65) : verticalScale(65)) }]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
                  {title && (
                    <Text style={styles.title}>{title}</Text>
                  )}
                  {chatBubbles && <View style={{ marginLeft: 10, marginTop: verticalScale(30)
                      }}>
                      <Icon
                          icon="chatbubbles"
                          size={24}
                          color={ColorsBlue.blue200}
                          onPress={() => navigation.navigate('Chats')}
                      />
                  </View> }
                  {chatPlus && <View style={{ marginLeft: 10, marginTop:  verticalScale(30)
                      }}>
                      <Icon
                          icon="chat-plus"
                          size={24}
                          color={ColorsBlue.blue200}
                          onPress={onCustomHeaderLayout}
                          differentDir
                      />
                  </View> }
                  {goBack &&
                    <View style={{ marginLeft: 10, marginTop: height ? (Platform.OS === 'ios' ?  verticalScale(3) : verticalScale(20))   : verticalScale(30)
                      }}>
                      <Icon
                          icon="navigate-before"
                          size={32}
                          color={ColorsBlue.blue200}
                          onPress={navigtor ? navigtor :  () => navigation.goBack() }
                          MaterialIconsDir={true}
                      />
                  </View> }
                  {MoneyContainer && <MoneyContainer />}
                  
                  {robotConnect && 
                    <View style={{ left: 20, top: Platform.OS === 'ios' ? verticalScale(37) : verticalScale(36), position: 'absolute'
                      }}>
                      <Icon
                          icon= {"cast-connected"}
                          size={24}
                          color={ColorsBlue.blue200}
                          onPress={() => robotConnect()} //and set up ssh connection to robot
                          differentDir
                      />
                    </View>
                  }

                  <View style={{ right: 25, top: height ? (Platform.OS === 'ios' ?  height / 3 : verticalScale(30)) : verticalScale(37), position: 'absolute'
                      }}>
                      <Icon
                          icon= {addHandler ? addHandler : "settings-sharp"}
                          size={addHandler ? 28 : 24}
                          color={ColorsBlue.blue200}
                          onPress={addHandler? groupTeacherCtx.addHandlerFunction.bind(this, 'create') : () => navigation.navigate('Settings')}
                          MaterialIconsDir = {addHandler ? true : false}
                      />
                  </View>
            </LinearGradient>
      </>
    );
};

const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: ColorsBlue.blue100,
      position: 'absolute',
      left: '39%',
      top: '60%'
    },
});

export default CustomHeader;
