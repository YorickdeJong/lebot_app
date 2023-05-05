import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect } from "react";
import { createAssignmentsDetail } from "../hooks/assignmentDetails";

export const AssignmentDetailsContext = createContext({
    assignmentDetails: [],
    triesAssignmentMultipleChoice: [],
    triesAssignmentOpenQuestions: [],
    initializeAssignmentDetails: (assignmentDetails) => {},
    addAssignmentDetails: (assignmentDetail) => {},
    getCompletionStatusAssignment: (assignment_number, title) => {},
    getTotalCompletedAssignmentsPerTopic: (title) => {},
    incrementTriesMultipleChoice: (subject, assignment_number) => {},
    incrementTriesOpenQuestions: (subject, assignment_number) => {},
    filterTriesAssignmentMultipleChoice: (subject, assignment_number) => {},
});

function AssignmentDetailsContextProvider({ children }) {
    const [assignmentDetails, setAssignmentDetails] = useState([]);
    const [triesAssignmentMultipleChoice, setTriesAssignmentMultipleChoice] = useState([]);
    const [triesAssignmentOpenQuestions, setTriesAssignmentOpenQuestions] = useState([]);

    useEffect(() => {
        loadAssignmentDetailsDataFromStorage();
        loadTriesFromStorage();
    }, []);

    useEffect(() => {
        saveTriesDataToStorage('multipleChoice', triesAssignmentMultipleChoice);
    }, [triesAssignmentMultipleChoice]);

    useEffect(() => {
        saveTriesDataToStorage('openQuestions', triesAssignmentOpenQuestions);
    }, [triesAssignmentOpenQuestions]);

    async function saveTriesDataToStorage(type, data) {
        await AsyncStorage.setItem(`triesAssignment_${type}`, JSON.stringify(data));
    }

    async function loadTriesFromStorage() {
        const storedMultipleChoiceTries = await AsyncStorage.getItem('triesAssignment_multipleChoice');
        const storedOpenQuestionsTries = await AsyncStorage.getItem('triesAssignment_openQuestions');

        if (storedMultipleChoiceTries) {
            setTriesAssignmentMultipleChoice(JSON.parse(storedMultipleChoiceTries));
        }

        if (storedOpenQuestionsTries) {
            setTriesAssignmentOpenQuestions(JSON.parse(storedOpenQuestionsTries));
        }
    }

    function incrementTriesMultipleChoice(subject, assignment_number, title) {
        console.log('subject')
        setTriesAssignmentMultipleChoice((prevTries) => {
            const existingTry = prevTries.find(
                (t) =>
                    t.subject === subject && t.assignment_number === assignment_number
            );

            if (existingTry) {
                const updatedTries = prevTries.map((t) =>
                    t.subject === subject && t.assignment_number === assignment_number
                        ? {
                              ...t,
                              tries: t.tries + 1,
                          }
                        : t
                );
                return updatedTries;
            } 
            else {
                const newTry = {
                    tries: 1,
                    subject,
                    title,
                    assignment_number,
                };
                return [...prevTries, newTry];
            }
        });
    }

    function incrementTriesOpenQuestions(subject, assignment_number, title) {
        console.log('subject')
        setTriesAssignmentOpenQuestions((prevTries) => {
            const existingTry = prevTries.find(
                (t) =>
                    t.subject === subject && t.assignment_number === assignment_number
            );

            if (existingTry) {
                const updatedTries = prevTries.map((t) =>
                    t.subject === subject && t.assignment_number === assignment_number
                        ? {
                              ...t,
                              tries: t.tries + 1,
                          }
                        : t
                );
                return updatedTries;
            } 
            else {
                const newTry = {
                    tries: 1,
                    subject,
                    title,
                    assignment_number,
                };
                return [...prevTries, newTry];
            }
        });
    }

    function filterTriesAssignmentMultipleChoice(subject, assignment_number, title) {
        const filteredTries = triesAssignment.filter(
            (t) =>
                t.subject === subject &&
                t.assignment_number === assignment_number &&
                t.title === title
        );
        return filteredTries[0] || null ;
    }

    async function loadAssignmentDetailsDataFromStorage() {
        try {
            const assignmentDetailsJSON = await AsyncStorage.getItem("assignmentDetails");
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
            console.error("Error saving assignments Details to storage:", error);
        }
    }

    function initializeAssignmentDetails(assignmentDetailsArray) {
        setAssignmentDetails(assignmentDetailsArray);
        saveAssignmentDetailsInStorage(assignmentDetailsArray);
    }

    async function addAssignmentDetails(assignmentDetail) {
        console.log('assignment detail', assignmentDetail)
        const newAssignmentDetails = [...assignmentDetails, assignmentDetail];
        setAssignmentDetails(newAssignmentDetails);
        await saveAssignmentDetailsInStorage(newAssignmentDetails);
        await createAssignmentsDetail(assignmentDetail);
    }

    function getCompletionStatusAssignment(assignment_number, title) {
        return false;
    }

    function getTotalCompletedAssignmentsPerTopic(title) {
        const filteredAssignments = 0;
        return filteredAssignments;
    }

    const value = {
        assignmentDetails,
        triesAssignmentMultipleChoice,
        triesAssignmentOpenQuestions,
        initializeAssignmentDetails,
        addAssignmentDetails,
        getCompletionStatusAssignment,
        getTotalCompletedAssignmentsPerTopic,
        incrementTriesMultipleChoice,
        incrementTriesOpenQuestions,
        filterTriesAssignmentMultipleChoice
    };

    return (
        <AssignmentDetailsContext.Provider value={value}>
        {children}
        </AssignmentDetailsContext.Provider>
    );
}

export default AssignmentDetailsContextProvider;