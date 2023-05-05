
import { StyleSheet, Animated, Platform, View, Text } from 'react-native';
import {  useNavigation, } from '@react-navigation/native';
import { useContext } from 'react';
import { createBottomTabNavigator,} from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '../../components/Icon';
import { BlinkContext } from '../../store/animation-context';
import { ColorsBlue  } from '../../constants/palet';
import Assignments from './Assignments.navigator';
import Robot from './Robot.navigator';
import ChatScreen from './ChatScreen.navigator';
import {scale, verticalScale} from 'react-native-size-matters';
//test
const Bottom = createBottomTabNavigator();

// BOTTOM MENU NAVIGATOR WITH ASSIGNMENTS, ROBOT AND CHATGPT
function BottomMenu() {
    const navigation = useNavigation()
    const blinkCtx = useContext(BlinkContext);
    const goldColor = 'gold';
    
    console.log(`blinkContext: ${blinkCtx.shouldBlink}`)
  
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
              <LinearGradient
                  colors={[ColorsBlue.blue1400, ColorsBlue.blue1100, ColorsBlue.blue1400]} 
                  style={{flex:1}}
                  start={{ 
                      x: 0, 
                      y: 0.5 
                  }}
                  end={{ 
                      x: 1, 
                      y: 0.5 
                  }}>
              </LinearGradient>
  
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

              
              <View style={{ opacity: blinkCtx.shouldBlink ? blinkCtx.blinkAnimation : 1, 
              justifyContent: 'center', 
              alignItems: 'center',
              paddingTop: verticalScale(16) }}
              >
                <Icon 
                size = {24}
                icon = "list"
                color = {color}
                addStyle = {{marginRight: 0, marginBottom: Platform.OS === 'android' ? 3: 0}}
                onPress={() => navigation.navigate('AssignmentsResults')}/>

                <Text
                style={{
                  color: blinkCtx.shouldBlink ? goldColor : color,
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
  
        <Bottom.Screen 
        component={Robot}
        name = "Rover" 
        options={{
            title: '',
            tabBarIcon: ({color}) => {
              return (

              <View style={{ opacity: blinkCtx.shouldBlink ? blinkCtx.blinkAnimation : 1, 
              justifyContent: 'center', 
              alignItems: 'center',
              paddingTop: verticalScale(16) }}
              >
                <Icon 
                size = {24}
                icon = "space-station"
                color = {color}
                addStyle = {{marginRight: 0}}
                onPress={() => navigation.navigate('RobotStore')}
                differentDir={true}
                />
                <Text
                style={{
                  color: blinkCtx.shouldBlink ? goldColor : color,
                  fontSize: 10,
                  paddingTop: Platform.OS === 'ios' ?  8  : 5,
                  // paddingBottom: 2,
                  textAlign: 'center',
                }}
              > 
              Rover
              </Text>
              </View>

              )
            },
            headerShown: false
        }}
        />
  
        <Bottom.Screen 
        component={ChatScreen}
        name = "ChatGPT"
        options={{
            title: ``,
            tabBarActiveTintColor: blinkCtx.shouldBlink && goldColor,
            tabBarInactiveTintColor:  blinkCtx.shouldBlink && goldColor, 
            tabBarIcon: ({color}) => {
              return (
              <Animated.View style={{ opacity: blinkCtx.shouldBlink ? blinkCtx.blinkAnimation : 1, 
              justifyContent: 'center', 
              alignItems: 'center',
              paddingTop: verticalScale(16) }}
              >
                <Icon
                  size={24}
                  icon="robot-happy-outline"
                  color={blinkCtx.shouldBlink ? goldColor: color}
                  addStyle={{ marginRight: 0 }}
                  onPress={() => navigation.navigate('Chats')}
                  differentDir
                />
                <Animated.Text
                style={{
                  color: blinkCtx.shouldBlink ? goldColor : color,
                  fontSize: 10,
                  paddingTop: Platform.OS === 'ios' ?  8  : 5,
                  // paddingBottom: 2,
                  textAlign: 'center',
                }}
              > 
              Chatgpt
              </Animated.Text>
              </Animated.View>
              )
            },
            headerShown: false
        }}
        />
        
      </Bottom.Navigator>
    );
  }

  export default BottomMenu;
  
  const bottomNavStyles = StyleSheet.create({
  });
  