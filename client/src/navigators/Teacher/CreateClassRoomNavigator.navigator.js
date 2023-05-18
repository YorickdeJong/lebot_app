import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClassRoomMain from '../../screens/Teacher/Classrooms/ClassroomMain.screens';
import CustomHeader from '../main/CustomNavigator.main';
import GroupTeacherScreen from '../../screens/Teacher/Classrooms/GroupTeacher.screen';

const Stack = createNativeStackNavigator();

function CreateClassroomNavigator(){

    return (
        <Stack.Navigator
        screenOptions={{

        }}
        >
            <Stack.Screen
            name="Classroom"
            component={ClassRoomMain}
            options={{
                header: ({ route }) => {
                return (
                    <CustomHeader
                    title={route.name} 
                    addHandler={"group-add"}
                    goBack
                    />
                );
                },
            }}
            />

            <Stack.Screen name="Grouproom" component={GroupTeacherScreen} 
                options={{
                header: ({ route }) => {
                    return <CustomHeader title={route.name}
                    addHandler={"person-add"}
                    goBack
                    />;
                    }
                }}
            />

        </Stack.Navigator>
    )
}

export default CreateClassroomNavigator;