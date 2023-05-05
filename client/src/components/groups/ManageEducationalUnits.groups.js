
import { View,  ImageBackground, StyleSheet, FlatList} from 'react-native'
import { ColorsBlue } from '../../constants/palet'
import { useNavigation } from '@react-navigation/native';
import GroupCategoryTile from './GroupTile.groups';
import TeacherModal from '../Teacher/TeacherModal.components';
import GroupStudent from '../../screens/Authenticated/Groups/GroupStudents.screen';

function ManageEducationalUnits({user_role, tileType, deletehHandler, editHandler, addUserHandler, classroom_id, className, data, setDbUpdate, dataUser, tabNav}){
    const navigation = useNavigation();

    function mergeDataWithNames(userNames, data) {
        return data.map(item => {
          const groupData = userNames.find(group => group.group_id === item.group_id);
          if (groupData) {
            return {
              ...item,
              usernames: groupData.names
            };
          } else {
            return {
              ...item,
              usernames: []
            };
          }
        });
      }

    function renderGroups({item}) {   
        //Don't display tiles that do not have the selected classroom
        function navigationHandler(tile) {
            if (user_role === 'teacher'){
                switch(tile){
                    case 'Class':
                        navigation.navigate('groups', {
                            screen: 'Grouproom',
                            params: {
                                classroom_id: item.class_id,
                                class_name: item.name,
                            },
                        });
                        break;
                    case 'Group':
                        navigation.navigate('IndividualGroup') // add specfic group info
                }
            } 
            else {
                switch(tile){
                    case 'Class':
                        navigation.navigate('groups', {
                            screen: 'Grouproom',
                            params: {
                                classroom_id: item.class_id,
                                class_name: item.name,
                            },
                        });
                        break;
                    case 'Group':
                        //REPLACE WITH USER SCREENS
                        navigation.navigate('IndividualGroup') // add specfic group info
                }
            }
        }

        console.log(item.names)
        return (
            <GroupCategoryTile
                navigationHandler={navigationHandler.bind(this, tileType)}
                addUserHandler={addUserHandler}
                groupNames={item.name}
                groupMembers={item.usernames} //change this to 
                groupCount={item.current_count + '/' + item.max_count} // change that it contains max number of members + current participants
                user_role={user_role}
                tileType={tileType}
                deletehHandler={deletehHandler}
                editHandler={editHandler}
                class_id = {item.class_id}
                group_id = {tileType === 'Group' ? item.group_id : false }
                className = {className}
            />
        )
    }
 
    const mergedData = dataUser ? mergeDataWithNames(dataUser, data) : data;

    return (
        <View style = {styles.container}>
            <ImageBackground
            source={require('./../../../assets/chatbackground.png')} 
            style={
            {flex: 1, resizeMode: 'contain'}
            }
            imageStyle={{opacity: 0.15}}
            >
                <View style = {{flex: 1}}>
                    <FlatList
                    KeyExtractor = {(item) => item.classroom_id.to_String()}
                    data = {mergedData} //toevoegen dat deze data alleen voor teacher geldt -> wil eigenlijk dat dit gefetch wordt via een socket
                    renderItem = {renderGroups}
                    />
                </View>
            </ImageBackground>
        <TeacherModal
        tileType={tileType}
        classroom_id={classroom_id}
        setDbUpdate={setDbUpdate}
        />
        
        </View>
    )
}

export default ManageEducationalUnits

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorsBlue.blue1300,
    }
})
