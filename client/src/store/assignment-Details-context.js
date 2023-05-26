import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useEffect, useContext } from "react";
import { createAssignmentsDetail, getGroupAssignmentDetails } from "../hooks/assignmentDetails";
import { UserProfileContext } from "./userProfile-context";
import { set } from "react-native-reanimated";

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
    getTriesAssignmentsPerPhase: (subject, answers) => {},
    getCorrectAnswerCount: (subject, answers) => {},
    getCorrectAndTriesCount: (subject, answers) => {},
});

function AssignmentDetailsContextProvider({ children }) {
    const [assignmentDetails, setAssignmentDetails] = useState([]);
    const [triesAssignmentMultipleChoice, setTriesAssignmentMultipleChoice] = useState([]);
    const [triesAssignmentOpenQuestions, setTriesAssignmentOpenQuestions] = useState([]);
    const userprofile = useContext(UserProfileContext);
    const {class_id, group_id, school_id} = userprofile.userprofile;

    useEffect(() => {
        loadAssignmentDetailsDataFromStorage();
        loadTriesFromStorage();
    }, []);

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

    
    useEffect(() => {
        saveTriesDataToStorage('multipleChoice', triesAssignmentMultipleChoice);
    }, [triesAssignmentMultipleChoice]);

    useEffect(() => {
        saveTriesDataToStorage('openQuestions', triesAssignmentOpenQuestions);
    }, [triesAssignmentOpenQuestions]);

    async function saveTriesDataToStorage(type, data) {
        await AsyncStorage.setItem(`triesAssignment_${type}`, JSON.stringify(data));
    }

    function incrementTriesMultipleChoice(subject, assignment_number, title) {
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
            const assignmentDetailsString = await AsyncStorage.getItem("assignmentDetails");
            if (assignmentDetailsString !== null) {
                const assignmentDetailsJSON = JSON.parse(assignmentDetailsString);
                // const filteredAssignmentOnClassAndGroup = assignmentDetailsJSON.filter((assignment) => assignment.class_id === class_id && assignment.group_id === group_id);
                setAssignmentDetails(assignmentDetailsJSON);
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


    function getCorrectAndTriesCount(subject, assignments) {
        
        let totalCorrect = 0;
        let totalTries = 0;
        const results = [{correct: totalCorrect, tries: totalTries}];
        assignments
            .filter(a => a.subject === subject)
            .forEach(assignment => {
                let correctCount = 0;
                let tries = 0;
                const nonNullMultipleChoiceAnswers = assignment.answers_multiple_choice.filter(answer => answer !== null);
                const nonNullOpenQuestionAnswers = assignment.answers_open_questions.filter(answer => answer !== null);
    
                nonNullMultipleChoiceAnswers.forEach((answerGroup, index) => {
                    tries++; // Increment tries for each answer group
                    
                    if (Array.isArray(answerGroup)) {
                        if (index !== nonNullMultipleChoiceAnswers.length - 1) {
                            return;
                        }
                        answerGroup.forEach(subAnswer => {
                            if (subAnswer.correct) {
                                correctCount++;
                            }
                        });
                    } else {
                        if (answerGroup.correct) {
                            correctCount++;
                        }
                    }
                });
    
                nonNullOpenQuestionAnswers.forEach(answer => {
                    tries++; // Increment tries for each open question answer
                    if (answer && answer.correct) {
                        correctCount++;
                    }
                });
                totalCorrect += correctCount;
                totalTries += tries;
                results.push({correct: totalCorrect, tries: totalTries});
            });
    
        return results;
    }

    function getTriesAssignmentsPerPhase(subject, assignments) {
        let tries = 0;
    
        assignments
            .filter(a => a.subject === subject)
            .map(assignment => {
                const nonNullMultipleChoiceAnswers = assignment.answers_multiple_choice.filter(answer => answer !== null);
                const nonNullOpenQuestionAnswers = assignment.answers_open_questions.filter(answer => answer !== null);
    
                const triesMultipleChoice = nonNullMultipleChoiceAnswers.length;
                const triesOpenQuestions = nonNullOpenQuestionAnswers.length;
    
                tries += triesMultipleChoice + triesOpenQuestions;
            });
    
        return tries;
    }

    function getCorrectAnswerCount(subject, assignments) {
        let correctCount = 0;
    
        assignments
            .filter(a => a.subject === subject)
            .forEach(assignment => {
                const nonNullMultipleChoiceAnswers = assignment.answers_multiple_choice.filter(answer => answer !== null);
                const nonNullOpenQuestionAnswers = assignment.answers_open_questions.filter(answer => answer !== null);
    
                nonNullMultipleChoiceAnswers.forEach((answerGroup, index) => {
                    // If answerGroup is an array, only consider the last subarray.
                    if (Array.isArray(answerGroup)) {
                            // only check last element
                            if (index !== nonNullMultipleChoiceAnswers.length - 1) {
                                return;
                            }
                            answerGroup.map(subAnswer => {
                                //check each element for correctness
                                if (subAnswer.correct) {
                                    correctCount++;
                                }
                            })
                    } else {
                        // If answerGroup is not an array, just check if it's correct.
                        if (answerGroup.correct) {
                            correctCount++;
                        }
                    }
                });
    
                nonNullOpenQuestionAnswers.forEach(answer => {
                    if (answer && answer.correct) {
                        correctCount++;
                    }
                });
            });
    
        return correctCount;
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
        filterTriesAssignmentMultipleChoice,
        getTriesAssignmentsPerPhase,
        getCorrectAnswerCount,
        getCorrectAndTriesCount
    };

    return (
        <AssignmentDetailsContext.Provider value={value}>
        {children}
        </AssignmentDetailsContext.Provider>
    );
}

export default AssignmentDetailsContextProvider;