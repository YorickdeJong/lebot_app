import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';

import { ColorContext } from '../../store/color-context';
import Login from '../../screens/Login/Login';
import Signup from '../../screens/Login/Signup';
import Icon from '../../components/Icon';
import Begin from '../../screens/Login/Begin.login';
import CustomHeader from './CustomNavigator.authenticate';
import { ColorsBlue } from '../../constants/palet';
const Stack = createNativeStackNavigator();

// LOGIN SCREEN
function Authenticate() {
  const colorCtx = useContext(ColorContext);

  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ route }) => {
          return null;
        },
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
        },
      }}  
    >
      <Stack.Screen
        name="Begin"
        component={Begin}
        options={{
          title: '',
        }}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

export default Authenticate;

const styles = StyleSheet.create({
  text: {
    color: ColorsBlue.blue50,
    fontSize: 17,
    marginRight: 5,
    fontWeight: '400',
  },
});
