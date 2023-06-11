import { useContext, useCallback, useState, useEffect } from "react"
import  { Alert } from "react-native"
import ManageEducationalUnits from "../../../components/groups/ManageEducationalUnits.groups"
import { createClassUser } from "../../../hooks/classesInfo.hooks"
import { GroupTeacherContext } from "../../../store/group-teacher-context"
import { UserProfileContext } from "../../../store/userProfile-context"
import { changeUserProfile } from "../../../hooks/auth"
import { deleteGroupByID } from "../../../hooks/groups.hooks"
import { deleteGroupUser } from "../../../hooks/groupsInfo.hooks"
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useFetchClassesDataSocket } from "../../../hooks/classesSocket.hooks"
import { useFetchTimeLessonsDataSocket } from "../../../hooks/time-lessons.hook"



function ClassesStudent({tileType}) {
    // implement create user_group and user_classes here     
    const [dbUpdated, setDbUpdated] = useState(false) //retrigger when db updated        
    const groupTeacherCtx = useContext(GroupTeacherContext)
    const userprofileCtx = useContext(UserProfileContext)

    const school_id = userprofileCtx.userprofile.school_id
    const user_id = userprofileCtx.userprofile.id

    const [data, initialize] = useFetchClassesDataSocket(true, user_id, school_id);
    const [dataTime, initializeTime] = useFetchTimeLessonsDataSocket(true, school_id)
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            
            console.log('ClassesStudent component focused');
            initialize(); // Add this line to call initialize when the component is focused
            initializeTime();
            return () => {
                console.log('ClassesStudent component blurred');
            };
        }, [initialize, initializeTime, dbUpdated]) // Add initialize as a dependency
    );

    async function joinClassHandler(class_id) {
        const user_id = userprofileCtx.userprofile.id
        const {name} = groupTeacherCtx.getClassInfoById(class_id)
        const userprofile = {
            ...userprofileCtx.userprofile,
            class_id,
            class_name: name
        }

        setDbUpdated(false)

        if (userprofileCtx.userprofile.class_id) {
            Alert.alert(
                'Alert',
                'Weet je zeker dat je een andere klas wilt toevoegen?',
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
                                //also delete group from profile?
                                //delete group if user is in a group
                                if (userprofileCtx.userprofile.group_id) {
                                    console.log('deleting group')
                                    
                                    //delete group and user_group
                                    await deleteGroupUser(user_id)
                                    
                                    //delete group
                                    await deleteGroupByID(userprofileCtx.userprofile.group_id)
                                    
                                    //delete group_id and group_name from user profile
                                    userprofile.group_id = null
                                    userprofile.group_name = null
                                }

                                // add class_id and class_name to user profile
                                userprofileCtx.editUserProfile(userprofile) // we edit user profile before actually deleting the group if present
                                await createClassUser(user_id, class_id)
                                
                                //not calling create class here?
                                await changeUserProfile(userprofile)
                                setDbUpdated(true)
                                Alert.alert('Veranderd van klas!')
                                navigation.navigate('groups', {
                                    screen: 'Grouproom',
                                    params: {
                                        classroom_id: class_id,
                                        class_name: name,
                                    },
                                });
                                return;
                            }  
                            catch(error){
                                console.log(error)
                                Alert.alert('Er is iets mis gegaan')
                                setDbUpdated(false)
                                return;
                            }
                        },
                    },
                ],
                { cancelable: false }
            );
        }
        // in the case class id empty
        else {
            Alert.alert(
                'Alert',
                'Weet je zeker dat je een andere klas wilt toevoegen?',
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
                                // add class_id and class_name to user profile
                                userprofileCtx.editUserProfile(userprofile)
                                await createClassUser(user_id, class_id)
                                await changeUserProfile(userprofile)
                                Alert.alert('Klas toegevoegd!')
                                setDbUpdated(true)
                                return;
                            }  
                            catch(error){
                                console.log(error)
                                Alert.alert('Er is iets mis gegaan')
                                setDbUpdated(false)
                                return;
                            }
                        },
                    },
                ],
                { cancelable: false }
            );
        }
        
    }


    
    return( 
        <ManageEducationalUnits 
            user_role={'student'}
            tileType= {tileType}
            editHandler={joinClassHandler}
            data={data}
        />
    )
}

export default ClassesStudent