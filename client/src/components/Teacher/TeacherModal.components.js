


// BlurModal.js
import { BlurView } from 'expo-blur';
import {useContext, useState} from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, Alert } from 'react-native';
import { ColorsBlue, ColorsGray } from '../../constants/palet';
import Icon from '../Icon';
import { GroupTeacherContext } from '../../store/group-teacher-context';
import { UserProfileContext } from '../../store/userProfile-context';
import { createClass, updateClass } from '../../hooks/classes.hooks';
import { createGroup, updateGroup } from '../../hooks/groups.hooks';

function TeacherModal({tileType, setDbUpdate }) {
    const [name, setName] = useState('');
    const [maxParticipants, setMaxParticipants] = useState('');
    const groupTeacherCtx = useContext(GroupTeacherContext);
    const userprofileCtx = useContext(UserProfileContext);
    const type = groupTeacherCtx.toggleModal.type

    const handleCreate = async (groupType) => {
        if (name === '' || maxParticipants === '') {
            console.log('check')
            Alert.alert("Vul alle velden in")
            return
        }
        setDbUpdate(false)
        if (tileType === "Class"){
            let classroom;
            //TODO: add backend class creation here
            switch(groupType){
                case 'create':
                    try {
                        const { class_id } = await createClass({ name, school_id: userprofileCtx.userprofile.school_id, max_count: maxParticipants });
                        classroom = {name, maxParticipants, class_id: class_id, school_id: userprofileCtx.userprofile.school_id} // school_id
                        groupTeacherCtx.addClassHandler(classroom)
                        setDbUpdate(true)
                        Alert.alert('Klas aangemaakt')
                        return
                    }
                    catch(error) {
                        if (error.response && error.response.status === 404) {
                            setDbUpdate(false)
                            Alert.alert('Klas bestaat al')
                            return
                        } 
                        else {
                            setDbUpdate(false)
                            Alert.alert('Er is iets misgegaan bij het maken van de klas')
                            return
                        }
                    }
                case 'edit':    
                    try{
                        const currentClass_id = groupTeacherCtx.currentClass_id
                        const school_id = userprofileCtx.userprofile.school_id
                        await updateClass({ class_id: currentClass_id, school_id, name, max_count: maxParticipants})
                        classroom = {name, maxParticipants, class_id: currentClass_id, school_id: userprofileCtx.userprofile.school_id}
                        groupTeacherCtx.editClassHandler(classroom)
                        setDbUpdate(true)
                        Alert.alert('Klas aangepast')
                        return;
                    }
                    catch(error) {
                            console.log(error)
                            setDbUpdate(false)
                            Alert.alert('Er is iets misgegaan bij het updaten van de klas')
                            return
                    }
            }
        }
        else {
            let group;
            let currentClass_id;
            let school_id;
            switch (groupType) {
                case 'create':
                    school_id = userprofileCtx.userprofile.school_id;
                    currentClass_id = groupTeacherCtx.currentClass_id;
                    try {
                        const { group_id } = await createGroup({
                            name,
                            school_id,
                            max_count: maxParticipants,
                            class_id: currentClass_id,
                        });
                        group = {
                            name,
                            maxParticipants,
                            group_id: group_id,
                            school_id,
                            class_id: currentClass_id,
                        };
                        groupTeacherCtx.addGroupHandler(group);
                        setDbUpdate(true)
                        Alert.alert('Groep aangemaakt')
                    } 
                    catch (error) {
                        if (error.response && error.response.status === 404) {
                            setDbUpdate(false)
                            Alert.alert('Groep bestaat al')
                            return
                        } 
                        else {
                            setDbUpdate(false)
                            Alert.alert('Er is iets misgegaan bij het maken van de groep')
                            return
                        }
                    }
                    break;

                case 'edit':
                    try{
                        const currentGroup_id = groupTeacherCtx.currentGroup_id;
                        currentClass_id = groupTeacherCtx.currentClass_id;
                        school_id = userprofileCtx.userprofile.school_id;
                        await updateGroup({
                            group_id: currentGroup_id,
                            name,
                            max_count: maxParticipants,
                            class_id: currentClass_id,
                            school_id,
                        });
                    
                        group = {
                            name,
                            maxParticipants,
                            group_id: currentGroup_id,
                            school_id: school_id,
                            class_id: currentClass_id,
                        }; 
                        groupTeacherCtx.editGroupHandler(group);
                        setDbUpdate(true)
                        Alert.alert('Groep aangepast')
                        break;
                    }
                    catch(error) {
                        console.log(error)
                        setDbUpdate(false)
                        Alert.alert('Er is iets misgegaan bij het updaten van de groep')
                        return
                    }
                }
          }
    };

    return (
        <Modal
        visible={groupTeacherCtx.toggleModal.isToggle}
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
                        onPress={groupTeacherCtx.addHandlerFunction.bind(this, 'close')}
                        />
                    </View>
                    <TextInput
                    placeholder={tileType === 'Class' ? "Klasnaam" : 'Groepnaam'}
                    placeholderTextColor={ColorsBlue.blue200}
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    />
                    <TextInput
                    placeholder="Aantal deelnemers"
                    placeholderTextColor={ColorsBlue.blue200}
                    value={maxParticipants}
                    onChangeText={setMaxParticipants}
                    keyboardType="number-pad"
                    style={styles.input}
                    />
                    <TouchableOpacity onPress={handleCreate.bind(this, type)} style={styles.createButton}>
                        <Text style={styles.buttonText}>{type === 'create' ?  "Create" : "Edit" }</Text>
                    </TouchableOpacity>
                </View>
            </BlurView>
        </Modal>
    );
};



export default TeacherModal;

const styles = StyleSheet.create({
    modal: {
        width: '70%',
        height: 200,
        borderRadius: 5,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
        backgroundColor: ColorsBlue.blue1100,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center'
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
        color: ColorsBlue.blue50
      },
    createButton: {
        backgroundColor: '#4a90e2',
        borderRadius: 5,
        padding: 10,
        width: 180
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