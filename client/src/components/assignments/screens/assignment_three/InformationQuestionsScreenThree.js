import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ASSIGNMENT_EXPLANATION } from "../../../../data/InitialAssignmentExplanation";
import IntroScreenQuestions from "../../questions/IntroScreenQuestions";
import Questions from "../../questions/Questions";
import QuestionsMap from "../../questions/QuestionsMap";
import {View, StyleSheet} from 'react-native';
import { ColorsBlue } from "../../../../constants/palet";

function InformationQuestionsScreenThree({assignmentTopic, assignmentNumber, isFocused}){
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
        numTiles = {9}
        onPress={setSlideCount}
        /> } 
        {slideCount === 1 &&
            <IntroScreenQuestions 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_31.answer.replace(/\s+/g, ' ')}
            thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_31.thread_id}
            title = "Optimale Snelheid"
            description = "In dit project ga jij de optimale snelheid van de rover bepalen. We hebben deze snelheid nodig om een zo lang mogelijke afstand te kunnen afleggen op 1 accu op een andere planeet. Probeer zo accuraat mogelijk te werken, we gaan aan het einde namelijk een race doen waar je jouw data voor gaat gebruiken!"
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            /> 
        }
        {  
        slideCount === 2 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Krachtbalansen"
          description = "Welke krachten werken er allemaal op de auto? Denk logisch na en kijk welke krachten je mag verwaarlozen"
          questions={questions}
          assignmentNumber={slideCount - 1} //set slide count to -1 per previous introscreen, this indicates the assingment number
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          />
        }
        {  
        slideCount === 3 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Motorkracht en Wrijving"
          description = "Vanuit je opgestelde krachtenbalans, hoe zou je de motorkracht kunnen berekenen?"
          questions={questions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          />
        }
        {  
        slideCount === 4 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Vermogen motoren"
          description = "Bereken het vermogen van de motoren. Wat weten we bij een constante snelheid over het vermogen?"
          questions={questions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          />
        }

        {  
        slideCount === 5 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Vermogen Batterij"
          description = "Bereken het vermogen dat de batterij moet leveren aan de motoren. Wat weten we over elektrisch vermogen?"
          questions={questions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          />
        }
        {  
        slideCount === 6 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Efficientie"
          description = "Bereken nu de efficientie van de motor bij verschillende snelheden. Bekijk welke gegevens je hebt verzameld en hoe je hier de effcientie uit kan berekenen."
          questions={questions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          />
        }
        {  
        slideCount === 7 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Gegevens plotten"
          description = "Maak een plot/figuur van je gegevens met op de x-as de snelheid en op de y-as de efficientie. Wat zie je?"
          questions={questions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          />
        }  
        {slideCount === 8 &&
            <IntroScreenQuestions 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_32.answer.replace(/\s+/g, ' ')}
            thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_32.thread_id}
            title = "Ready? Set? Go!"
            description = "We gaan beginnen met de race. Bouw het parcours en kies je coureur uit. Bedenk auto configuratie je wilt gebruiken. Denk ook na welke optimale snelheid gebruikt kan worden."
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            /> 
        }
    </View>
    )

} 

export default InformationQuestionsScreenThree;

const styles = StyleSheet.create({
    topBorder: {
      flex: 1,
      borderTopColor: ColorsBlue.blue900,
      borderTopWidth: 0.6,
    }
  })
  