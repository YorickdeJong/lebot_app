import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect } from "react";



export const AssignmentContext = createContext({
    assignments: [],
    initializeAssignments: (assignments) => {},
    addAssignment: (assignment) => {},
    separateMathPhysics: (subject) => {},
    filterSpecificTitle: (title) => {}
})


function AssignmentContextProvider({children}) {
    const [assignments, setAssignments] = useState([]);

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

    const value = {
        assignments: assignments,
        initializeAssignments: initializeAssignments,
        addAssignment: addAssignment,
        separateMathPhysics: separateMathPhysics,
        filterSpecificTitle: filterSpecificTitle,
    }

    return <AssignmentContext.Provider value={value}>{children}</AssignmentContext.Provider>
}

export default AssignmentContextProvider