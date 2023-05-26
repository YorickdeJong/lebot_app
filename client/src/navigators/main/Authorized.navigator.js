import {  useNavigation, StackActions, useFocusEffect  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from '../../components/Icon';
import Settings from '../../screens/Authenticated/Settings/Settings';
import UserProfile from '../../screens/Authenticated/UserProfile/UserProfile';
import Results from '../../screens/Authenticated/Settings/Results';
import ChangeUserName from '../../screens/Authenticated/UserProfile/ChangeUsername';
import ChangePassword from '../../screens/Authenticated/UserProfile/ChangePassword';
import ChangeEmail from '../../screens/Authenticated/UserProfile/ChangeEmail';
import BottomMenu from './BottomMenu.navigator';
import CustomHeader from './CustomNavigator.main';
import StudentClassroomNavigator from './StudentClassRoomNavigator';
import ModalTime from '../../screens/Authenticated/ModalTime';
import { useFetchTimeLessonsDataSocket } from '../../hooks/time-lessons.hook';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserProfileContext } from '../../store/userProfile-context';
import {View, Platform, StyleSheet, Alert} from 'react-native';
import { TimeContext } from '../../store/time-context';
import ModalInformation from '../../screens/Authenticated/ModalInformation';
import AppExplanation from '../../screens/Authenticated/BeginningScreen/AppExplanation';
import { InformationContext } from '../../store/information-context';

//test
const Stack = createNativeStackNavigator()

//SCREEN THAT IS DISPLAYED WHEN A USER IS AUTHORIZED/LOGGED IN
function Authorized() {
    const navigation = useNavigation();
    const userprofileCtx = useContext(UserProfileContext);
    const {school_id, class_id} = userprofileCtx.userprofile;
    const timeCtx = useContext(TimeContext);
    const activeLesson = timeCtx.filterActiveTimers(-1);
    const [firstUpdate, setFirstUpdate] = useState(true)
    const [dataTime, initializeTime] = useFetchTimeLessonsDataSocket(true, school_id)
    const informationCtx = useContext(InformationContext);

    function lessonSelection(lesson_number) {
      switch (lesson_number) {
          case 1:
              return {subject: 'Coderen Theorie', planeet: null}
          case 2: 
              return {subject: 'Beweging', planeet: 'Ga naar planeet 2 van de opdrachten over Fase 1'}
          case 3:
              return {subject: 'Reflecteer', planeet: 'Ga naar planeet 14'}
          case 4:
              return {subject: 'Schakelingen', planeet: 'Ga naar planeet 2 van de opdrachten over Fase 2'}
          case 5:
              return {subject: 'Reflecteer', planeet: 'Ga naar planeet 11 van de opdrachten over Fase 2'}
          case 6: 
              return {subject: 'Energie en Vermogen', planeet: 'Ga naar planeet 2 van de opdrachten over Fase 3'}
          case 7:
              return {subject: 'Reflecteer', planeet: 'Ga naar planeet 11 van de opdrachten over Fase 3'}
          default:
            return {subject: 'Unknown', planeet: null}; // default case
      }       
    }

    useEffect(() => {
      if (firstUpdate){
        setFirstUpdate(false)
        return
      }
      if (activeLesson) {
        const {subject, planeet} = lessonSelection(activeLesson)
        Alert.alert('Discussie Tijd!', `Discussieer met elkaar over het onderwerp ${subject} ${planeet}`)
        return
      }
      if (!activeLesson){
        Alert.alert('Discussie tijd afgelopen', 'Ga verder met de opdrachten')      

      }

    }, [activeLesson])
    

    //Open socket to see if an assignment is currently running
    useFocusEffect(
        useCallback(() => {
            
            console.log('ClassesStudent component focused');
            initializeTime();
            return () => {
                console.log('ClassesStudent component blurred');
            };
        }, [initializeTime]) // Add initialize as a dependency
    );

    return (
      <>
        <ModalTime 
        />
        <ModalInformation />  
        
        <Stack.Navigator
          initialRouteName = {informationCtx.showBeginningScreen ? "AppExplanation" : "BottomMenu"}
          screenOptions={{
            headerTintColor: 'white',
            header: ({ route }) => {
                const showChatPlus = route.name === 'Chats';
                const showChatBubbles = route.name === 'Chat';
                return (
                  <CustomHeader
                    height = {Platform.OS === 'ios' ? 45 : 60}
                    goBack
                  />

                );
            },
            headerStyle: {
              backgroundColor: 'transparent',
              elevation: 0,
            },
            }}
            >
    

          <Stack.Screen
            component={AppExplanation}
              name = "AppExplanation"
              options = {{
                headerShown: false,
              }}
          />

          <Stack.Screen 
          component={BottomMenu}
          name = "BottomMenu"
          options = {{
            headerShown: false,
          }}
          />


        <Stack.Screen 
          name = 'groups'
          component = {StudentClassroomNavigator}
          options = {{
            headerShown: false,
          }}
            />
          
          
          <Stack.Screen 
            name = "Settings"
            component={Settings}
            options={{
            title: 'Settings',
            presentation: 'modal',
            backgroundColor: 'transparent',
            headerLeft: ({tintColor}) => {
              return (
                <Icon 
                icon = 'navigate-before'
                size = {30}
                color = {tintColor}
                onPress = {() => {
                  navigation.dispatch(StackActions.pop(2))
                }}
                MaterialIconsDir={true}
                />
              )
            }
          }}
          />
    
          <Stack.Screen 
          name = 'results'
          component = {Results}
          options ={{
            presentation: 'modal',
            title: 'Your Results',
            headerLeft: ({tintColor}) => {
              return (
                <Icon 
                icon = 'navigate-before'
                size = {30}
                color = {tintColor}
                onPress = {() => {
                  navigation.navigate('Settings')
                }}
                MaterialIconsDir={true}
                />
                )
              }
            }}/>
    

            <Stack.Screen 
            name = "userProfile"
            component = {UserProfile}
            options = {{
              title: "User Profile",
              presentation: 'modal',
              headerLeft: ({tintColor}) => {
                return (
                  <Icon 
                  icon = 'navigate-before'
                  size = {30}
                  color = {tintColor}
                  onPress = {() => {
                    navigation.navigate('Settings')
                  }}
                  MaterialIconsDir={true}
                  />
                )
              }
            }}
            />
    
            <Stack.Screen
            name = "changeUsername"
            component = {ChangeUserName}
            options = {{
              title: "Change Username",
              presentation: 'modal',
              headerLeft: ({tintColor}) => {
                return (
                  <Icon 
                  icon = 'navigate-before'
                  size = {30}
                  color = {tintColor}
                  onPress = {() => {
                    navigation.navigate('userProfile')
                  }}
                  MaterialIconsDir={true}
                  />
                )
              }
            }}
            />
    
            <Stack.Screen
            name = "changeEmail"
            component = {ChangeEmail}
            options = {{
              title: "Change Email",
              headerLeft: ({tintColor}) => {
                return (
                  <Icon 
                  icon = 'navigate-before'
                  size = {30}
                  color = {tintColor}
                  onPress = {() => {
                    navigation.navigate('userProfile')
                  }}
                  MaterialIconsDir={true}
                  />
                )
              }
            }}
            />
    
            <Stack.Screen
            name = "changePassword"
            component = {ChangePassword}
            options = {{
              title: "Change Password",
              headerLeft: ({tintColor}) => {
                return (
                  <Icon 
                  icon = 'navigate-before'
                  size = {30}
                  color = {tintColor}
                  onPress = {() => {
                    navigation.navigate('userProfile')
                  }}
                  MaterialIconsDir={true}
                  />
                )
              }
            }}
            />
        </Stack.Navigator>
      </>
    )
  }

export default Authorized;




const styles = StyleSheet.create({
  timer: {
      position: 'absolute',
      bottom: "0.7%",
      right: "2%",
      zIndex: 2,
      shadowColor: `rgba(11, 11, 11, 1)`,
      shadowOffset: {height: 2, width: 0},
      shadowOpacity: 1,
      shadowRadius: 3,
      elevation: 5,
  }, 
})