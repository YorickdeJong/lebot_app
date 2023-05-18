import { useContext, useEffect, useState } from "react";
import { GroupTeacherContext } from "../../store/group-teacher-context";
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { BlurView } from "expo-blur";
import Icon from '../Icon';
import { ColorsBlue, ColorsGray, ColorsGreen, ColorsRed } from "../../constants/palet";
import { UserProfileContext } from "../../store/userProfile-context";
import { createTimeLesson, deleteTimeLesson, updateTimeLesson } from "../../hooks/time-lessons.hook";
import { TimeContext } from "../../store/time-context";
import { FlatList } from "react-native-gesture-handler";



function TeacherTimeModal() {
    const groupTeacherCtx = useContext(GroupTeacherContext);
    const class_id = groupTeacherCtx.currentClass_id
    const timeCtx = useContext(TimeContext)
    const currentActiveLessonData = timeCtx.filterSpecificLesson(class_id)
    const [duration, setDuration] = useState('');
    const [lesson, setLesson] = useState(null);
    const userprofileCtx = useContext(UserProfileContext);
    const school_id = userprofileCtx.userprofile.school_id 
    const [createLesson, setCreateLesson] = useState(false)
    const [showDeleteButton, setShowDeleteButton] = useState(false)
    const [currentLessonId, setCurrentLessonId] = useState(null)
    const [noLessonTime, setNoLessonTime] = useState(false)

    useEffect(() => {
        if (currentActiveLessonData) {
            setDuration(currentActiveLessonData.duration.toString());
            setLesson(currentActiveLessonData.lesson_number.toString());
        } else {
            setDuration('');
            setLesson('');
        }
    }, [currentActiveLessonData])


    function adjustLessonHandler(class_id, lesson_number) {
        const lessonData = timeCtx.timeData[0].data.filter((lesson) => lesson.class_id === class_id && lesson.lesson_number === lesson_number)
        setDuration(lessonData[0].duration.toString());
        setLesson(lessonData[0].lesson_number.toString());
        setCurrentLessonId(lessonData[0].id)
        setCreateLesson(!createLesson)
        setShowDeleteButton(true)
    }

    async function handleCreate() {
        timeCtx.setChangedTimeData(false)
        const active = true

        if (!(lesson && lesson <= 9 && (duration || noLessonTime))) {
            Alert.alert('Vul een geldig lesnummer en tijd in')
            return
        }

        
        if (currentActiveLessonData || showDeleteButton) {
            
            try {
                await updateTimeLesson(currentLessonId, class_id, duration, school_id, active, lesson)
                timeCtx.setChangedTimeData(true)
                Alert.alert('Les tijd veranderd!')
            }
            catch (error) {
                console.log(error)
                console.log('failed to update time lessons');
                timeCtx.setChangedTimeData(false)
                Alert.alert('Het is niet gelukt om een tijd voor de klas te veranderen');
            }
        }
        else {
            try {
                const lessonData = timeCtx.timeData[0].data.filter((lessonIndividual) => lessonIndividual.class_id === class_id && lessonIndividual.lesson_number === parseInt(lesson))
                if (lessonData && lessonData.length > 0) {
                    Alert.alert('Deze les bestaat al, kies een ander lesnummer')
                    setShowDeleteButton(false)
                    return;
                }
                await createTimeLesson(class_id, duration, school_id, active, lesson)
                timeCtx.setChangedTimeData(true)
                Alert.alert('Tijd voor klas gezet!')
            } 
            catch (error) {
                console.log('failed to create time lessons');
                timeCtx.setChangedTimeData(false)
                Alert.alert('Het is niet gelukt om een tijd voor de klas te zetten');
            }
        }
        
        setDuration('');
        setLesson(null);
        setNoLessonTime(false)
        setShowDeleteButton(false)
        setCreateLesson(false)
        groupTeacherCtx.addHandlerFunction('close')
            
    }

    async function handleStopLesson() {
        Alert.alert(
            '',
            'Weet u zeker dat u de les wilt stoppen?',
            [
                {
                    text: 'Nee',
                    onPress: () => {console.log('pressed')},
                    style: 'cancel',
                },
                {
                    text: 'Ja',
                    onPress: async () => {
                        try {
                            const active = false
                            await updateTimeLesson(currentLessonId, class_id, duration, school_id, active, lesson)
                            timeCtx.setChangedTimeData(true)
                            Alert.alert('Les gestopt!')
                        }
                        catch (error) {
                            console.log(error)
                            console.log('failed to update time lessons');
                            timeCtx.setChangedTimeData(false)
                            Alert.alert('Het is niet gelukt om een tijd voor de klas te veranderen');
                        }
                        setShowDeleteButton(false)
                        setCreateLesson(false)
                        groupTeacherCtx.addHandlerFunction('close')
                }}
        ])
    }

    async function handleDelete() {
        Alert.alert(
            '',
            'Weet u zeker dat u deze tijd voor de klas wilt verwijderen?',
            [
                {
                    text: 'Nee',
                    onPress: () => {console.log('pressed')},
                    style: 'cancel',
                },
                {
                    text: 'Ja',
                    onPress: async () => {
                        timeCtx.setChangedTimeData(false)
                        try {
                            console.log('Curerentlessonid', currentLessonId)
                            await deleteTimeLesson(currentLessonId)
                            timeCtx.setChangedTimeData(true)
                            Alert.alert('Tijd voor klas verwijderd!')
                        }
                        catch (error) {
                            console.log('failed to delete time lessons');
                            timeCtx.setChangedTimeData(false)
                            Alert.alert('Het is niet gelukt om een tijd voor de klas te verwijderen');
                        }
                        setShowDeleteButton(false)
                        setCreateLesson(false)
                        groupTeacherCtx.addHandlerFunction('close')
                    }}
        ])
    }

    function closeHandler() {
        if (showDeleteButton) {
            setShowDeleteButton(false)
        }
        setCreateLesson(false)  
        groupTeacherCtx.addHandlerFunction('close')
    }

    function switchHandler() {
        if (currentActiveLessonData) {
            setShowDeleteButton(true)
            setCurrentLessonId(currentActiveLessonData.id)
        }
        else {
            setLesson(null)
            setDuration(null)
            setShowDeleteButton(false)
        }
        setCreateLesson(!createLesson)
    }

    function noTimeHandler() {
            Alert.alert(
                '',
                'Als u geen tijd kiest, moet u de les handmatig starten en stoppen. Wilt u doorgaan?',
                [
                    {
                        text: 'Nee',
                        onPress: () => {console.log('pressed')},
                        style: 'cancel',
                    },
                    {
                        text: 'Ja',
                        onPress: () => {
                            setNoLessonTime(true)
                            setDuration(10000)
                    }}
            ])
    }
    //add timerCtx -> check if active for certain class_id, then display green color else gray
    return (
        <Modal
        visible={groupTeacherCtx.timerToggleModal}
        transparent
        animationType="fade"
        >
            <BlurView style={styles.modalContainer} intensity={20}>
                <View style={styles.modal}>
                    <View style={styles.closeIcon}>
                        <Icon 
                        icon="close-circle"
                        size={25}
                        color={ColorsGray.gray700}
                        onPress={() => closeHandler()}
                        />
                    </View>
                        {createLesson &&
                        <>
                            <Text style = {styles.title}>{currentActiveLessonData ? 'Verander Discussie Tijd' : 'Tijd Per Discussie'}</Text>
                            <View style = {{flexDirection: 'row'}}>
                                <TextInput
                                    placeholder={noLessonTime ? 'Geen Tijd' : (duration === '10000' ? 'Zet Tijd Discussie ' :'Tijd')}
                                    placeholderTextColor={ColorsBlue.blue200}
                                    value={duration === '10000' ? '' : duration}
                                    onChangeText={setDuration}
                                    style={[styles.input, {width: 100}]}
                                    keyboardType="number-pad"
                                    editable={noLessonTime ? false : true}
                                />
                                <TouchableOpacity style={styles.timeButton}
                                onPress = {() => noTimeHandler()}>
                                    <Text style={styles.timeText}>Geen Tijd</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                placeholder={'Lesnummer (max 9)'}
                                placeholderTextColor={ColorsBlue.blue200}
                                value={lesson}
                                onChangeText={setLesson}
                                style={styles.input}
                                keyboardType="number-pad"
                            />
                            <TouchableOpacity onPress={() => handleCreate()} style={styles.createButton}>
                                <Text style={styles.buttonText}>{ currentActiveLessonData ? "Verander" : "Start" }</Text>
                            </TouchableOpacity>
                            {showDeleteButton && <TouchableOpacity onPress={() => currentActiveLessonData ? handleStopLesson() : handleDelete()} style={[styles.createButton, {marginTop: 10, backgroundColor: ColorsBlue.error300, shadowOpacity: 0.7}]}>
                                <Text style={styles.buttonText}>{ currentActiveLessonData ? "Stop Les" : "Verwijder" }</Text>
                            </TouchableOpacity>}
                        </>
                        }
                        {!createLesson && 
                            <>
                        <Text style={styles.title}>Les Tijd Overzicht</Text>
                        {timeCtx.timeData.length > 0 &&
                            <FlatList
                            style = {{width: '100%'}}
                                data={timeCtx.timeData[0].data.filter(time => time.class_id === class_id)}
                                renderItem={({ item: time, index }) => (
                                    <TouchableOpacity style={[styles.lessonButton, { backgroundColor: time.active ? ColorsGreen.green900 : ColorsRed.red900 }]}
                                        onPress={() => adjustLessonHandler(time.class_id, time.lesson_number)}
                                        key={index}
                                    >
                                            <Text style={styles.description}>Les {time.lesson_number}: {time.duration === 10000 ? 'Geen tijd' : time.duration + ' min'} {time.active ? "(Bezig)" : "(Klaar)"}</Text>
                                            <View  style = {{position: 'absolute', right: '2%', top: '25%'}}>
                                                <Icon 
                                                icon="close-circle"
                                                size={20}
                                                color={ColorsGray.gray700}
                                                onPress={() => {setCurrentLessonId(time.id), handleDelete()}}
                                                />
                                            </View>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(time, index) => index.toString()}
                            />
                        }
                    </>
                }
                </View>

            <TouchableOpacity onPress={() => switchHandler()} style={[styles.createButton, {marginTop: 10, backgroundColor: ColorsBlue.error300, shadowOpacity: 0.7, width: '70%'}]}>
                <Text style={styles.buttonText}>{ createLesson ? "Overzicht" : (currentActiveLessonData ? "Verander Actieve Les" : "Nieuwe Les" )}</Text>
            </TouchableOpacity> 
            </BlurView>
        </Modal>
    )
}

export default TeacherTimeModal


const styles = StyleSheet.create({
    timeButton: {
        width: 75,
        backgroundColor: ColorsBlue.blue800,
        marginLeft: 5,
        marginBottom: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 1,
        borderWidth: 1,
        borderColor: ColorsBlue.blue1000,
    },
    timeText: {
        color: ColorsGray.gray100,
        fontSize: 13,
        textAlign: 'center',
    },
    lessonButton: {
        width: '90%',
        height: 40,
        backgroundColor: ColorsBlue.blue700,
        borderRadius: 5,
        justifyContent: 'center',
        alignSelf: 'center',
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 5,
        marginVertical: 5
    },
    description: {
        color: ColorsGray.gray100,
        fontSize: 14,
        marginRight: 20,
        marginLeft: 15
    },
    title: {
        fontSize: 20, 
        color: ColorsBlue.blue50, 
        marginBottom: 15,
        textShadowColor: ColorsBlue.blue1400,
        textShadowOffset: { height: 3, width: 1 },
        textShadowRadius: 4,
    },
    modal: {
        width: '70%',
        maxHeight: 280,
        borderRadius: 5,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
        backgroundColor: ColorsBlue.blue1100,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
        padding: 20,
        alignItems: 'center',
    },
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: 180,
        color: ColorsBlue.blue50,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 4
    },
    createButton: {
        backgroundColor: '#4a90e2',
        borderRadius: 5,
        padding: 10,
        width: 180,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 4
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },    
    closeIcon: {
        position: 'absolute',
        top: 5,
        left: 5,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
    }
})