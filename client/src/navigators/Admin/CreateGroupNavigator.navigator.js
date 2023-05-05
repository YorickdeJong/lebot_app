import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomHeader from '../main/CustomNavigator.main';
import CreateGroup from '../../screens/Admin/Group/CreateGroup.screens';
import CreateSchools from '../../screens/Admin/Group/CreateSchool.screens';
import CreateClass from '../../screens/Admin/Group/CreateClass.screens';
import CreateIndividualGroup from '../../screens/Admin/Group/CreateIndividualGroup';

const Stack = createNativeStackNavigator();


function CreateGroupNavigator() {
    return (
    
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
        >
            <Stack.Screen name="Create Group" component={CreateGroup} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

            <Stack.Screen name="Create School" component={CreateSchools} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />


            <Stack.Screen name="Create Class" component={CreateClass} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />


            <Stack.Screen name="Create Individual Group" component={CreateIndividualGroup} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

    
            {/* <Stack.Screen name="AdminProfile" component={AdminProfile} /> */}
    
        </Stack.Navigator>
    
    );
    
}

export default CreateGroupNavigator;