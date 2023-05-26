import CodingQuestionsOne from "../../../components/assignments/screens/assignment_one/CodingQuestionsOne";
import CodingQuestionsTwo from "../../../components/assignments/screens/assignment_two/CodingQuestionsTwo";
import CodingQuestionsThree from "../../../components/assignments/screens/assignment_three/CodingQuestionsThree";

function CodeAnswerScreen({tabIndex, currentIndex, subject}) {
    const isFocused = tabIndex === currentIndex

    return (
        isFocused &&
        <>
            {subject === 'MOTOR' &&<CodingQuestionsOne
            isFocused = {isFocused}/>}
            {subject === 'LED' &&<CodingQuestionsTwo
            isFocused = {isFocused}/>}
            {subject === 'CAR' &&<CodingQuestionsThree
            isFocused = {isFocused}/>}
        </>
    )
}


export default CodeAnswerScreen


