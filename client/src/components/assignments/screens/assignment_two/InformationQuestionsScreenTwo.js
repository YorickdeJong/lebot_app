import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ASSIGNMENT_EXPLANATION } from "../../../../data/InitialAssignmentExplanation";
import IntroScreenQuestions from "../../questions/IntroScreenQuestions";
import Questions from "../../questions/Questions";
import QuestionsMap from "../../questions/QuestionsMap";
import {View, StyleSheet} from 'react-native';
import { ColorsBlue } from "../../../../constants/palet";

function InformationQuestionsScreenTwo({assignmentTopic, assignmentNumber, isFocused}){
    const [slideCount, setSlideCount] = useState(0);
    const [typing, setTyping] = useState(true);

    //Filter out assignments for the correct subject
    const questions = assignmentTopic.filter(item => item.subject === "LED");
    
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
        numTiles = {7}
        onPress={setSlideCount}
        /> } 
        {slideCount === 1 &&
            <IntroScreenQuestions 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_21.answer.replace(/\s+/g, ' ')}
            thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_21.thread_id}
            title = "Lampen Rover"
            description = "In dit deel gaan we werken aan het elektrisch netwerk van de rover. We gaan lampen installeren zodat de auto ook 's nachts kan rond rijden."
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            /> 
        }
        {  
        slideCount === 2 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Juiste Weerstand"
          description = "kies de juiste weerstand die bij de lamp past"
          questions={questions}
          assignmentNumber={slideCount - 1} //set slide count to -1 per previous introscreen, this indicates the assingment number
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          />
        }
        {slideCount === 3 &&
            <IntroScreenQuestions 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_22.answer.replace(/\s+/g, ' ')}
            thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_22.thread_id}
            title = "Bouw de Schakeling"
            description = "Volg de video om de weerstand in de schakeling te bouwen."
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            /> 
        }
        {  
        slideCount === 4 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Weerstand in Draad"
          description = "Hier leer je hoe je de weerstand berekend van een draad. Dit gaat op een net iets andere manier dan de weerstanden die jij gewend bent van een schakeling"
          questions={questions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 2}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          />
        }

        {  
        slideCount === 5 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Verwaarlozen of niet?"
          description = "Bedenk met je groepje of je de weerstand van de draad moet verwaarlozen of niet. Onderbouw je antwoord met een berekening."
          questions={questions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 2}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          />
        }
        {  
        slideCount === 6 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Kwadratische Vergelijkingen"
          description = "Je leert hier functies herkennen, kwadratische vergelijkingen oplossen en de oplossingen van een vergelijking vinden. Deze kennis gebruiken we om te bepalen hoe lang de lamp kan branden op de accu van de rover"
          questions={questions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 2}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          />
        }
        
    </View>
    )

} 
export default InformationQuestionsScreenTwo

const styles = StyleSheet.create({
    topBorder: {
      flex: 1,
      borderTopColor: ColorsBlue.blue900,
      borderTopWidth: 0.6,
    }
  })
  
    // <>
    // {slideCount === 0  && (
    //     <IntroScreenQuestions 
    //     nextSlideHandler={nextSlideHandler}
    //     prevSlideHandler={prevSlideHandler}
    //     typing={typing}
    //     setTyping={setTyping}
    //     answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONS_1.answer}
    //     thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONS_1.thread_id}
    //     title = "Vragen Opdracht"
    //     description = "In dit deel worden jouw engineering skills getest. Wees creatief en denk goed na over de opdracht."
    //     isFocused={isFocused}
    //     /> //Add intro screen here
    // )}
    // {slideCount === 1  && (
    //     <IntroScreenQuestions 
    //     nextSlideHandler={nextSlideHandler}
    //     prevSlideHandler={prevSlideHandler}
    //     typing={typing}
    //     setTyping={setTyping}
    //     answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONS_2.answer}
    //     thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONS_2.thread_id}
    //     title = "Eisen Windmolen"
    //     description = {`De eisen voor het goed functioneren van een windmolen zijn:\n\n1. De maximum snelheid ligt tussen de 0.3 en 0.4 m/s\n\n2. De snelheid is constant na 1 seconden\n\n3. De efficientie ligt boven de 60%.\n\n4. De afgelegde afstand per rotatie is 2 meter.\n\n5. De milieu impact is niet hoger dan 2.`}
    //     isFocused={isFocused} />
    // )}
    // {slideCount === 2  && isFoccusedScreen && (
    //     <Questions
    //     title = "Eisen Windmolen"
    //     description = {`De eisen voor het goed functioneren van een windmolen zijn:\n\n1. De maximum snelheid ligt tussen de 0.3 en 0.4 m/s\n\n2. De snelheid is constant na 1 seconden\n\n3. De efficientie ligt boven de 60%.\n\n4. De afgelegde afstand per rotatie is 2 meter.\n\n5. De milieu impact is niet hoger dan 2.`} 
    //     question={questionOne}
    //     assignmentTopic={assignmentTopic}
    //     assignmentNumber={assignmentNumber}
    //     isFocused={isFocused}
    //     />
    // )} 
    // </>