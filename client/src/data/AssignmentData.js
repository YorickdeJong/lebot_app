import { useContext } from "react";
import { ColorsDarkerBlue, ColorsTile } from "../constants/palet"
import { AssignmentContext } from "../store/assignment-context";
import { AssignmentDetailsContext } from "../store/assignment-Details-context";

const colorsLighter = [
      ColorsTile.blue1000, ColorsTile.blue900,
      ColorsTile.blue700, ColorsTile.blue600,
      ColorsTile.blue500, ColorsTile.blue400,
      ColorsTile.blue300, ColorsTile.blue200
  ];

const colorsDarker = [
      ColorsDarkerBlue.blue1000, ColorsDarkerBlue.blue900,
      ColorsDarkerBlue.blue700, ColorsDarkerBlue.blue600,
      ColorsDarkerBlue.blue500, ColorsDarkerBlue.blue400,
      ColorsDarkerBlue.blue300, ColorsDarkerBlue.blue200
  ];


  
export const assignments = (subject) => {
    const assignmentCtx = useContext(AssignmentContext);
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext)
    let assignmentData;
    let icons;

    switch (subject){
        case 'Physics':
            assignmentData = assignmentCtx.separateMathPhysics(subject);
            icons = ["weight-lifter", "battery-medium", "waves", "car-electric", "magnet-on"];
            break;
        case 'Mathematics':
            assignmentData = assignmentCtx.separateMathPhysics(subject);
            icons = ["vector-curve", "slope-uphill", "vector-line", "math-integral", "math-sin"];
            break;
    }
    
    const uniqueTitles = assignmentData.reduce((acc, curr) => {
        if (!acc[curr.title]) {
            acc[curr.title] = curr;
        }
        return acc;
    }, {});
    
    return Object.values(uniqueTitles).map((assignment, index) => {
        const assignmentTopic = assignmentCtx.filterSpecificTitle(assignment.title)
        const totalCompletedAssignments = assignmentDetailsCtx.getTotalCompletedAssignmentsPerTopic(assignment.title)
        const totalAssignments = assignmentTopic.length;
        const acquiredCurrency = assignmentTopic.reduce((acc, curr, index) => {
            if (index >= totalCompletedAssignments){
                return acc;
            }
            return acc + curr.currency;
        }, 0);

        console.log(acquiredCurrency)
        const totalCurrency = assignmentTopic.reduce((acc, curr) => acc + curr.currency, 0);

        return {
            assignment_id: assignment.assignment_id,
            subject: assignment.subject,
            assignment_number: assignment.assignment_number,
            completionData: {
                totalCompletedAssignments: totalCompletedAssignments,
                totalAssignments: totalAssignments,
                acquiredCurrency: acquiredCurrency,
                totalCurrency: totalCurrency,
            },
            title: assignment.title,
            colorLight: colorsLighter,
            colorDark: colorsDarker,
            icon: icons[index]
        };
    });
};

