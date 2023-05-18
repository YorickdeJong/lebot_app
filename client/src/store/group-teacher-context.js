import {  useState, createContext, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorsBlue, ColorsGray } from '../constants/palet';

export const GroupTeacherContext = createContext({
    groupInfo: '',
    toggleModal: false,
    classInfo: [],
    currentGroup_id: '',
    currentClass_id: '',
    groupTypeData: [],
    timerToggleModal: false,
    addHandlerFunction: () => {},
    addClassArrayHandler: (classrooms) => {},
    addClassHandler: (classroom) => {},
    addGroupArrayHandler: (groups) => {},
    addGroupHandler: (group) => {},
    editClassHandler: (classroom) => {},
    editGroupHandler: (group) => {},
    deleteClassHandler: (class_id) => {},
    deleteGroupHandler: (group_id) => {},
    setCurrentGroup_id: (group_id) => {},
    setCurrentClass_id: (class_id) => {},
    getClassInfoById: (class_id) => {},
    getGroupInfoById: (group_id) => {},
    setGroupTypeData: (groupTypeData) => {},
    getAllGroupsInClass: (class_id) => {},
    checkIfGroupsAreEmpty: (class_id) => {},
    checkIfGroupIsEmpty: (group_id) => {},
    checkIfClassIsEmpty: (class_id) => {},
    
})

function GroupTeacherContextProvider({ children }) {
    const [toggleModal, setToggleModal] = useState({ isToggle: false, type: "" });
    const [timerToggleModal, setTimerToggleModal] = useState(false);
    const [groupInfo, setGroupInfo] = useState([]);
    const [classInfo, setClassInfo] = useState([]);
    const [currentGroup_id, setCurrentGroup_id] = useState('');
    const [currentClass_id, setCurrentClass_id] = useState('');
    const [groupTypeData, setGroupTypeData] = useState([]);



    useEffect(() => {
        async function loadStoredData() {
            try {
                const storedGroupInfo = await AsyncStorage.getItem("groupInfo");
                const storedClassInfo = await AsyncStorage.getItem("classInfo");
    
                if (storedGroupInfo) {
                    setGroupInfo(JSON.parse(storedGroupInfo));
                }
    
                if (storedClassInfo) {
                    setClassInfo(JSON.parse(storedClassInfo));
                }
            } 
            catch (error) {
                console.log('Error loading data from AsyncStorage:', error);
            }
        }
    
        loadStoredData();
    }, []);

    function addHandlerFunction(type) {
        console.log("pressed");
        //TODO add group to group context and add group to database
        //Toggle on modal
        switch (type) {
            case "create":
                setToggleModal({ isToggle: !toggleModal.isToggle, type: "create" });
                break;
            case "edit":
                setToggleModal({ isToggle: !toggleModal.isToggle, type: "edit" });
                break;
            case "close":
                console.log('check close')
                setToggleModal({ isToggle: false, type: "" });
                setTimerToggleModal(false);
                break;
            case 'timer':
                console.log('set timer')
                setTimerToggleModal(true);
                break;
            }
    }
            
    function addGroupArrayHandler(groups){
        setGroupInfo(groups)
    }

    function addClassArrayHandler(classrooms){
        setClassInfo(classrooms)
    }

    function addGroupHandler(group) {
        setGroupInfo((prevState) => {
            const newGroupInfo = [...prevState, group];
            AsyncStorage.setItem("groupInfo", JSON.stringify(newGroupInfo));
            return newGroupInfo;
        });
        setToggleModal({ isToggle: !toggleModal.isToggle, type: "" });
    }
    
    function editGroupHandler(group) {
        setGroupInfo((prevState) => {
            const updatedGroupInfo = prevState.map((item) => {
                if (item.group_id === group.group_id) {
                    return { ...item, ...group };
                } else {
                    return item;
                }
            });
    
            AsyncStorage.setItem("groupInfo", JSON.stringify(updatedGroupInfo));
            return updatedGroupInfo;
        });
        setToggleModal({ isToggle: !toggleModal.isToggle, type: "" });
    }
    
    function deleteGroupHandler(group_id) {
        setGroupInfo((prevState) => {
            const updatedGroupInfo = prevState.filter(group => group.group_id !== group_id);
            AsyncStorage.setItem("groupInfo", JSON.stringify(updatedGroupInfo));
            return updatedGroupInfo;
        });
    }
    
    function addClassHandler(classroom) {
        setClassInfo((prevState) => {
            const newClassInfo = [...prevState, classroom];
            AsyncStorage.setItem("classInfo", JSON.stringify(newClassInfo));
            return newClassInfo;
        });
        setToggleModal({ isToggle: !toggleModal.isToggle, type: "" });
    }
    
    function editClassHandler(classroom) {
        setClassInfo((prevState) => {
            const updatedClassInfo = prevState.map((item) => {
                if (item.class_id === classroom.class_id) {
                    return { ...item, ...classroom };
                } else {
                    return item;
                }
            });
    
            AsyncStorage.setItem("classInfo", JSON.stringify(updatedClassInfo));
            return updatedClassInfo;
        });
        setToggleModal({ isToggle: !toggleModal.isToggle, type: "" });
    }
    
    function deleteClassHandler(class_id) {
        setClassInfo((prevState) => {
            const updatedClassInfo = prevState.filter(classroom => classroom.class_id !== class_id);
            AsyncStorage.setItem("classInfo", JSON.stringify(updatedClassInfo));
            return updatedClassInfo;
        });
    }
    
    function deleteGroupsInClassHandler(class_id) {
        setGroupInfo((prevState) => {
            const updatedGroupInfo = prevState.filter(group => group.class_id !== group_id);
            AsyncStorage.setItem("groupInfo", JSON.stringify(updatedGroupInfo));
            return updatedGroupInfo;
        });
    }

    function getClassInfoById(class_id) {
        const classObject = classInfo.find((classItem) => classItem.class_id === class_id);
        return classObject;
    }
    
    function getGroupInfoById(group_id) {
        const groupObject = groupInfo.find((groupItem) => groupItem.group_id === group_id);
        
        return groupObject;
    }

    function getAllGroupsInClass(class_id) {
        const groupObject = groupInfo.filter((groupItem) => groupItem.class_id === class_id);
        if (groupObject.length > 0) {
            return groupObject;
        }
        return false;
    }

    function checkIfGroupsAreEmpty(class_id) {
        const groupObject = groupInfo.filter((groupItem) => groupItem.class_id === class_id);
        return groupObject.every(group => parseInt(group.current_count, 10) !== 0)
    }

    //check all groups are present
    function checkIfGroupIsEmpty(group_id){
        const groupObject = groupInfo.filter((groupItem) => groupItem.group_id === group_id);
    
        if (groupObject.length === 0){
            return false;
        }
        return parseInt(groupObject[0].current_count, 10) !== 0;
    }

    function checkIfClassIsEmpty(class_id){
        const classObject = classInfo.filter((classItem) => classItem.class_id === class_id);
        return classObject.every(curClass => parseInt(curClass.current_count, 10) !== 0);
    }

    const value = {
        groupInfo,
        toggleModal,
        classInfo,
        currentGroup_id,
        currentClass_id,
        groupTypeData,
        timerToggleModal,
        addHandlerFunction,
        addClassHandler,
        addClassArrayHandler,
        addGroupHandler,
        addGroupArrayHandler,
        editClassHandler,
        editGroupHandler,
        deleteClassHandler,
        deleteGroupHandler,
        setCurrentGroup_id,
        setCurrentClass_id,
        getClassInfoById,
        getGroupInfoById,
        setGroupTypeData,
        getAllGroupsInClass,
        checkIfGroupsAreEmpty,
        checkIfGroupIsEmpty,
        checkIfClassIsEmpty,

    }

    return <GroupTeacherContext.Provider value={value}>{children}</GroupTeacherContext.Provider>
}

export default GroupTeacherContextProvider
