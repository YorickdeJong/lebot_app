import React, { useState, useEffect, useRef, useContext } from 'react';
import { Animated, Keyboard,  StyleSheet } from 'react-native';
import { ASSIGNMENT_EXPLANATION } from '../../../../data/InitialAssignmentExplanation';
import { ChatContext } from '../../../../store/chat-context';
import { useIsFocused } from '@react-navigation/native';
import BatteryScreen from '../../BuildComponent.js/BatteryScreen';
import IntroScreen from '../../BuildComponent.js/IntroScreen';



function InformationBuildScreenOne({isFocused}) {
    const [slideCount, setSlideCount] = useState(0);
    const [typing, setTyping] = useState(true);

    useEffect(() => {
        console.log(slideCount)
    }, [slideCount])
    
    console.log(`check Build Screen`)

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
            slideCount === 0 && (
            <BatteryScreen 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            slideCount={slideCount}
            setTyping={setTyping}
            typing={typing}
            message={ASSIGNMENT_EXPLANATION.BUILDSCREEN_1}
            title = "Mars Rover"
            description = "In dit project ga jij een Mars Rover bouwen. Hier worden jouw technische skills op de proef gesteld. We krijgen eerst een beschrijving over het inelkaar zetten van de Mars Rover. Waarna we onze eerste code gaan schrijven om de motoren van de Mars Rover aan te sturen. Als laatste worden jouw engineers skills getest om een defecte Mars Rover op te sporen."
            video = {require('./../../../../../assets/marsVideo.mp4')}
            isFocused={isFocused}
            />
            )          
        }
        {
            slideCount === 1 && 
            <BatteryScreen 
                nextSlideHandler={nextSlideHandler}
                prevSlideHandler={prevSlideHandler}
                slideCount={slideCount}
                setTyping={setTyping}
                typing={typing}
                message={ASSIGNMENT_EXPLANATION.BUILDSCREEN_2}
                video = {require('./../../../../../assets/batterijFilm.mp4')}
                title = "Batterij Aansluiten"
                description = "Sluit de batterij aan op het blauwe bordje. De rode draad moet altijd in de plus kant en de blauwe draad in de min kant. Als het groene lampje gaat branden, dan weet je dat je het goed hebt gedaan."
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
                message={ASSIGNMENT_EXPLANATION.BUILDSCREEN_3}
                video = {require('./../../../../../assets/BatterijFilm2.mp4')}
                title = "Motor Aansluiten"
                description = "Sluit nu de motor aan op het blauwe bordje. De rode draad moet aan de meest linker kant van de zwarte aansluiting. Sluit motor 1 aan op M1, motor 2 op M2, enzovoort."
                isFocused={isFocused}
            /> 
        }
        </>
    );
}

export default InformationBuildScreenOne;

const styles = StyleSheet.create({

})