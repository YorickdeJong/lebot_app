import InformationCodingScreenOne from "../../../components/assignments/screens/assignment_one/informationCodingScreenOne";
import InformationCodingScreenTwo from "../../../components/assignments/screens/assignment_two/informationCodingScreenTwo";
import InformationCodingScreenThree from "../../../components/assignments/screens/assignment_three/informationCodingScreenThree";




function CodingScreen({tabIndex, currentIndex, subject}){
    const isFocused = tabIndex === currentIndex;

    return (
        isFocused &&
        <>
            {subject === 'MOTOR' && <InformationCodingScreenOne 
            isFocused={isFocused}
            />}
            {subject === 'LED' && <InformationCodingScreenTwo
            isFocused={isFocused}
            />}
            {subject === 'CAR' && <InformationCodingScreenThree
            isFocused={isFocused}
            />}
        </>
    )
}

export default CodingScreen