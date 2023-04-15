import React, {useState} from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import QuestionsMap from '../../questions/QuestionsMap';
import IntroScreenQuestions from '../../questions/IntroScreenQuestions';
import { ASSIGNMENT_EXPLANATION } from '../../../../data/InitialAssignmentExplanation';
import { ColorsBlue } from '../../../../constants/palet';
import Questions from '../../questions/Questions';


function InformationQuestionsScreenOne({ assignmentTopic, assignmentNumber, isFocused }) {
    const [slideCount, setSlideCount] = useState(0);
    const [typing, setTyping] = useState(true);

    //Filter out assignments for the correct subject
    const questions = assignmentTopic.filter(item => item.subject === "MOTOR");

    //upon changing to this screen, set the thread id to the first thread id

    console.log(`check CodingScreen`)



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
      <View style = {styles.topBorder}>
      {slideCount === 0 && <QuestionsMap 
      numTiles = {8}
      onPress={setSlideCount}
      /> } 
        {slideCount === 1 &&
        <IntroScreenQuestions 
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}
          typing={typing}
          setTyping={setTyping}
          answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_11.answer.replace(/\s+/g, ' ')}
          thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_11.thread_id}
          title = "Motoren testen"
          description = "In dit deel ga jij data verzamelen over de motoren van de rover. Deze data kunnen we gebruiken om andere motoren te testen op hun prestaties."
          isFocused={isFocused}
          setSlideCount={setSlideCount}
        /> 
        }
        {  
        slideCount === 2 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Grafieken: (s, t) - (v, t)"
          description = {`In Dit onderdeel ga jij je begrip voor afstand, snelheid en versnelling verbeteren. Maak observaties wat er gebeurd als de motor sneller of langzamer gaat draaien`} 
          questions={questions}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          />
        }
        { 
        slideCount === 3 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Formule Opstellen"
          description = {`Bij het opstellen van de formule voor een lijn moet je je altijd afvragen met wat voor soort lijn je te maken hebt. Welke orde is het? Is het een rechte lijn of een parabool?`} 
          questions={questions}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          />
        }
        { 
        slideCount === 4 &&
            <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
            title = "Agelegde afstand"
            description = {`Om een voorspelling te doen over de afgelegde afstand van de rover na 60 seconde kan je de formule voor de lijn gebruiken.`} 
            questions={questions}
            assignmentNumber={slideCount - 1}
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            />
        }
        { 
        slideCount === 5 &&
            <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
            title = "Snelheid en Versnelling"
            description = {`wat weten we over de snelheid als er een constante versnelling plaats vindt?`} 
            questions={questions}
            assignmentNumber={slideCount - 1}
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            />
        }
        { 
          slideCount === 6 &&
            <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
            title = "Resulterende Kracht"
            description = {`Wat betekend de resulterende kracht? Weet je welke formule daarbij hoort en waar deze formule vandaan komt? Hint: De versnelling is constant.`} 
            questions={questions}
            assignmentNumber={slideCount - 1}
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            />
        }
        {
        slideCount === 7 &&
            <IntroScreenQuestions 
              nextSlideHandler={nextSlideHandler}
              prevSlideHandler={prevSlideHandler}
              typing={typing}
              setTyping={setTyping}
              answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_12.answer}
              thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_12.thread_id}
              title = "Evenwijdige lijnen"
              description = "Wat voor grafiek zien we hier? Wat voor consequenties heeft dit op de gegeven mogelijke antwoorden?"
              isFocused={isFocused}
              setSlideCount={setSlideCount}
            /> 
        }
        { 
        slideCount === 8 &&
            <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
            title = "Kapotte Motoren"
            description = {`Het is aan jou en je engineering team om te bepalen welke motoren kapot zijn. De eisen van een goed functionerende motor zijn:
  
1. De snelheid is groter dan, of gelijk aan 0.3 en kleiner dan, of gelijk aan 0.4 

2. De snelheid is constant na 1 seconden 

3. De maximale verselling is niet lager dan 0.3 m/s2 

4. De afgelegde afstand na 5 seconde is hoger dan 2 meter 

5. De motor staat na dan 1 seconden stil     

Geef tevens ook de bijbehorende ongelijkheidstekens aan die bij de eisen horen.
            
            `} 
            questions={questions}
            assignmentNumber={slideCount - 2}
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            />
        }

      </View>
    );
}

export default React.memo(InformationQuestionsScreenOne)


const styles = StyleSheet.create({
  topBorder: {
    flex: 1,
    // borderTopColor: ColorsBlue.blue900,
    // borderTopWidth: 0.6,
  }
})
