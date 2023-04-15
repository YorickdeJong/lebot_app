import CodingQuestionsOne from "../../../components/assignments/screens/assignment_one/CodingQuestionsOne";
import CodingQuestionsTwo from "../../../components/assignments/screens/assignment_two/CodingQuestionsTwo";
import CodingQuestionsThree from "../../../components/assignments/screens/assignment_three/CodingQuestionsThree";

function CodeAnswerScreen({tabIndex, currentIndex, subject}) {

    console.log(`tabIndex: ${tabIndex}`)
    console.log(`currentIndex: ${currentIndex}`)
    const isFocused = tabIndex === currentIndex
    return (
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


