import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomHeader from '../main/CustomNavigator.main';
import Groups from '../../screens/Authenticated/Groups/ClassesStudents.screens';
import GroupStudent from '../../screens/Authenticated/Groups/GroupStudents.screen';
import ClassesStudent from '../../screens/Authenticated/Groups/ClassesStudents.screens';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import IndividualGroup from '../../screens/Authenticated/Groups/IndividualGroup.screen';


const Stack = createNativeStackNavigator();

function StudentClassroomNavigator() {
    const navigation = useNavigation();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Classroom"
                children={() => <ClassesStudent tileType = 'Class'/>}
                options={{
                    header: ({ route }) => {
                        return (
                            <CustomHeader
                                title={route.name}
                                goBack
                            />
                        );
                    },
                }}
            />

            <Stack.Screen
                name="Grouproom" 
                children={({route, navigation}) => <GroupStudent tileType = 'Group' route={route} navigation={navigation}/>}
                options={{
                    header: ({ route }) => {
                        return (
                            <CustomHeader
                                title={route.name}
                                goBack
                                navigtor={() => {
                                    navigation.navigate('Classroom');
                                }}
                            />
                        );
                    },
                }}
            />

            <Stack.Screen
                name="IndividualGroup" 
                children={({route, navigation}) => <IndividualGroup tileType = 'Group' route={route} navigation={navigation}/>}
                options={{
                    header: ({ route }) => {
                        return (
                            <CustomHeader
                                title={route.name}
                                goBack
                                navigtor={() => {
                                    navigation.navigate('Classroom');
                                }}
                            />
                        );
                    },
                }}
            />

        </Stack.Navigator>
    );
}
export default StudentClassroomNavigator;