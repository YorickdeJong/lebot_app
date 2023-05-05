
import CreateUser from '../../screens/Admin/Users/CreateUser.screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomHeader from '../main/CustomNavigator.main';

const Stack = createNativeStackNavigator();


function CreateUserNavigator() {
    return (
    
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
        >
            <Stack.Screen name="Create User" component={CreateUser} 
                options={{
                title: 'Create User',
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />
    
            {/* <Stack.Screen name="AdminProfile" component={AdminProfile} /> */}
    
        </Stack.Navigator>
    
    );
    
}

export default CreateUserNavigator;