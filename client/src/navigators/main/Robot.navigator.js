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





//test
const Stack = createNativeStackNavigator()


// DISPLAYS SCREEN WITH ROBOT OPTIONS LIKE STORE AND SSH CONNECT
function Robot () {
    const navigation = useNavigation();
  
    return (
      <Stack.Navigator
        screenOptions={{
          headerTintColor: 'white',
          header: ({ route }) => {
            return <CustomHeader title={route.name} MoneyContainer={MoneyContainer} />;
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
                  title={route.name}
                  MoneyContainer={showMoneyContainer ? MoneyContainer : null}
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
          
          {/* <Stack.Screen 
          component={RobotCommands}
          name = "RobotCommands"
          options= {{
            title: 'Robot Commands',
            
          }}/>
  
          */
          }
  
      </Stack.Navigator>
    )
  }

  export default Robot