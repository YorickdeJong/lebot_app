import { LinearGradient } from 'expo-linear-gradient';
import {Text, View, StyleSheet, Pressable, Alert} from 'react-native';
import { ColorsBlue, ColorsDarkerGreen, ColorsGray, ColorsGreen, ColorsRed } from '../../constants/palet';
import Icon from '../Icon';
import { GroupTeacherContext } from '../../store/group-teacher-context';
import { useCallback, useContext, useEffect, useState } from 'react';
import { TimeContext } from '../../store/time-context';
import { useFetchTimeLessonsDataSocket } from '../../hooks/time-lessons.hook';
import { UserProfileContext } from '../../store/userProfile-context';
import { useFocusEffect } from '@react-navigation/native';
import CountDownModal from './CountDownModal';


function GroupCategoryTile({groupNames, navigationHandler, groupMembers, groupCount, className, user_role, tileType, deletehHandler, editHandler, class_id, group_id}) {
    const title = tileType === 'Class' ? 'Klas: ' : 'Groep: '
    const groupTeacherCtx = useContext(GroupTeacherContext)
    const userprofileCtx = useContext(UserProfileContext)
    const user_class_id = userprofileCtx.userprofile.class_id
    const user_group_id = userprofileCtx.userprofile.group_id
    const timeCtx = useContext(TimeContext)
    const currentActiveLessonData = timeCtx.filterSpecificLesson(class_id)
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (currentActiveLessonData && currentActiveLessonData.duration !== 10000) {
            const interval = setInterval(() => {
                const time = timeCtx.calculateTimeLeft(currentActiveLessonData);
                setTimeLeft(time);
            }, 1000); // Update every second
          
            return () => {
              clearInterval(interval);
            };
        }
      }, [currentActiveLessonData]);


    const handleEditPress = (class_id) => {
        if (tileType === 'Class') {
            groupTeacherCtx.setCurrentClass_id(class_id)
            editHandler(class_id);
        }
        if (group_id) {
            groupTeacherCtx.setCurrentGroup_id(group_id)
            editHandler(group_id, class_id);
        }
        
    };

    function handleTimer(class_id){
        if (user_role === 'teacher') {
            groupTeacherCtx.setCurrentClass_id(class_id)
            groupTeacherCtx.addHandlerFunction('timer')
        }
        else {
            if (currentActiveLessonData) {
                // timeCtx.toggleTimeModal()
                Alert.alert(`Les ${currentActiveLessonData.lesson_number} is bezig, begin met opdrachten oplossen`)
            }
            else{
                Alert.alert('Er is geen timer actief, vraag je docent om een timer te starten')
            }
        }
    }

    const handleDeletePress = (class_id) => {
            deletehHandler(class_id);
    };

    let color = [ColorsBlue.blue1300, ColorsBlue.blue1000]
    if (tileType === 'Class' && user_class_id === class_id) {
        color = [ColorsBlue.blue1300, ColorsBlue.blue600]
    }
    if (tileType === 'Group' && user_group_id === group_id) {
        color = [ColorsBlue.blue1300, ColorsBlue.blue600]
    }


    const timeCondition = currentActiveLessonData  ? (currentActiveLessonData.duration !== 10000 ? `Les ${currentActiveLessonData.lesson_number} - ${timeCtx.formatTimeLeft(timeLeft)}` : 'Les actief zonder tijd') : `geen les actief`
    
    return(
        <Pressable 
        style = {styles.chatBox}
        onPress={navigationHandler}
        >
            <LinearGradient 
                colors={color}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style = {styles.colorGradient}
            >
                <View style = {[styles.textBox, {marginLeft: user_role === 'teacher' ? 25: 20, padding: tileType === 'Group' ? 0 : 10, justifyContent: tileType === 'Group' ? null : 'center'}]}>
                    <Text style = {styles.text}>{title}{groupNames}</Text>
                    {tileType === 'Class' && <Text style = {styles.description}>{timeCondition}</Text>}
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
                    {tileType === 'Class' &&
                    <View style = {styles.timer}>
                        <Icon
                        icon = "timer-outline"
                        size = {30}
                        color = {currentActiveLessonData ? ColorsGreen.green400 : ColorsGray.gray400}
                        onPress = {() => handleTimer(class_id)}
                        />
                    </View>
                    }
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


const styles = StyleSheet.create({
    timer: {
        position: 'absolute',
        top: '13%',
        left: '3%'
    },
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
    }
})
