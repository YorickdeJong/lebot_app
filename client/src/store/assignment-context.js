import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect } from "react";



export const AssignmentContext = createContext({
    assignments: [],
    assignmentImage: {},
    initializeAssignments: (assignments) => {},
    addAssignment: (assignment) => {},
    separateMathPhysics: (subject) => {},
    filterSpecificTitle: (title) => {},
    setAssignmentImageHandler: (assignmentImage) => {},
    setTitleImageHandler: (titleImage) => {},
})


function AssignmentContextProvider({children}) {
    const [assignments, setAssignments] = useState([]);
    const [assignmentImage, setAssignmentImage] = useState({
        title: '',
        assignment_number: 0,
    });

    useEffect(() => {
        loadAssignmentDataFromStorage();
    }, []);


    async function loadAssignmentDataFromStorage() {
        try {
            const assignmentsJSON = await AsyncStorage.getItem("assignments");
            if (assignmentsJSON !== null) {
                setAssignments(JSON.parse(assignmentsJSON));
            }
        } 
        catch (error) {
            console.error("Error loading assignments from storage:", error);
        }
    }

    async function saveAssignmentInStorage(assignments) {
        try {
            const assignmentsJSON = JSON.stringify(assignments);
            await AsyncStorage.setItem("assignments", assignmentsJSON);
            console.log('saved assignments in storage')
        }
        catch (error){
            console.error("Error saving assignments to storage:", error);
        }
    }

    function initializeAssignments(assignmentArray) {
            setAssignments(assignmentArray);
            saveAssignmentInStorage(assignmentArray);
        }

    function addAssignment(assignment) {
        setAssignments(assignments => [...assignments, assignment]);
        saveAssignmentInStorage(assignments => [...assignments, assignment]);
    }

    function separateMathPhysics(subject){
        return assignments.filter((item) => item.subject === subject);

    }

    function filterSpecificTitle(title) {
        return assignments.filter((item) => item.title === title);
    }

    function setAssignmentImageHandler(assignmentImage) {
        setAssignmentImage(prevState => ({...prevState, assignment_number: assignmentImage}));
    }

    function setTitleImageHandler(titleImage) {
        setAssignmentImage(prevState => ({...prevState, title: titleImage}));
    }

    const value = {
        assignments: assignments,
        assignmentImage,
        initializeAssignments: initializeAssignments,
        addAssignment: addAssignment,
        separateMathPhysics: separateMathPhysics,
        filterSpecificTitle: filterSpecificTitle,
        setAssignmentImageHandler,
        setTitleImageHandler
    }

    return <AssignmentContext.Provider value={value}>{children}</AssignmentContext.Provider>
}

export default AssignmentContextProvider