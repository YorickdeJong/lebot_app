import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TouchableOpacity, Text, ImageBackground, View, Image, Animated } from 'react-native';
import { NavigationContainer, DefaultTheme, useNavigation, StackActions, useRoute } from '@react-navigation/native';
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
import ChatGPT from './src/screens/chatgpt/Chatgpt';
import ChatContextProvider, { ChatContext } from './src/store/chat-context';
import Chats from './src/screens/chatgpt/ChatsList';
import ChartContextProvider from './src/store/chart-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import BuildScreen from './src/screens/Authenticated/Assignments/BuildScreen';
import CodeExampleScreen from './src/screens/Authenticated/Assignments/CodeExampleScreen';
import CodeAnswerScreen from './src/screens/Authenticated/Assignments/CodeAnswerScreen';
import { ASSIGNMENT_EXPLANATION } from './src/data/InitialAssignmentExplanation';
import BlinkContextProvider, { BlinkContext } from './src/store/animation-context';




//test
const Stack = createNativeStackNavigator()
const Bottom = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

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


function ChatScreen() {
  const navigation = useNavigation();
  const chatCtx = useContext(ChatContext);
  const thread_id = chatCtx.thread_ids.length

  const {description, title} = chatCtx.getDescriptionsForThreadId(chatCtx.currentThreadId)

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: 'white',
        headerBackground: () => (
        <LinearGradient
            colors={[ColorsBlue.blue1300, ColorsBlue.blue1100, ColorsBlue.blue1300]} 
            style={{flex:1}}
            start={{ 
                x: 0, 
                y: 0.5 
            }}
            end={{ 
                x: 1, 
                y: 0.5 
            }}/>
        ),
        headerRight: ({tintColor}) => {
            return (
              <Icon 
              size = {24}
              icon = "settings-sharp"
              color = {tintColor}
              addStyle = {{marginRight: 15}}
              onPress={() => 
                navigation.navigate('Settings')}/>
          )},

        headerLeft: ({tintColor}) => {
          return (
            <Icon 
            size = {24}
              icon = "chatbubbles"
              color = {tintColor}
              addStyle = {{marginLeft: 15}}
              onPress={() => 
                navigation.navigate('Chats')}/> // add component Drawer here
          )},
        }}>

          <Stack.Screen 
          component={Chats}
          name = "Chats"
          options = {{
            title: 'Chat Threads',
            showListIcon: false,
          }}
          />

        <Stack.Screen 
        component={ChatGPT}
        name = "Chat"
        options= {{
          title: title  
        }}
        initialParams={{ thread_id }}
        />

    </Stack.Navigator>
  )
}


function Robot () {
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
              colors={[ColorsBlue.blue1300, ColorsBlue.blue1100, ColorsBlue.blue1300]} 
              style={{flex:1}}
              start={{ 
                  x: 0, 
                  y: 0.5 
              }}
              end={{ 
                  x: 1, 
                  y: 0.5 
              }}
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


function AssignmentTab({title}){
    const [index, setIndex] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);

    const [routes] = useState([
      { key: 'first', title: 'Bouwen' },
      { key: 'second', title: 'Codeer Theorie' },
      { key: 'third', title: 'Codeer Vragen' },
      { key: 'fourth', title: 'Opdracht' },
    ]);
  

    const renderTabBar = (props) => (
      <LinearGradient
        colors={[ColorsBlue.blue1300, ColorsBlue.blue1100, ColorsBlue.blue1300]}
        style={{paddingTop: 40}}
        start={{
          x: 0,
          y: 0.5,
        }}
        end={{
          x: 1,
          y: 0.5,
        }}
      >
      <TabBar
        {...props}
        style={{ backgroundColor: 'transparent' }}
        renderLabel={({ route, focused, color }) => (
          <Text style={{ color, fontWeight: focused ? 'bold' : 'normal', fontSize: 12,  paddingLeft: 5, paddingRight: 5 }}>
            {/* Customize the text here */}
            {route.title.toUpperCase()}
          </Text>
        )}
      />
      </LinearGradient>
    );

    const renderScene = ({route}) => {//SceneMap({
        switch(route.key){
          case 'first' :
            return <BuildScreen 
            title = {route.title} 
            tabIndex={0} 
            currentIndex={index}
            />;
          case 'second' :
            return <CodeExampleScreen 
            title = {route.title}
            tabIndex={1} 
            currentIndex={index}
            />;
          case 'third' :
            return <CodeAnswerScreen 
            title = {route.title}
            tabIndex={2} 
            currentIndex={index}
            />;
          case 'fourth' :
            return <Assignment 
            title = {title}
            tabIndex={3}
            currentIndex={index}
            />;
        }
    };

    return (
      <View style={{ flex: 1}}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: '100%', height: '100%' }}
        />
      </View>
    );
};

function Assignments() {
  const navigation = useNavigation();

  const defaultHeaderBackground = () => (
    <LinearGradient
      colors={[ColorsBlue.blue1300, ColorsBlue.blue1100, ColorsBlue.blue1300]}
      style={{ flex: 1 }}
      start={{
        x: 0,
        y: 0.5,
      }}
      end={{
        x: 1,
        y: 0.5,
      }}
    />
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackground: defaultHeaderBackground,
        headerTintColor: 'white',
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
          },
        headerShown: false,
        headerBackground: null
      }}
        >
        {(props) => <AssignmentTab {...props} title={props.route.params.title} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}


function BottomMenu() {
  const colorCtx = useContext(ColorContext)
  const navigation = useNavigation()
  const blinkCtx = useContext(BlinkContext);
  const goldColor = 'gold';
  
  console.log(`blinkContext: ${blinkCtx.shouldBlink}`)

  return (
      <Bottom.Navigator
      screenOptions={{
        tabBarStyle : bottomNavStyles.container,
        tabBarBackground: () => {
          return (
            <LinearGradient
                colors={[ColorsBlue.blue1300, ColorsBlue.blue1100, ColorsBlue.blue1300]} 
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
          title: 'Assignments',
         
          tabBarIcon: ({color}) => {
            return (
              <Icon 
              size = {24}
              icon = "list"
              color = {color}
              addStyle = {{marginRight: 0}}
              onPress={() => navigation.navigate('AssignmentsResults')}/>
            )
          },
          headerShown: false
      }}
      />

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
              onPress={() => navigation.navigate('RobotCommands')}
              />
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
            paddingTop: 20 }}
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
                paddingTop: 10,
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

const bottomNavStyles = StyleSheet.create({
    container: {
        borderTopColor: ColorsBlue.blue900,
        borderTopWidth: 1
    }
});

function Authorized() {
  const colorCtx = useContext(ColorContext);
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: ColorsBlue.blue1200 },
        headerTintColor: 'white',
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
            colors={[ColorsBlue.blue1200, ColorsBlue.blue1100, ColorsBlue.blue1200]} 
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
    <UserProfileContextProvider>
      <SocketContextProvider>
      <ChatContextProvider>
        <AssignmentDetailsContextProvider>
          <ChartContextProvider>
            <ImagesContextProvider>
              <AssignmentContextProvider>
                  <CarContextProvider>
                    <ColorContextProvider>
                      <AuthContextProvider>
                        <BlinkContextProvider>
                          <Root />
                        </BlinkContextProvider>
                      </AuthContextProvider>
                    </ColorContextProvider>
                  </CarContextProvider>
              </AssignmentContextProvider>
            </ImagesContextProvider>
          </ChartContextProvider>
        </AssignmentDetailsContextProvider>
      </ChatContextProvider>
    </SocketContextProvider>
    </UserProfileContextProvider>
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
