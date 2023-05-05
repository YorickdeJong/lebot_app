import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from '../../screens/Admin/AdminDashboard.screens';
import CustomHeader from '../main/CustomNavigator.main';
import Analytics from '../../screens/Admin/Analytics.screens';
import Subscriptions from '../../screens/Admin/Subscriptions.screens';
import SupportTickets from '../../screens/Admin/SupportTickets.screens';
import CreateUserNavigator from './CreateUserNavigator.navigator';
import CreateGroupNavigator from './CreateGroupNavigator.navigator';
import CreateKeysNavigator from './CreateKeysNavigator.navigator';
import Settings from '../../screens/Admin/Settings';

const Stack = createNativeStackNavigator();



function AdminNavigator() {

    return (
    
        <Stack.Navigator
        screenOptions={{
        header: ({ route }) => {
            return <CustomHeader title={route.name} 
            
            />;
        },
            headerTintColor: 'white',
            headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
        },
        }}  
        >
    
            <Stack.Screen name="Admin" component={AdminDashboard} 
            />

            <Stack.Screen name="Create User" component={CreateUserNavigator} 
                options={{
                title: 'Create Users',
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

            <Stack.Screen name="Analytics" component={Analytics} 
                options={{

                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

            <Stack.Screen name="Create Group" component={CreateGroupNavigator} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

            <Stack.Screen name="Keys Main" component={CreateKeysNavigator} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

            <Stack.Screen name="Subscriptions" component={Subscriptions} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

            <Stack.Screen name="Support Tikets" component={SupportTickets} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />
    
            <Stack.Screen name="Settings" component={Settings} 
                options={{
                presentation: 'modal',
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

            {/* <Stack.Screen name="AdminProfile" component={AdminProfile} /> */}
    
        </Stack.Navigator>
    
    );
    
}

export default AdminNavigator;