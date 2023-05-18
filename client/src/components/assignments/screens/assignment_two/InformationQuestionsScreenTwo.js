import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ASSIGNMENT_EXPLANATION } from "../../../../data/InitialAssignmentExplanation";
import IntroScreenQuestions from "../../questions/IntroScreenQuestions";
import Questions from "../../questions/Questions";
import QuestionsMap from "../../questions/QuestionsMap";
import {View, StyleSheet} from 'react-native';
import { ColorsBlue } from "../../../../constants/palet";
import Explanation from "../../Explanation/Explanation";
import ExplanationAnimation from "../../Explanation/ExplanationAnimation";
import { TheoryExplanation } from "../../../../data/TheoryExplanation";
import BatteryScreen from "../../BuildComponent.js/BatteryScreen";
import SolarEvent from "../../../solar_events/SolarEvent";

function InformationQuestionsScreenTwo({assignmentTopic, assignmentNumber, isFocused}){
    const [slideCount, setSlideCount] = useState(0);
    const [typing, setTyping] = useState(true);

    //Filter out assignments for the correct subject
    const questions = assignmentTopic.filter(item => item.subject === "LED");
    const sortedQuestions = questions.sort((a, b) => a.assignment_number - b.assignment_number);
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
        numTiles = {12}
        onPress={setSlideCount}
        /> } 
        {slideCount === 1 &&
            <IntroScreenQuestions 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_21.answer}
            thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_21.thread_id}
            title = "Zonnestormen"
            description = "In dit deel moet jij ervoor zorgen dat de rover beschermd is tegen zonnestormen. "
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            slideCount={slideCount}
            video= {require('./../../../../../assets/planets/solar_flare.mp4')}
            /> 
        }
        {slideCount === 2 &&
          <Explanation 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {TheoryExplanation.ProjectTwoOhm}
            thread_id = {7}
            topic = "Wet van Ohm"
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            slideCount={slideCount}
            ExplanationAnimation={ExplanationAnimation}
          />
        }
        {slideCount === 3 &&
          <Explanation 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {TheoryExplanation.ProjectTwoOhmTwo}
            thread_id = {7}
            topic = "Ohm en snelwegen"
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            slideCount={slideCount}
            ExplanationAnimation={ExplanationAnimation}
          />
        }
        {slideCount === 4 &&
          <Explanation 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {TheoryExplanation.ProjectTwoOhmTwo}
            thread_id = {7}
            topic = "Serie schakelingen"
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            slideCount={slideCount}
            ExplanationAnimation={ExplanationAnimation}
          />
        }
        {slideCount === 5 &&
          <Explanation 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {TheoryExplanation.ProjectTwoOhmThree}
            thread_id = {7}
            topic = "Parallel schakelingen"
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            slideCount={slideCount}
            ExplanationAnimation={ExplanationAnimation}
          />
        }
        {  
        slideCount === 6 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Voltage bepalen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         "
          description = "In serie schakelingen is de spanning verdeeld over de weerstanden."
          questions={sortedQuestions}
          assignmentNumber={slideCount - 5} //set slide count to -1 per previous introscreen, this indicates the assingment number
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          slideCount={slideCount}
          currentExerciseLesson = {4}
          />
        }
        {  
        slideCount === 7 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Weerstand berekenen"
          description = "In serie schakelingen is de totale weerstand de som van alle weerstanden."
          questions={sortedQuestions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 5}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}
          slideCount={slideCount}
          currentExerciseLesson = {4}
          />
        }

        {  
        slideCount === 8 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Spanning in serie"
          description = "Spanning in serie schakelingen is over de hele schakeling gelijk."
          questions={sortedQuestions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 5}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}
          slideCount={slideCount}
          currentExerciseLesson = {4}
          />
        }
        {slideCount === 9 &&
            <IntroScreenQuestions 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_22.answer}
            thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_22.thread_id}
            title = "Bouw de Schakeling"
            description = "Volg de video om de weerstand in de schakeling te bouwen."
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            slideCount={slideCount}
            /> 
        }
        {  
        slideCount === 10 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Kwadratische Vergelijkingen"
          description = "Je leert hier functies herkennen, kwadratische vergelijkingen oplossen en de oplossingen van een vergelijking vinden. Deze kennis gebruiken we om te bepalen hoe lang de lamp kan branden op de accu van de rover"
          questions={sortedQuestions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 6}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}  
          slideCount={slideCount}       
          performedMeasurement
          currentExerciseLesson = {5}
          />
        }
        {slideCount === 11 &&
            <IntroScreenQuestions 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_23.answer}
            thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_23.thread_id}
            title = "Test je setup"
            description = "Hoe beter jouw setup is, desde meer reactie tijd je krijgt om je te beschermen tegen de magnetische storemen."
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            slideCount={slideCount}
            slideCountEnd={true}  
            /> 
        }
        {slideCount === 12 &&
          <SolarEvent 
            isFocused={isFocused}
            prevSlideHandler={prevSlideHandler}
          />
        }
    </View>
    )

} 
export default InformationQuestionsScreenTwo

const styles = StyleSheet.create({
    topBorder: {
      flex: 1,
    }
  })
  