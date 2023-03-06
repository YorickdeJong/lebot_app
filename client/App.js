import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TouchableOpacity, Text, ImageBackground, View, Image } from 'react-native';
import { NavigationContainer, DefaultTheme, useNavigation, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useContext, useEffect, useState } from 'react';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomTabBar, createBottomTabNavigator,} from '@react-navigation/bottom-tabs';
import AuthContextProvider, { AuthContext } from './src/store/auth-context';
import ColorContextProvider, { ColorContext } from './src/store/color-context';
import { LinearGradient } from 'expo-linear-gradient';

import Login from './src/screens/Login/Login';
import Signup from './src/screens/Login/Signup';
import SSH from './src/screens/Authenticated/Robot/SSH';
import RobotCommands from './src/screens/Authenticated/Robot/RobotCommands';
import AssignmentsResults from './src/screens/Authenticated/Assignments/Assignments&Results';
import {  ColorsBlue, ColorsDarkerBlue, ColorsDarkestBlue, ColorsGreen } from './src/constants/palet';
import Icon from './src/components/Icon';
import Assignment from './src/screens/Authenticated/Assignments/Assignment';
import Settings from './src/screens/Authenticated/Settings/Settings';
import UserProfile from './src/screens/Authenticated/UserProfile/UserProfile';
import Results from './src/screens/Authenticated/Settings/Results';
import ChangeUserName from './src/screens/Authenticated/UserProfile/ChangeUsername';
import ChangePassword from './src/screens/Authenticated/UserProfile/ChangePassword';
import ChangeEmail from './src/screens/Authenticated/UserProfile/ChangeEmail';
import UserProfileContextProvider from './src/store/userProfile-context';
import SSHConnectionScreen from './src/screens/Authenticated/Robot/SSH';
import Controller from './src/screens/Authenticated/Robot/Controller';
import SocketContextProvider from './src/store/socket-context';
import { SocketContext } from './src/store/socket-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RobotStore from './src/screens/Authenticated/Robot/RobotStore';
import MoneyContainer from './src/components/robot/store/moneyContainer';
import CarContextProvider from './src/store/car-context';
import AssignmentContextProvider, { AssignmentContext } from './src/store/assignment-context';
import ImagesContextProvider from './src/store/images-context';
import AssignmentDetailsContextProvider from './src/store/assignment-Details-context';

//test
const Stack = createNativeStackNavigator()
const Bottom = createBottomTabNavigator();
const colors = [
      ColorsDarkestBlue.blue1000, ColorsDarkestBlue.blue900,
      ColorsDarkestBlue.blue800, ColorsDarkestBlue.blue700,
      ColorsDarkestBlue.blue600, ColorsDarkestBlue.blue700,
      ColorsDarkestBlue.blue800, ColorsDarkestBlue.blue900,
      ColorsDarkestBlue.blue1000
];
const locations = colors.map(
    (_, index) => index / (colors.length - 1)
);

function Robot () {
  const colorCtx = useContext(ColorContext);
  const navigation = useNavigation();
  const socketCtx = useContext(SocketContext)

  useEffect(() => {
      console.log(`isLoading changed to: ${socketCtx.isLoading}`)
  }, [socketCtx.isLoading])

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: 'white',
        headerBackground: () => (
          <LinearGradient
            colors={colors}
            style={{ flex: 1 }}
            locations={locations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ),
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
          )},
        }}>

        <Stack.Screen 
        component={RobotCommands}
        name = "RobotCommands"
        options= {{
          title: 'Robot Commands',
          
        }}/>

        <Stack.Screen 
        component={SSHConnectionScreen}
        name = "SSHConnectionScreen"
        options = {{
          title: 'Connect To A Robot',
          headerLeft: ({tintColor}) => {
          return (
            <Icon 
            icon = 'arrow-back-circle'
            size = {30}
            color = {tintColor}
            onPress = {() => {
              navigation.replace('RobotCommands')
            }}/>
            )
          }
        }}/>

        <Stack.Screen 
        component={Controller}
        name = "Controller"
        options= {{
          title: 'Controller',
          headerLeft: ({tintColor}) => {
          return (
            <Icon 
            icon = 'arrow-back-circle'
            size = {30}
            color = {tintColor}
            onPress = {() => {
              navigation.replace('RobotCommands')
            }}/>
            )
          }
        }}/>

        <Stack.Screen 
        component={RobotStore}
        name = "RobotStore"
        options= {{
          headerTitle: () => <MoneyContainer />,
          headerLeft: ({tintColor}) => {
          return (
            <Icon 
            icon = 'arrow-back-circle'
            size = {30}
            color = {tintColor}
            onPress = {() => {
              navigation.replace('RobotCommands')
            }}/>
            )
          }
        }}/>
    </Stack.Navigator>
  )
}

function Assignments() {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: 'white',
        headerBackground: () => (
          <LinearGradient
            colors={colors}
            style={{ flex: 1 }}
            locations={locations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ),
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
          )},
        }}>

      <Stack.Screen 
      component={AssignmentsResults}
      name = "AssignmentsResults"
      options={{
          title: 'Assignments',
          tabBarIcon: ({color}) => {
            return (
              <Icon 
              size = {24}
              icon = "list"
              color = {color}
              addStyle = {{marginRight: 0}}
              onPress={() => navigation.replace('AssignmentsResults')}/>
            )
          },
      }}
      />
      
      <Stack.Screen 
      component={Assignment}
      name = "Assignment"
      options={{
          title: 'Assignment',
          headerLeft: ({tintColor}) => {
          return (
            <Icon 
            icon = 'arrow-back-circle'
            size = {30}
            color = {tintColor}
            onPress = {() => navigation.replace('AssignmentsResults')}/>
            )
          }
        }}
      />
    </Stack.Navigator>
  )
}


function BottomMenu() {
  const colorCtx = useContext(ColorContext)
  const navigation = useNavigation()


  return (
      <Bottom.Navigator
      screenOptions={{
        tabBarBackground: () => {
          return (
            <LinearGradient
                colors={colors} 
                style={{flex:1}}
                locations={locations}
                start={{ 
                    x: 0, 
                    y: 0 
                }}
                end={{ 
                    x: 1, 
                    y: 1 
                }}>
            </LinearGradient>

          )
        },
        headerTintColor: 'white',
        tabBarActiveTintColor: colorCtx.isBlue ? ColorsGreen.green50 : ColorsBlue.blue50, 
        tabBarInactiveTintColor: colorCtx.isBlue ? ColorsGreen.green200 : ColorsBlue.blue100, 
        

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
      component={Robot}
      name = "Robot" 
      options={{
          title: 'Robot',
          tabBarIcon: ({color}) => {
            return (
              <Icon 
              size = {24}
              icon = "car-sport"
              color = {color}
              addStyle = {{marginRight: 0}}
              onPress={() => navigation.replace('RobotCommands')}
              />
            )
          },
          headerShown: false
      }}
      />
      
      <Bottom.Screen 
      component={Assignments}
      name = "Assignments"
      options={{
          title: 'Assignments',
          tabBarIcon: ({color}) => {
            return (
              <Icon 
              size = {24}
              icon = "list"
              color = {color}
              addStyle = {{marginRight: 0}}
              onPress={() => navigation.replace('AssignmentsResults')}/>
            )
          },
          headerShown: false
      }}
      />
      
    </Bottom.Navigator>
  );
}


function Authorized() {
  const colorCtx = useContext(ColorContext);
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colorCtx.isBlue ? ColorsGreen.green1200: ColorsBlue.blue1200 },
        headerTintColor: 'white',
      }}
    >

      <Stack.Screen 
      component={BottomMenu}
      name = "BottomMenu"
      options = {{
        headerShown: false
      }}
      />
      
      <Stack.Screen 
        name = "Settings"
        component={Settings}
        options={{
        title: 'Settings',
        presentation: 'modal',
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

function Authenticate() {
  const colorCtx = useContext(ColorContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: 'white',
        headerBackground: () => (
          <LinearGradient
            colors={colors}
            style={{ flex: 1 }}
            locations={locations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ),
        headerRight: () => {
         return (
          <Icon 
          icon = "flashlight" 
          size = {24}
          color = {colorCtx.iconColor} 
          onPress = {colorCtx.setColor}
          />
        )}
      }}
      >
      <Stack.Screen 
      name = "Login" 
      component={Login} 
      />
      <Stack.Screen 
      name = "Signup"       
      component={Signup}
      />
    </Stack.Navigator>
  )
}

function Navigation() {
 
  const authCtx = useContext(AuthContext);

    const colors= [
        ColorsBlue.blue900, ColorsBlue.blue700, 
        ColorsBlue.blue500,
        ColorsBlue.blue400, ColorsBlue.blue100, 
        ColorsBlue.blue50
    ]
  const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background:  ColorsBlue.blue1300
    },
  };

  return (
      <NavigationContainer theme = {MyTheme}>
          {!authCtx.isAuthenticated && <Authenticate />}
          {authCtx.isAuthenticated && <Authorized />}
      </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);
  const colorCtx = useContext(ColorContext)

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
          authCtx.authenticate(storedToken);
          const storedAssignments = await AsyncStorage.getItem('assignments')
      }
        
        setIsTryingLogin(false);
    }
    
    async function fetchColor() {
      let storedColor = await AsyncStorage.getItem('color');
      let storedIconColor = await AsyncStorage.getItem('iconColor');      
      
      colorCtx.setColor(JSON.parse(storedColor), storedIconColor);
    } 
    
    fetchToken();
    fetchColor();
  }, []);



  if (isTryingLogin) {
    return <AppLoading />;
  }
  return <Navigation />;
}



export default function App() {
  return (
    <>
    <StatusBar style="light" />
    <AssignmentDetailsContextProvider>
      <ImagesContextProvider>
        <AssignmentContextProvider>
            <SocketContextProvider>
              <UserProfileContextProvider>
                <CarContextProvider>
                <ColorContextProvider>
                  <AuthContextProvider>
                    <Root />
                  </AuthContextProvider>
                </ColorContextProvider>
                </CarContextProvider>
              </UserProfileContextProvider>
            </SocketContextProvider>
        </AssignmentContextProvider>
      </ImagesContextProvider>
    </AssignmentDetailsContextProvider>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    resizeMode: 'stretch',
    // opacity: 0.6
  },
});
