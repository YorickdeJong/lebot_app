import { useCallback, useContext, useEffect, useState } from "react";
import ManageEducationalUnits from "../../../components/groups/ManageEducationalUnits.groups";
import { GroupTeacherContext } from "../../../store/group-teacher-context";
import { UserProfileContext } from "../../../store/userProfile-context";
import { useFetchClassesDataSocket } from "../../../hooks/classesSocket.hooks";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";
import { deleteClassByID } from "../../../hooks/classes.hooks";
import { deleteAllGroupsInfo } from "../../../hooks/groupsInfo.hooks";
import { deleteClassInfo } from "../../../hooks/classesInfo.hooks";
import { deleteAllGroupInClass } from "../../../hooks/groups.hooks";
import { changeUserProfile, updateGroupIDForClass } from "../../../hooks/auth";
import { deleteAllLessonsForClass, useFetchTimeLessonsDataSocket } from "../../../hooks/time-lessons.hook";
import { TimeContext } from "../../../store/time-context";
import { deleteRobotWifiClass } from "../../../hooks/robotWifi";

function ClassRoomMain({ route }) {
    // implement create user_group and user_classes here            
    const groupTeacherCtx = useContext(GroupTeacherContext)
    const userprofileCtx = useContext(UserProfileContext)
    const [dbUpdate, setDbUpdate] = useState(false);
    const timeCtx = useContext(TimeContext)

    const school_id = userprofileCtx.userprofile.school_id
    const user_id = userprofileCtx.userprofile.id
    
    const [data, initialize] = useFetchClassesDataSocket(true, user_id, school_id);
    const [dataTime, initializeTime] = useFetchTimeLessonsDataSocket(true, school_id)

    //add useFetchTimelESSONSdATASOcket here? Also added for student classes?
    useFocusEffect(
        useCallback(() => {
            
            console.log('ClassesStudent component focused');
            initialize(); // Add this line to call initialize when the component is focused
            initializeTime();
            return () => {
                console.log('ClassesStudent component blurred');
            };
        }, [initialize, initializeTime, dbUpdate]) // Add initialize as a dependency
    );
        
    
    async function deleteClassHandler(class_id) {
        console.log(groupTeacherCtx.classInfo)
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
                            groupTeacherCtx.deleteClassHandler(class_id);
                            
                            // check if there are groups in classes
                            if (groupTeacherCtx.getAllGroupsInClass(class_id)) {
                                console.log('groups in class')
                                // check if groups are occupied
                                if (groupTeacherCtx.checkIfGroupsAreEmpty(class_id)) {
                                console.log('check groups are not empty')
                                    //delete from classes_users
                                    await deleteAllGroupsInfo(class_id)
                                    
                                    //delete group from user profile
                                } 
                                await deleteAllGroupInClass(class_id) 
                            }
                            
                            await updateGroupIDForClass(class_id) 
                            
                            // check if class is occupied
                            if (groupTeacherCtx.checkIfClassIsEmpty(class_id)) {
                                console.log('CHECK CHECK')
                                await deleteClassInfo(class_id)
                            }
                            console.log('deleting class by id')
                            //delete class
                            if (timeCtx.filterTimeDataClass(class_id)) {
                                await deleteAllLessonsForClass(class_id)
                            }

                            await deleteRobotWifiClass(class_id)
                            await deleteClassByID(class_id)
                            setDbUpdate(true);
                            Alert.alert('Klas verwijderd!')
                            return
                        }
                        catch(error) {
                            console.log('failed to edit class', error)
                            setDbUpdate(false)
                        }
                        
                    }
                }
            ]
        )
    }
    

    return (
        <ManageEducationalUnits
        user_role={"teacher"}
        tileType={"Class"}
        deletehHandler={deleteClassHandler}
        editHandler={groupTeacherCtx.addHandlerFunction.bind(this, 'edit')}
        data={data}
        setDbUpdate={setDbUpdate}
        />
    );
  }
  export default ClassRoomMain;