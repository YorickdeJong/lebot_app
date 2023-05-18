import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from '../../screens/Admin/AdminDashboard.screens';
import CustomHeader from '../main/CustomNavigator.main';
import TeacherDashboard from '../../screens/Teacher/TeachersDashBoard.screens';
import Settings from '../../screens/Authenticated/Settings/Settings';
import ClassRoomMain from '../../screens/Teacher/Classrooms/ClassroomMain.screens';
import InstructionsMain from '../../screens/Teacher/Instructions/InstructionsMain.screens';
import SearchMain from '../../screens/Teacher/SearchMain';
import SupportMain from '../../screens/Teacher/Support/SupportMain.screens';
import AnswersMain from '../../screens/Teacher/Answers/AnswersMain.screens';
import CreateClassroomNavigator from './CreateClassRoomNavigator.navigator';

const Stack = createNativeStackNavigator();



function TeacherNavigator() {

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
    
            <Stack.Screen name="Teacher" component={TeacherDashboard} 
            />

            <Stack.Screen name="groups" component={CreateClassroomNavigator} 
                options={{
                headerShown:false,
                title: 'Create Users',
                }}
            />

            <Stack.Screen name="Instructions" component={InstructionsMain}
                options={{

                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

            <Stack.Screen name="Search" component={SearchMain} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

            <Stack.Screen name="Support" component={SupportMain} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name} goBack/>;
                    }
                }}
            />

            <Stack.Screen name="Answers" component={AnswersMain}
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
    
        </Stack.Navigator>
    
    );
    
}

export default TeacherNavigator;