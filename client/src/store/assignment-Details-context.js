import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect } from "react";
import { createAssignmentsDetail } from "../hooks/assignmentDetails";

export const AssignmentDetailsContext = createContext({
    assignmentDetails: [],
    initializeAssignmentDetails: (assignmentDetails) => {},
    addAssignmentDetails: (assignmentDetail) => {},
    getCompletionStatusAssignment: (assignment_number, title) => {},
    getTotalCompletedAssignmentsPerTopic: (title) => {}
});

function AssignmentDetailsContextProvider({ children }) {
    const [assignmentDetails, setAssignmentDetails] = useState([]);

    useEffect(() => {
        loadAssignmentDetailsDataFromStorage();
    }, []);

    async function loadAssignmentDetailsDataFromStorage() {
        try {
            const assignmentDetailsJSON = await AsyncStorage.getItem(
                "assignmentDetails"
            );
            if (assignmentDetailsJSON !== null) {
                setAssignmentDetails(JSON.parse(assignmentDetailsJSON));
            }
        } 
        catch (error) {
            console.error("Error loading assignments details from storage:", error);
        }
    }

    async function saveAssignmentDetailsInStorage(assignmentDetails) {
        try {
            const assignmentsDetailsJSON = JSON.stringify(assignmentDetails);
            await AsyncStorage.setItem("assignmentDetails", assignmentsDetailsJSON);
            console.log("saved assignments Details in storage");
        } 
        catch (error) {
            console.error(
                "Error saving assignments Details to storage:",
                error
            );
        }
    }

    function initializeAssignmentDetails(assignmentDetailsArray) {
        setAssignmentDetails(assignmentDetailsArray);
        saveAssignmentDetailsInStorage(assignmentDetailsArray);
    }

    function addAssignmentDetails(assignmentDetail, assignmentLocalStorage) {
        setAssignmentDetails([...assignmentDetails, assignmentLocalStorage,])

        saveAssignmentDetailsInStorage([...assignmentDetails, assignmentLocalStorage,]);

        createAssignmentsDetail(assignmentDetail)
    }

    function getCompletionStatusAssignment(assignment_number, title){
        const filteredAssignments = assignmentDetails.filter((item) => 
            item.assignment_number === assignment_number && item.title === title
        )
        return filteredAssignments.length > 0;
    }

    function getTotalCompletedAssignmentsPerTopic(title){
        const filteredAssignments = assignmentDetails.filter((item) => 
            item.title === title
        )
        return filteredAssignments.length
    }

    console.log(assignmentDetails)
    const value = {
        assignmentDetails: assignmentDetails,
        initializeAssignmentDetails: initializeAssignmentDetails,
        addAssignmentDetails: addAssignmentDetails,
        getCompletionStatusAssignment: getCompletionStatusAssignment,
        getTotalCompletedAssignmentsPerTopic: getTotalCompletedAssignmentsPerTopic
    };

    return (
        <AssignmentDetailsContext.Provider value={value}>
        {children}
        </AssignmentDetailsContext.Provider>
    );
}

export default AssignmentDetailsContextProvider;