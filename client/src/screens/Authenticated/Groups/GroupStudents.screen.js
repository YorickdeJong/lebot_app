import { useCallback, useContext, useEffect, useState } from "react";
import { GroupTeacherContext } from "../../../store/group-teacher-context";
import { UserProfileContext } from "../../../store/userProfile-context";
import { Alert } from "react-native";
import { createGroupUser } from "../../../hooks/groupsInfo.hooks";
import { useUserSocket, changeUserProfile } from "../../../hooks/auth";
import { useFocusEffect } from "@react-navigation/native";
import { useFetchGroupsDataSocket } from "../../../hooks/groupSocket.hooks";
import ManageEducationalUnits from "../../../components/groups/ManageEducationalUnits.groups"


function GroupStudent({ navigation, route, tileType }) {
    const [dbUpdated, setDbUpdated] = useState(false) //retrigger when db updated

    const groupTeacherCtx = useContext(GroupTeacherContext)
    const userprofileCtx = useContext(UserProfileContext)

    const school_id = userprofileCtx.userprofile.school_id
    const user_id = userprofileCtx.userprofile.id
    const classroom_id = route.params.classroom_id;
    const class_name = route.params.class_name;

    const groups = groupTeacherCtx.getAllGroupsInClass(classroom_id);
    let group_ids = [];
    if (groups) {
        group_ids = groups.map(group => group.group_id);
    }
    const [data, initialize] = useFetchGroupsDataSocket(true, user_id, classroom_id, school_id);
    const [dataUser, initializeUser] = useUserSocket(true, group_ids);

    useFocusEffect( 
        useCallback(() => {
            initialize();
            initializeUser();
            return () => {
                console.log('GroupStudent component blurred');
            };
        }, [initialize, dbUpdated]) // Add initialize as a dependency
    );

    async function joinGroupHandler(group_id, class_id) {
        const user_id = userprofileCtx.userprofile.id //PROBLEM: FETCHED GROUPS AREN'T ADDED TO LOCAL STORAGE -> ADD THEM 
        const {name} = groupTeacherCtx.getGroupInfoById(group_id)
        

        const userprofile = {
            ...userprofileCtx.userprofile,
            group_id,
            group_name: name
        }

        // user has not selected a class
        if (!userprofile.class_id) {
            Alert.alert('Voeg eerst een klas toe')
            return;
        }

        // user wants to join a group from a different class
        if (userprofile.class_id !== class_id) {
            Alert.alert('Je kan geen groep van een andere klas toevoegen')
            return;
        }   

        setDbUpdated(false)

        // If user already has a group, ask if he wants to change group
        if (userprofileCtx.userprofile.group_id) {
            Alert.alert(
                'Alert',
                'Weet je zeker dat je een andere groep wilt toevoegen?',
                [
                    {
                        text: 'No',
                        onPress: () => {},
                        style: 'cancel',
                    },
                    {
                        text: 'Yes',
                        onPress: async () => {
                            try {
                                // add class_id and class_name to user profile
                                userprofileCtx.editUserProfile(userprofile)
                                await createGroupUser(user_id, group_id, class_id)
                                await changeUserProfile(userprofile)
                                setDbUpdated(true)
                                Alert.alert('Groep toegevoegd!')
                                return;
                            }  
                            catch(error){
                                console.log(error)
                                setDbUpdated(false)
                                Alert.alert('Er is iets mis gegaan')
                                return
                            }
                        },
                    },
                ],
                { cancelable: false }
            );
        }
        // in the case group_id is empty
        else {          
            try {
                Alert.alert(
                    'Alert',
                    'Weet je zeker dat je deze groep wilt toevoegen?',
                    [
                        {
                            text: 'No',
                            onPress: () => {},
                            style: 'cancel',
                        },
                        {
                            text: 'Yes',
                            onPress: async () => {
                                try {
                                    // add class_id and class_name to user profile
                                    userprofileCtx.editUserProfile(userprofile)
                                    await createGroupUser(user_id, group_id, class_id)
                                    await changeUserProfile(userprofile)
                                    setDbUpdated(true)
                                    Alert.alert('Groep toegevoegd!')
                                    return
                                }  
                                catch(error){
                                    console.log(error)
                                    Alert.alert('Er is iets mis gegaan')
                                    setDbUpdated(false)
                                    return
                                }
                            },
                        },
                    ],
                    { cancelable: false }
                );
            }  
            catch(error){
                console.log(error)
                setDbUpdated(false)
                Alert.alert('Er is iets mis gegaan')
                return
            }
        }

    }

    return(
        <ManageEducationalUnits
            user_role={'student'}
            tileType={tileType} 
            editHandler={joinGroupHandler}
            className={class_name}
            classroom_id={classroom_id}
            data={data}
            dataUser={dataUser}
        />
    ) 
}

export default GroupStudent;