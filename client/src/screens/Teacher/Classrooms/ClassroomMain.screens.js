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

function ClassRoomMain({ route }) {
      // implement create user_group and user_classes here            
      const groupTeacherCtx = useContext(GroupTeacherContext)
      const userprofileCtx = useContext(UserProfileContext)
      const [dbUpdate, setDbUpdate] = useState(false);

      const school_id = userprofileCtx.userprofile.school_id
      const user_id = userprofileCtx.userprofile.id
  
      const [data, initialize] = useFetchClassesDataSocket(true, user_id, school_id);
  
      useFocusEffect(
          useCallback(() => {
              
              console.log('ClassesStudent component focused');
              initialize(); // Add this line to call initialize when the component is focused
              
              return () => {
                  console.log('ClassesStudent component blurred');
              };
          }, [initialize, dbUpdate]) // Add initialize as a dependency
      );
        
      
      async function deleteClassHandler(class_id) {
          console.log('class_id', class_id)
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
                              
                                   //delete group from user profile
                                   await updateGroupIDForClass(class_id) //THIS MIGHT NOT EXECUTED!!
                              
                              // check if there are groups in classes
                              if (groupTeacherCtx.getAllGroupsInClass(class_id)) {
                                console.log('groups in class')
                                // check if groups are occupied
                                if (groupTeacherCtx.checkIfGroupsAreEmpty(class_id)) {
                                  console.log('check groups are not empty')
                                  //delete from classes_users
                                  await deleteAllGroupsInfo(class_id)
                                 
                                  //delete group from user profile
                                  await updateGroupIDForClass(class_id) //THIS MIGHT NOT EXECUTED!!
                                } 
                                await deleteAllGroupInClass(class_id) //pronlem not a function
                              }
                              

                              // check if class is occupied
                              if (groupTeacherCtx.checkIfClassIsEmpty(class_id)) {
                                console.log('CHECK CHECK')
                                await deleteClassInfo(class_id)
                              }
                              console.log('deleting class by id')
                              //delete class
                              await deleteClassByID(class_id)
                              setDbUpdate(true);
                              Alert.alert('Klas verwijderd!')
                              return
                          }
                          catch(error) {
                              console.log(error)
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