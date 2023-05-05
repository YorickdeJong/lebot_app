import { useIsFocused } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { ASSIGNMENT_EXPLANATION } from "../../../../data/InitialAssignmentExplanation";
import IntroScreenQuestions from "../../questions/IntroScreenQuestions";
import Questions from "../../questions/Questions";
import QuestionsMap from "../../questions/QuestionsMap";
import {View, StyleSheet} from 'react-native';
import { ColorsBlue } from "../../../../constants/palet";
import { ChartContext } from "../../../../store/chart-context";
import MultipleAnswersContainer from "../../questions/CustomCarAnimationContainer/MultipleAnswersContainer";

function InformationQuestionsScreenThree({assignmentTopic, assignmentNumber, isFocused}){
    const [slideCount, setSlideCount] = useState(0);
    const [typing, setTyping] = useState(true);
    const { chartToggle, setChartToggleHandler } = useContext(ChartContext)

    //Filter out assignments for the correct subject
    const questions = assignmentTopic.filter(item => item.subject === "CAR");
    const sortedQuestions = questions.sort((a, b) => a.assignment_number - b.assignment_number);
    //upon changing to this screen, set the thread id to the first thread id

    console.log(`check CodingScreen`)

    //If chart toggle of distance and or velocity is true, set chart toggle to false here
    useEffect(() => {
        if (chartToggle.s_t) {
            setChartToggleHandler("s_t")
        }
    
        if (chartToggle.v_t) {
          setChartToggleHandler("v_t")
        }
    
        //turn on power toggle
        if (!chartToggle.p_t) {
          setChartToggleHandler("p_t")
        }
    }, [])

    console.log('p-t', chartToggle.p_t)

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
        numTiles = {11}
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
            description = "Om de basis te halen met de brandstof die hebben voor de rover, moeten we zuinig rijden. Er is een optimale snelheid waarmee de rover het zuinigste rijd. We hebben deze snelheid nodig om een zo lang mogelijke afstand te kunnen afleggen op 1 accu. Probeer zo accuraat mogelijk te werken, je gebruikt je data straks in echt tegen andere crews!"
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            /> 
        }
        {  
        slideCount === 2 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Krachten"
          description = "Welke krachten werken er allemaal op de rover? Welke krachten kunnen we sowieso verwaarlozen?"
          questions={sortedQuestions}
          assignmentNumber={slideCount - 1} //set slide count to -1 per previous introscreen, this indicates the assingment number
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}  
          slideCount={slideCount}    
          showCarAnimation={true}
          />
        }
        {  
        slideCount === 3 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Krachtbalans"
          description = "Welke krachten heb je in de vorige gezien die op de auto werken?"
          questions={sortedQuestions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}  
          slideCount={slideCount}    
          showCarAnimation={true}
          />
        }
        {  
        slideCount === 4 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Vermogen motoren"
          description = "Bereken het vermogen van de motoren. Wat weten we bij een constante snelheid over het vermogen?"
          questions={sortedQuestions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}  
          slideCount={slideCount}    
          />
        }

        {  
        slideCount === 5 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Vermogen Batterij"
          description = "Bereken het vermogen dat de batterij moet leveren aan de motoren. Wat weten we over elektrisch vermogen?"
          questions={sortedQuestions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}  
          slideCount={slideCount}    
          normal_and_multiple_choice = {true}
          performedMeasurement
          CustomContainer = {MultipleAnswersContainer}
          customMeasurement = {true}
          />
        }
        {  
        slideCount === 6 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Efficientie"
          description = "Bereken nu de efficientie van de motor bij verschillende snelheden. Bekijk welke gegevens je hebt verzameld en hoe je hier de effcientie uit kan berekenen."
          questions={sortedQuestions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}  
          slideCount={slideCount}   
          performedMeasurement 
          />
        }
        {  
        slideCount === 7 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Gegevens plotten"
          description = "Maak een plot/figuur van je gegevens met op de x-as de snelheid en op de y-as de efficientie. Wat zie je?"
          questions={sortedQuestions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}  
          slideCount={slideCount}    
          />
        }  
        {  
        slideCount === 8 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Gegevens plotten"
          description = "Maak een plot/figuur van je gegevens met op de x-as de snelheid en op de y-as de efficientie. Wat zie je?"
          questions={sortedQuestions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}  
          slideCount={slideCount}    
          />
        }  
        {  
        slideCount === 9 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Gegevens plotten"
          description = "Maak een plot/figuur van je gegevens met op de x-as de snelheid en op de y-as de efficientie. Wat zie je?"
          questions={sortedQuestions}
          assignmentTopic={assignmentTopic}
          assignmentNumber={slideCount - 1}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}  
          slideCount={slideCount}    
          />
        }  
        {slideCount === 10 &&
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
            slideCount={slideCount}    
            slideCountEnd={true}  
            /> 
        }
        {slideCount === 11 &&
            {/* <RaceScreen /> */}

        }
    </View>
    )

} 

export default InformationQuestionsScreenThree;

const styles = StyleSheet.create({
    topBorder: {
      flex: 1,
    }
  })
  