import { LinearGradient } from 'expo-linear-gradient';
import {Text, View, StyleSheet, Pressable, Alert} from 'react-native';
import { ColorsBlue, ColorsGray, ColorsRed } from '../../constants/palet';
import Icon from '../Icon';
import { GroupTeacherContext } from '../../store/group-teacher-context';
import { useContext } from 'react';
import { deleteClassByID } from '../../hooks/classes.hooks';


function GroupCategoryTile({groupNames, navigationHandler, groupMembers, groupCount, className, user_role, tileType, deletehHandler, editHandler, class_id, group_id}) {
    const title = tileType === 'Class' ? 'Klas: ' : 'Groep: '
    const groupTeacherCtx = useContext(GroupTeacherContext)

    const handleEditPress = (class_id) => {
        if (tileType === 'Class') {
            console.log('CLASS ID: ',class_id)
            groupTeacherCtx.setCurrentClass_id(class_id)
            editHandler(class_id);
        }
        if (group_id) {
            groupTeacherCtx.setCurrentGroup_id(group_id)
            editHandler(group_id, class_id);
        }
        
    };

    const handleDeletePress = (class_id) => {
            deletehHandler(class_id);
    };

    //set statewide current ids here
    return(
        <Pressable 
        style = {styles.chatBox}
        onPress={navigationHandler}
        >
            <LinearGradient 
                colors={[ColorsBlue.blue1300, ColorsBlue.blue1000]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style = {styles.colorGradient}
            >
                <View style = {[styles.textBox, {marginLeft: user_role === 'teacher' ? 25: 20, padding: tileType === 'Group' ? 0 : 10, justifyContent: tileType === 'Group' ? null : 'center'}]}>
                    <Text style = {styles.text}>{title}{groupNames}</Text>
                    {tileType === 'Class' ? null : <Text style={styles.description}>{groupMembers.length > 0 ? groupMembers.join(', ') : 'Groep is leeg'}</Text>}
                </View>
                <View style = {{marginLeft: user_role === 'teacher' ? 25: 0}}>
                    <View style={styles.iconWrapper}>
                        <Icon 
                        icon = {user_role === 'teacher' ? 'settings-outline' : "head-plus-outline"}
                        size = {user_role === 'teacher' ? 30 : 40}
                        color = {user_role === 'teacher' ? ColorsGray.gray400 :  ColorsRed.red500}
                        onPress = {user_role === 'teacher' ? () => handleEditPress(class_id) : () => handleEditPress(class_id)}
                        differentDir = {user_role === 'teacher' ? false : true}
                        />
                    </View>
                    {user_role === 'teacher' && 
                    <View style={[styles.iconWrapper, {marginTop:45}]}>
                        <Icon 
                        icon = "trash-can-outline"
                        size = {30}
                        color = {ColorsRed.red500}
                        onPress = {tileType === 'Class' ? () => handleDeletePress(class_id): () => handleDeletePress(group_id)}
                        differentDir
                        />
                    </View>
                    }
                </View>
                <View style={styles.groupCount}>
                    <Text style = {styles.description}>{groupCount}</Text>
                </View>
                {tileType === 'Group' && 
                <View style = {styles.classInfo}>
                    <Text style = {styles.description}>Klas: {className}</Text>
                </View>}
            </LinearGradient> 
        </Pressable>
    )
}

export default GroupCategoryTile


styles = StyleSheet.create({
    classInfo: {
        position: 'absolute',
        bottom: 5,
        left: '37%'
    },
    groupCount: {
        position: 'absolute',
        bottom: 5,
        left: 10
    },
    chatBox: {
        borderColor: ColorsBlue.blue900,
        borderWidth: 0.9,
        flex: 1,
        marginTop: 20, 
        margin: 10,
        height: 140,
        borderRadius: 6, 
        elevation: 4, 
        shadowColor: ColorsBlue.blue1150,
        shadowOffset: {height: 3, width: 2},
        shadowRadius: 2,
        shadowOpacity: 1,
    },
    colorGradient: {
        borderRadius: 6, 
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    textBox: {
        width: 300,
        height: 90,
        padding: 10,
        justifyContent: 'center',
    },  
    text: {
        color: ColorsBlue.blue50,
        fontSize: 26,
        textAlign: 'center',
        marginBottom: 5
    },
    description: {
        color: ColorsGray.gray400,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 5
    },
    iconWrapper: {
        width: 50,
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
})