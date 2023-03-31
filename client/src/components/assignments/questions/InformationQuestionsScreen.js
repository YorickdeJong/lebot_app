import { useEffect, useState } from "react";
import { ASSIGNMENT_EXPLANATION } from "../../../data/InitialAssignmentExplanation";
import IntroScreenQuestions from "./IntroScreenQuestions";
import Questions from "./Questions";


function InformationQuestionsScreen({assignmentTopic, assignmentNumber, isFocused}){
    const [slideCount, setSlideCount] = useState(0);
    const [typing, setTyping] = useState(true);
    //upon changing to this screen, set the thread id to the first thread id

    console.log(`check InformationQuestionsScreen`)

    useEffect(() => {
        console.log(slideCount)
    }, [slideCount])
    
    
    function nextSlideHandler(){
        console.log(`next slide handled`)
        setSlideCount(slideCount + 1);
        setTyping(true);
    }

    function prevSlideHandler(){
        console.log(`prev slide handled`)
        setSlideCount(slideCount - 1);
        setTyping(true);
    }

    const questionOne = "Welke windmolen voldoet niet aan tenminste 3 eisen? Geef de eisen waaraan niet voldaan wordt door deze windmolen. Verder is de fabrikant ook opzoek naar de windmolen die het beste functioneerd. Geef hiervoor ook het nummer van de windmolen en aan welke eisen deze voldoet.";
    return (
        <>
        {slideCount === 0  && (
            <IntroScreenQuestions 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONS_1.answer}
            thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONS_1.thread_id}
            title = "Vragen Opdracht"
            description = "In dit deel worden jouw engineering skills getest. Wees creatief en denk goed na over de opdracht."
            isFocused={isFocused}
            /> //Add intro screen here
        )}
        {slideCount === 1  && (
            <IntroScreenQuestions 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONS_1.answer}
            thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONS_1.thread_id}
            title = "Eisen Windmolen"
            description = {`De eisen voor het goed functioneren van een windmolen zijn:\n\n1. De maximum snelheid ligt tussen de 0.3 en 0.4 m/s\n\n2. De snelheid is constant na 1 seconden\n\n3. De efficientie ligt boven de 60%.\n\n4. De afgelegde afstand per rotatie is 2 meter.\n\n5. De milieu impact is niet hoger dan 2.`}
            isFocused={isFocused} />
        )}
        {slideCount === 2  && (
            <Questions
            title = "Eisen Windmolen"
            description = {`De eisen voor het goed functioneren van een windmolen zijn:\n\n1. De maximum snelheid ligt tussen de 0.3 en 0.4 m/s\n\n2. De snelheid is constant na 1 seconden\n\n3. De efficientie ligt boven de 60%.\n\n4. De afgelegde afstand per rotatie is 2 meter.\n\n5. De milieu impact is niet hoger dan 2.`} 
            question={questionOne}
            assignmentTopic={assignmentTopic}
            assignmentNumber={assignmentNumber}
            isFocused={isFocused}
            />
        )} 
        </>
    )

}

export default InformationQuestionsScreen