import InformationBuildScreenOne from "../../../components/assignments/screens/assignment_one/InformationBuildScreenOne"
import InformationBuildScreenTwo from "../../../components/assignments/screens/assignment_two/InformationBuildScreenTwo";
import InformationBuildScreenThree from "../../../components/assignments/screens/assignment_three/InformationBuildScreenThree";

function BuildScreen({tabIndex, currentIndex, subject}){
    const isFocused = tabIndex === currentIndex;

    
    return (
    <>
        {subject === 'MOTOR' && <InformationBuildScreenOne
        isFocused={isFocused}
        />}
        {subject === 'LED' && <InformationBuildScreenTwo 
        isFocused={isFocused}
        />}
        {subject === 'CAR' && <InformationBuildScreenThree
        isFocused={isFocused}
        />}
    </>
    )
}

export default BuildScreen
