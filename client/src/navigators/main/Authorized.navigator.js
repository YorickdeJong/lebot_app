import {  useNavigation, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from '../../components/Icon';
import Settings from '../../screens/Authenticated/Settings/Settings';
import UserProfile from '../../screens/Authenticated/UserProfile/UserProfile';
import Results from '../../screens/Authenticated/Settings/Results';
import ChangeUserName from '../../screens/Authenticated/UserProfile/ChangeUsername';
import ChangePassword from '../../screens/Authenticated/UserProfile/ChangePassword';
import ChangeEmail from '../../screens/Authenticated/UserProfile/ChangeEmail';
import { ColorsBlue } from '../../constants/palet';
import BottomMenu from './BottomMenu.navigator';

//test
const Stack = createNativeStackNavigator()

//SCREEN THAT IS DISPLAYED WHEN A USER IS AUTHORIZED/LOGGED IN
function Authorized() {
    const navigation = useNavigation();
  
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: ColorsBlue.blue1300 },
          headerTintColor: 'white',
          backgroundColor: 'transparent',
        }}
      >
  
        <Stack.Screen 
        component={BottomMenu}
        name = "BottomMenu"
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
              icon = 'arrow-back-circle'
              size = {30}
              color = {tintColor}
              onPress = {() => {
                navigation.dispatch(StackActions.pop(2))
              }}/>
            )
          }
        }}
        />
  
        <Stack.Screen 
        name = 'results'
        component = {Results}
        options ={{
          title: 'Your Results',
          headerLeft: ({tintColor}) => {
            return (
              <Icon 
              icon = 'arrow-back-circle'
              size = {30}
              color = {tintColor}
              onPress = {() => {
                navigation.navigate('Settings')
              }}/>
              )
            }
          }}/>
  
          <Stack.Screen 
          name = "userProfile"
          component = {UserProfile}
          options = {{
            title: "User Profile",
            headerLeft: ({tintColor}) => {
              return (
                <Icon 
                icon = 'arrow-back-circle'
                size = {30}
                color = {tintColor}
                onPress = {() => {
                  
                  navigation.navigate('Settings')
                }}/>
              )
            }
          }}
          />
  
          <Stack.Screen
          name = "changeUsername"
          component = {ChangeUserName}
          options = {{
            title: "Change Username",
            headerLeft: ({tintColor}) => {
              return (
                <Icon 
                icon = 'arrow-back-circle'
                size = {30}
                color = {tintColor}
                onPress = {() => {
                  navigation.navigate('userProfile')
                }}/>
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
                icon = 'arrow-back-circle'
                size = {30}
                color = {tintColor}
                onPress = {() => {
                  navigation.navigate('userProfile')
                }}/>
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
                icon = 'arrow-back-circle'
                size = {30}
                color = {tintColor}
                onPress = {() => {
                  navigation.navigate('userProfile')
                }}/>
              )
            }
          }}
          />
      </Stack.Navigator>
    )
  }

  export default Authorized;