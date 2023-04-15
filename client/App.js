import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useContext, useEffect, useState} from 'react';
import AppLoading from 'expo-app-loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContextProvider, { AuthContext } from './src/store/auth-context';
import ColorContextProvider, { ColorContext } from './src/store/color-context';
import {  ColorsBlue } from './src/constants/palet';
import UserProfileContextProvider from './src/store/userProfile-context';
import SocketContextProvider from './src/store/socket-context';
import CarContextProvider from './src/store/car-context';
import AssignmentContextProvider from './src/store/assignment-context';
import ChartContextProvider from './src/store/chart-context';
import AssignmentDetailsContextProvider from './src/store/assignment-Details-context';
import ChatContextProvider from './src/store/chat-context';
import ChartOptionsContextProvider from './src/store/chartOptions-context';
import BlinkContextProvider from './src/store/animation-context';
import Authenticate from './src/navigators/authenticate/Authenticate.navigator';
import Authorized from './src/navigators/main/Authorized.navigator';



// UPON LOGIN TOKEN GETS SET
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
          {/* TODO add beggining screen here, keep the isAuthenticated, but move Athenticate into this screen.  */}
          {authCtx.isAuthenticated && <Authorized />}
      </NavigationContainer>
  );
}


//CONTAINS ALL SCREENS, DISTINGUISHES BETWEEN LOGIN AND AUTHORIZED
function Root() {
    const [isTryingLogin, setIsTryingLogin] = useState(true);
    const authCtx = useContext(AuthContext);
    const colorCtx = useContext(ColorContext)

    console.log(`isAuthenticated: ${authCtx.isAuthenticated}`)
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
      <ChatContextProvider>
        <AssignmentDetailsContextProvider>
          <ChartContextProvider>
            <ChartOptionsContextProvider>
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
            </ChartOptionsContextProvider>
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
