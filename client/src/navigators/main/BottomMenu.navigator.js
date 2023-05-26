
import { StyleSheet, Animated, Platform, View, Text, Alert, TouchableOpacity } from 'react-native';
import {  useNavigation, } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator,} from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../../components/Icon';
import { BlinkContext } from '../../store/animation-context';
import { ColorsBlue, ColorsGreen  } from '../../constants/palet';
import Assignments from './Assignments.navigator';
import Robot from './Robot.navigator';
import ChatScreen from './ChatScreen.navigator';
import {scale, verticalScale} from 'react-native-size-matters';
import { ShowIconsContext } from '../../store/show-icons-context';
import { TimeContext } from '../../store/time-context';
import { UserProfileContext } from '../../store/userProfile-context';
import { InformationContext } from '../../store/information-context';
//test
const Bottom = createBottomTabNavigator();

// BOTTOM MENU NAVIGATOR WITH ASSIGNMENTS, ROBOT AND CHATGPT
function BottomMenu() {
    const navigation = useNavigation()
    const showIconsCtx = useContext(ShowIconsContext);
    const blinkCtx = useContext(BlinkContext);
    const [colorChange, setColorChange] = useState('gold');
    const timeCtx = useContext(TimeContext);
    const informationCtx = useContext(InformationContext);
    const userprofileCtx = useContext(UserProfileContext);
    const {class_id} = userprofileCtx.userprofile;
    const activeTime = timeCtx.filterSpecificLesson(class_id)



    const DummyComponent = () => null;
    // New color interpolation code
    const opacityInterpolation = blinkCtx.colorAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 1],
    });


    return (
        <Bottom.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: 'transparent', // Set the background color to transparent
            borderTopWidth: 0, // Remove the border on top, if any
            elevation: 0, // Remove the elevation (shadow) for Android
            shadowOpacity: 0, // Remove the shadow for iOS
            height: Platform.OS === 'ios'? 78 : 60
          },
          tabBarBackground: () => {
            return (
              <View
                  style={{flex:1, backgroundColor: ColorsBlue.blue1300}} />
              
            )
          },
          headerTintColor: 'white',
          tabBarActiveTintColor: ColorsBlue.blue400, 
          tabBarInactiveTintColor:  ColorsBlue.blue900, 
          
  
          headerRight: ({tintColor}) => {
              return (
                <Icon 
                size = {24}
                icon = "settings-sharp"
                color = {tintColor}
                addStyle = {{marginRight: 15}}
                onPress={() => 
                  navigation.navigate('Settings')}
                />
              )
          },
          }}
        >

         <Bottom.Screen 
        component={Assignments}
        name = "Assignments"
        options={{
            title: '',
           
            tabBarIcon: ({color}) => {
              return (

              
              <View style={{ 
              justifyContent: 'center', 
              alignItems: 'center',
              paddingTop: verticalScale(16) }}
              >
                <Icon 
                size = {24}
                icon = "list"
                color = {color}
                addStyle = {{marginRight: 0, marginBottom: Platform.OS === 'android' ? 3: 0}}
                onPress={() => navigation.navigate('Assignments', {screen: 'AssignmentsResults'})}/>

                <Text
                style={{
                  color: color,
                  fontSize: 10,
                  paddingTop: Platform.OS === 'ios' ?  8  : 0,
                  // paddingBottom: 2,
                  textAlign: 'center',
                }}
              > 
              Assignments
              </Text>
              </View>
              )
            },
            headerShown: false
        }}
        />
        
  
        {showIconsCtx.showIcons.robotStore &&
         <Bottom.Screen
                    component={Robot}
                    name="Rover"
                    options={{
                        title: ``,
                        tabBarActiveTintColor: ColorsBlue.blue400,
                        tabBarInactiveTintColor: ColorsBlue.blue900,
                        tabBarIcon: ({ color }) => {
                            return (
                                <Animated.View
                                    style={{
                                        opacity: blinkCtx.shouldBlinkRobot ? opacityInterpolation : 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingTop: verticalScale(16),
                                    }}
                                >
                                    <Icon
                                        size={24}
                                        icon="space-station"
                                        color={blinkCtx.shouldBlinkRobot ? colorChange : color}
                                        addStyle={{ marginRight: 0 }}
                                        onPress={() => navigation.navigate('Rover', {screen: 'RobotStore'})}
                                        differentDir
                                    />
                                    <Animated.Text
                                        style={{
                                            color: blinkCtx.shouldBlinkRobot ? colorChange : color,
                                            fontSize: 10,
                                            paddingTop: Platform.OS === 'ios' ? 8 : 5,
                                            textAlign: 'center',
                                        }}
                                    >
                                        Rover
                                    </Animated.Text>
                                </Animated.View>
                            );
                        },
                        headerShown: false,
                    }}
                />
        }
  
        {/* {showIconsCtx.showIcons.chatgpt &&   */}
            <Bottom.Screen
              component={ChatScreen}
              name="ChatGPT"
              options={{
                  title: ``,
                  tabBarActiveTintColor: ColorsBlue.blue200,
                  tabBarInactiveTintColor: ColorsBlue.blue700,
                  tabBarIcon: ({ color }) => {
                      return (
                          <Animated.View
                              style={{
                                  opacity: blinkCtx.shouldBlink ? opacityInterpolation : 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  paddingTop: verticalScale(16),
                              }}
                          >
                              <Icon
                                  size={24}
                                  icon="robot-happy-outline"
                                  color={blinkCtx.shouldBlink ? colorChange : color}
                                  addStyle={{ marginRight: 0 }}
                                  onPress={() => navigation.navigate('ChatGPT', {screen: 'Chats'})}
                                  differentDir
                              />
                              <Text
                                  style={{
                                      color: blinkCtx.shouldBlink ? colorChange : color,
                                      fontSize: 10,
                                      paddingTop: Platform.OS === 'ios' ? 8 : 5,
                                      textAlign: 'center',
                                  }}
                              >
                                  Chatgpt
                              </Text>
                          </Animated.View>
                      );
                  },
                  headerShown: false,
              }}
          />
        {/* } */}

        <Bottom.Screen
            name="DummyOne" // Add a name for the screen
            component={DummyComponent} // Add a dummy component
            listeners={{
                tabPress: e => {
                // Prevent default action
                e.preventDefault();
                }
            }}
            options={{
                title: '',
                tabBarActiveTintColor: ColorsBlue.blue200,
                tabBarInactiveTintColor: ColorsBlue.blue700,
                tabBarIcon: ({ color }) => {
                return (
                    <TouchableOpacity 
                    onPress={() => informationCtx.setShowInformationModal(prevState => !prevState)}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: verticalScale(18),
                        
                    }}
                    >
                    <Icon
                        
                        size={24}
                        color={color}
                        icon="information-outline"
                        differentDir={true}
                        addStyle={{opacity: 1, height: 27}}
                        onPress={() => informationCtx.setShowInformationModal(prevState => !prevState)}
                    />
                    <Text
                        style={{
                        color: color,
                        fontSize: 10,
                        paddingTop: Platform.OS === 'ios' ? 0 : 1,
                        textAlign: 'center',
                        opacity: 1,
                        }}
                    >
                        Info
                    </Text>
                    </TouchableOpacity>
                );
                },
            }}
            />
        
        {activeTime && 
            <Bottom.Screen
            name="DummyTwo" // Add a name for the screen
            component={DummyComponent} // Add a dummy component
            listeners={{
                tabPress: e => {
                // Prevent default action
                e.preventDefault();
                }
            }}
            options={{
                title: '',
                tabBarIcon: ({ color }) => {
                return (
                    <TouchableOpacity 
                    onPress={() => timeCtx.toggleTimeModal()}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: verticalScale(12),
                    }}
                    >
                    <Icon
                        size={24}
                        color={ColorsBlue.blue600}
                        icon="time-sharp"
                        addStyle={{opacity: 1}}
                    />
                    <Text
                        style={{
                        color: ColorsBlue.blue600,
                        fontSize: 10,
                        paddingTop: Platform.OS === 'ios' ? 4 : 1,
                        textAlign: 'center',
                        opacity: 1,
                        }}
                    >
                        Timer
                    </Text>
                    </TouchableOpacity>
                );
                },
            }}
            />
        }



      </Bottom.Navigator>
    );
  }

export default BottomMenu;
  




const styles = StyleSheet.create({
});
  