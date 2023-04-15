import React, { useState, useEffect, useRef, } from 'react';
import { Animated, Keyboard,  StyleSheet,} from 'react-native';
import { ASSIGNMENT_EXPLANATION } from '../../../../data/InitialAssignmentExplanation';
import BatteryScreen from '../../BuildComponent.js/BatteryScreen';
import IntroScreen from '../../BuildComponent.js/IntroScreen';
import CodingExample from '../../CodingComponent.js/CodingExample';
import ExampleExercise from '../../CodingComponent.js/ExampleExercise';



function InformationCodingScreenThree({isFocused}) {
    const [slideCount, setSlideCount] = useState(0);
    const [typing, setTyping] = useState(true);

    //upon changing to this screen, set the thread id to the first thread id

    console.log(`check CodingScreen`)

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


    return (
        <>
        {
            slideCount === 0  && (
            <BatteryScreen 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            slideCount={slideCount}
            setTyping={setTyping}
            typing={typing}
            message={ASSIGNMENT_EXPLANATION.CODINGSCREEN_1}
            title="Coderen Wat Is Dat?"
            description="In dit deel ga jij je eerste code schrijven waarmee je de motoren kan bedienen. Wist je dat coderen op bijna elke universitaire studie wordt gegeven tegenwoordig?"
            video={require('./../../../../../assets/coderenIntro.mp4')}
            isFocused={isFocused}
            />
            )          
        }
        {
            slideCount === 1 && 
            <CodingExample 
                nextSlideHandler={nextSlideHandler}
                prevSlideHandler={prevSlideHandler}
                slideCount={slideCount}
                setTyping={setTyping}
                typing={typing}
                message={ASSIGNMENT_EXPLANATION.CODINGSCREEN_2}
                title = "Aan en Uit Schakelen"
                description = "Coderen?? Waarom hebben we dat nodig? Coderen is één van de handigste tools die je kan bezitten. Je komt er in het dagelijksleven het meest mee in aanraking, dus waarom zou je niet willen leren hoe het werkt?"
                isFocused={isFocused}
            />
        }
        {
            slideCount === 2 && 
            <BatteryScreen 
                nextSlideHandler={nextSlideHandler}
                prevSlideHandler={prevSlideHandler}
                slideCount={slideCount}
                setTyping={setTyping}
                typing={typing}
                message={ASSIGNMENT_EXPLANATION.CODINGSCREEN_3}
                video = {require('./../../../../../assets/ifelse.mp4')}
                title = "Jouw Eerste Code"
                description = "In dit deel leer je hoe if else statements werken. Dit is een van de belangrijkste onderdelen van het coderen. Je kan hiermee bijvoorbeeld de lamp uit het vorige deel laten branden als het donker is. If else statements kan je vergelijken met een waar of niet waar uitspraak. Bekijk deze uitspraak: 'Ik doe de lamp aan'. Als deze uitspraak waar is doe ik daadwerkelijk de lamp aan (dit is de actie), als de uitspraak niet waar is doe ik de lamp uit (dit is de actie)."
                isFocused={isFocused}
            /> 
        }
        {
            slideCount === 3 && 
            <ExampleExercise 
                nextSlideHandler={nextSlideHandler}
                prevSlideHandler={prevSlideHandler}
                slideCount={slideCount}
                setTyping={setTyping}
                typing={typing}
                message={ASSIGNMENT_EXPLANATION.CODINGSCREEN_4}
                video = {require('./../../../../../assets/ifelse.mp4')}
                title = "Test Je Kennis"
                description = "Sleep de juiste blokken naar de juiste plek om de lamp aan te laten gaan als het donker is. Hou er rekening mee welk blok geld als een uitspraak en wel blok geld als een actie"
                isFocused={isFocused}
            />
        }
        </>
    );
}

export default InformationCodingScreenThree;

const styles = StyleSheet.create({

})