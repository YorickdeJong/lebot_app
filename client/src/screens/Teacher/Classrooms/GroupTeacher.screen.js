import { useCallback, useContext, useEffect, useState } from "react";
import ManageEducationalUnits from "../../../components/groups/ManageEducationalUnits.groups";
import { GroupTeacherContext } from "../../../store/group-teacher-context";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { UserProfileContext } from "../../../store/userProfile-context";
import { useFetchGroupsDataSocket } from "../../../hooks/groupSocket.hooks";
import { deleteAllGroupInClass, deleteGroupByID } from "../../../hooks/groups.hooks";
import { Alert } from "react-native";
import { deleteGroupInfo } from "../../../hooks/groupsInfo.hooks";
import { updateGroupIDForUsers, useUserSocket } from "../../../hooks/auth";


function GroupTeacherScreen({ navigation, route }) {
    const isFocused = useIsFocused();
    const [dbUpdate, setDbUpdate] = useState(false);

    const classroom_id = route.params.classroom_id;
    const class_name = route.params.class_name;
    // implement create user_group and user_classes here            
    const groupTeacherCtx = useContext(GroupTeacherContext)
    const userprofileCtx = useContext(UserProfileContext)

    const school_id = userprofileCtx.userprofile.school_id
    const user_id = userprofileCtx.userprofile.id

    const groups = groupTeacherCtx.getAllGroupsInClass(classroom_id);
    let group_ids = [];
    if (groups) {
        group_ids = groups.map(group => group.group_id);
    }

    const [data, initialize] = useFetchGroupsDataSocket(true, user_id, classroom_id, school_id);

    useFocusEffect(
        useCallback(() => {
            
            console.log('ClassesStudent component focused');
            initialize(); // Add this line to call initialize when the component is focused
            return () => {
                console.log('ClassesStudent component blurred');
            };
        }, [initialize, dbUpdate]) // Add initialize as a dependency
    );


    useEffect(() => {
        groupTeacherCtx.setCurrentClass_id(classroom_id)
    }, [classroom_id, isFocused])

    if (!isFocused){
        return null;
    }
    
    async function deleteGroupHandler(group_id) {
        //Make it such that all group participants are removed from the group
        setDbUpdate(false);
        Alert.alert(
            'Alert',
            'Weet je zeker dat je deze groep wilt verwijderen?',
            [
                {
                    text: 'No',
                    onPress: () => {console.log('pressed')},
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            groupTeacherCtx.deleteGroupHandler(group_id);
                            console.log('check 1')
                            if (groupTeacherCtx.checkIfGroupIsEmpty(group_id)) {
                                //delete group from user profile
                                await updateGroupIDForUsers(group_id)
                                //delete group from group_users
                                await deleteGroupInfo(group_id); //deletes all users from group
                            }
                            console.log('check 2')
                            console.log(group_id)
                            await deleteGroupByID(group_id);
                            // also need to delete all user profiles from group and class when deleting
                            console.log('check 3')
                            setDbUpdate(true);
                            Alert.alert('Groep verwijderd!');
                            return;
                        }
                        catch(error) {
                            console.log(error);
                            setDbUpdate(false);
                        }
                    }
                }
            ]
        )
    }
    
    return(
        <ManageEducationalUnits
            user_role={'teacher'}
            tileType={'Group'}
            deletehHandler={deleteGroupHandler}
            editHandler={groupTeacherCtx.addHandlerFunction.bind(this, 'edit')}
            className={class_name}
            classroom_id={classroom_id}
            data={data}
            setDbUpdate={setDbUpdate}
        />
    ) 
}

export default GroupTeacherScreen;