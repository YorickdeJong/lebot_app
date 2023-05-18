import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';


import RobotCommands from '../../screens/Authenticated/Robot/RobotCommands';
import Icon from '../../components/Icon';
import SSHConnectionScreen from '../../screens/Authenticated/Robot/SSH';
import Controller from '../../screens/Authenticated/Robot/Controller';
import RobotStore from '../../screens/Authenticated/Robot/RobotStore';
import MoneyContainer from '../../components/robot/store/moneyContainer';
import { ColorsBlue } from '../../constants/palet';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from './CustomNavigator.main';
import { WifiContext } from '../../store/robot-connect-context';
import { useContext } from 'react';
import { SocketContext } from '../../store/socket-context';
import { ipAddressRaspberryPi } from '../../data/ipaddresses.data';





//test
const Stack = createNativeStackNavigator()


// DISPLAYS SCREEN WITH ROBOT OPTIONS LIKE STORE AND SSH CONNECT
function Robot () {
    const navigation = useNavigation();
    const WifiCtx = useContext(WifiContext)

    function robotConnect() {
        WifiCtx.showModalHandler(true)
    }

    return (
      <Stack.Navigator
        screenOptions={{
          headerTintColor: 'white',
          header: ({ route }) => {
            return <CustomHeader MoneyContainer={MoneyContainer} />;
          },
          headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
          },
          }}>
  
          <Stack.Screen 
          component={RobotStore}
          name = "RobotStore"
          options= {{
            header: ({ route }) => {
              const showMoneyContainer = route.name === "RobotStore";
              return (
                <CustomHeader
                  MoneyContainer={showMoneyContainer ? MoneyContainer : null}
                  robotConnect={robotConnect}
                />
              );
            },
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
          

      </Stack.Navigator>
    )
  }

  export default Robot