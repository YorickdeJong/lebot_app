import { useContext } from "react";
import { colorRGB, ColorsBlue, ColorsBronze, ColorsDarkerBlue, ColorsDarkerDiamond, ColorsDarkerGreen, ColorsGreen, ColorsLighterGold, ColorsOrange, ColorsPurple, ColorsRed, ColorsSun, ColorsTile, StoreColors } from "../constants/palet"
import { AssignmentContext } from "../store/assignment-context";
import { AssignmentDetailsContext } from "../store/assignment-Details-context";

const lightColors = colorRGB(ColorsBlue.blue1100, ColorsBlue.blue500, 15);
const darkColors = colorRGB(ColorsBlue.blue1100, ColorsBlue.blue900, 15);

// appends icons to assignment data and makes new object
export const assignments = (subject) => {
    const assignmentCtx = useContext(AssignmentContext);
    const assignmentDetailsCtx = useContext(AssignmentDetailsContext)
    let assignmentData;
    let icons;

    //selects icons and sorts data based on id
    switch (subject){
        case 'MOTOR':
            assignmentData = assignmentCtx.separateSubject(subject);
            assignmentData = assignmentData.sort((a, b) => a.assignment_id - b.assignment_id)
            icons = ["engine-outline", "code-equal", "code-json", "file-document-outline"];
            break;
        case 'LED':
            assignmentData = assignmentCtx.separateSubject(subject);
            assignmentData = assignmentData.sort((a, b) => a.assignment_id - b.assignment_id)
            icons = ["lightbulb-variant-outline", "function", "code-json", "file-document-outline"];
            break;
        case 'CAR':
            assignmentData = assignmentCtx.separateSubject(subject);
            assignmentData = assignmentData.sort((a, b) => a.assignment_id - b.assignment_id)
            icons = ["car-outline", "repeat-variant", "code-json", "file-document-outline"];
            break;
    }
    


    const uniqueTitles = assignmentData.reduce((acc, curr) => {
        if (!acc[curr.title]) {
            acc[curr.title] = curr
        }
        return acc;
    }, {});
    
    return Object.values(uniqueTitles).map((assignment, index) => {
        console.log(`title ${assignment.title}`)
        const assignmentTopic = assignmentCtx.filterSpecificTitle(assignment.title)
        const totalCompletedAssignments = assignmentDetailsCtx.getTotalCompletedAssignmentsPerTopic(assignment.title)
        const totalAssignments = assignmentTopic.length;
        const acquiredCurrency = assignmentTopic.reduce((acc, curr, index) => {
            if (index >= totalCompletedAssignments){
                return acc;
            }
            return acc + curr.currency;
        }, 0);

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
            colorLight: lightColors,
            colorDark: darkColors,
            icon: icons[index]
        };
    });
};


export const assignmentPlanetImages = [
    require("./../../assets/planets/sun.jpg"),
    require("./../../assets/planets/mercury.jpg"),
    require("./../../assets/planets/venus.png"),
    require("./../../assets/planets/earth.jpg"),
    require("./../../assets/planets/mars.jpg"),
    require("./../../assets/planets/neptune.jpg"),
    require("./../../assets/planets/pluto.jpg"),
]

export const planetColors = [
    [ColorsLighterGold.gold600, ColorsRed.red400, ColorsBronze.bronze300, ColorsOrange.orange500, ColorsBlue.blue700,ColorsPurple.purple400, ColorsTile.blue500, ColorsDarkerDiamond.diamond500, ColorsDarkerGreen.green300], 
    [StoreColors.gold800, ColorsRed.red1000, ColorsBronze.bronze1000,  ColorsOrange.orange900, ColorsBlue.blue1150, ColorsPurple.purple1000, ColorsTile.blue1000, ColorsDarkerDiamond.diamond1000, ColorsDarkerGreen.green900],
]