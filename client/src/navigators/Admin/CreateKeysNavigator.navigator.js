import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomHeader from '../main/CustomNavigator.main';
import GenerateKeys from '../../screens/Admin/Keys/GenerateKeys.screen';
import GetKeys from '../../screens/Admin/Keys/GetKeys.screen';
import DeleteKeys from '../../screens/Admin/Keys/DeleteKeys.screens';
import ChangeKeys from '../../screens/Admin/Keys/ChangeKeys.screens';
import KeysMainScreen from '../../screens/Admin/Keys/KeysMain.screen';

const Stack = createNativeStackNavigator();


function CreateKeysNavigator() {
    return (
    
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
        >
            <Stack.Screen name="Keys Main" component={KeysMainScreen} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

            <Stack.Screen name="Generate Keys" component={GenerateKeys} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

            <Stack.Screen name="Get Keys" component={GetKeys} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />


            <Stack.Screen name="Delete Keys" component={DeleteKeys} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />


            <Stack.Screen name="Change Keys" component={ChangeKeys} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

    
        </Stack.Navigator>
    
    );
    
}

export default CreateKeysNavigator;