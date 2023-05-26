import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert, AppState } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContextProvider, { AuthContext } from './src/store/auth-context';
import ColorContextProvider, { ColorContext } from './src/store/color-context';
import {  ColorsBlue } from './src/constants/palet';
import UserProfileContextProvider, { UserProfileContext } from './src/store/userProfile-context';
import SocketContextProvider, { SocketContext } from './src/store/socket-context';
import CarContextProvider from './src/store/car-context';
import AssignmentContextProvider from './src/store/assignment-context';
import ChartContextProvider from './src/store/chart-context';
import AssignmentDetailsContextProvider from './src/store/assignment-Details-context';
import ChatContextProvider from './src/store/chat-context';
import ChartOptionsContextProvider from './src/store/chartOptions-context';
import BlinkContextProvider from './src/store/animation-context';
import Authenticate from './src/navigators/authenticate/Authenticate.navigator';
import Authorized from './src/navigators/main/Authorized.navigator';
import AdminNavigator from './src/navigators/Admin/Admin.navigator';
import TeacherNavigator from './src/navigators/Teacher/Teacher.navigator';
import GroupTeacherContextProvider from './src/store/group-teacher-context';
import { SocketProviderGroups } from './src/store/group-socket-context';
import { SocketProviderClasses } from './src/store/classes-socket-context';
import { SocketProviderUser } from './src/store/userprofile-socket-context';
import WifiContextProvider from './src/store/robot-connect-context';
import { ShowIconContextProvider } from './src/store/show-icons-context';
import { TimeContextProvider } from './src/store/time-context';
import { InformationContext, InformationContextProvider } from './src/store/information-context';
import ScrollContextProvider from './src/store/scroll-context';
import AppExplanation from './src/screens/Authenticated/BeginningScreen/AppExplanation';

// UPON LOGIN TOKEN GETS SET
function Navigation() {
  const userprofileCtx = useContext(UserProfileContext);
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

  console.log('user_role', userprofileCtx.userprofile.user_role)

  return (
      <NavigationContainer theme = {MyTheme}>
          {!authCtx.isAuthenticated && <Authenticate />}
          {authCtx.isAuthenticated && userprofileCtx.userprofile.user_role === "admin" && <AdminNavigator />} 
          {authCtx.isAuthenticated && userprofileCtx.userprofile.user_role === "student" &&  <Authorized />} 
          {authCtx.isAuthenticated && userprofileCtx.userprofile.user_role === "teacher" &&  <TeacherNavigator />}              
      </NavigationContainer>
  );
}



//CONTAINS ALL SCREENS, DISTINGUISHES BETWEEN LOGIN AND AUTHORIZED
function Root({}) {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);
  const colorCtx = useContext(ColorContext)
  const { socket, isConnected, Disconnect, CreateSocketConnection, EstablishSocketConnection } = useContext(SocketContext);
  const [connectionAttempted, setConnectionAttempted] = useState(false); //add connection atempt to not immidiately show first alert
  const userprofileCtx = useContext(UserProfileContext);
  const {user_role} = userprofileCtx.userprofile;
  const [isAlertShown, setIsAlertShown] = useState(false);



  // Call CreateConnection on mount
  useEffect(() => {
        if (user_role === 'teacher' || user_role === 'admin') {
            return
        }
        // Create socket connection on component mount
        CreateSocketConnection();
        return () => {
          Disconnect();
          // subscription.remove();
        };
    }, []);


    // move to auth context
    useEffect(() => {
      async function fetchToken() {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
            authCtx.authenticate(storedToken);
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


// CONTAINS ALL CHAT CONTEXTS WRAPPED AROUND THE ROOT SCREEN
export default function App() {

  return (
    <>
    <StatusBar style="light" />
    <UserProfileContextProvider>
      <SocketContextProvider>
        <SocketProviderClasses namespace = "/api/v1/classes">
          <SocketProviderGroups namespace = "/api/v1/groups">
            <SocketProviderUser namespace = "/api/v1/user/users-in-group">
              <WifiContextProvider>
                <ChatContextProvider>
                  <AssignmentDetailsContextProvider>
                    <ChartContextProvider>
                      <ChartOptionsContextProvider>
                        <AssignmentContextProvider>
                          <GroupTeacherContextProvider>
                              <CarContextProvider>
                                <ColorContextProvider>
                                  <AuthContextProvider>
                                    <BlinkContextProvider>
                                      <ShowIconContextProvider>
                                        <TimeContextProvider namespace="/time-lessons">
                                          <InformationContextProvider>
                                            <ScrollContextProvider>
                                                <Root />
                                            </ScrollContextProvider>
                                          </InformationContextProvider>
                                        </TimeContextProvider>
                                      </ShowIconContextProvider>
                                    </BlinkContextProvider>
                                  </AuthContextProvider>
                                </ColorContextProvider>
                              </CarContextProvider>
                          </GroupTeacherContextProvider>
                        </AssignmentContextProvider>
                      </ChartOptionsContextProvider>
                    </ChartContextProvider>
                  </AssignmentDetailsContextProvider>
                </ChatContextProvider>
              </WifiContextProvider>
            </SocketProviderUser>
          </SocketProviderGroups>
        </SocketProviderClasses>
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
