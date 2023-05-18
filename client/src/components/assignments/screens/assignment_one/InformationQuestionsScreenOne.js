import { View, Text, StyleSheet, Button } from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import QuestionsMap from '../../questions/QuestionsMap';
import IntroScreenQuestions from '../../questions/IntroScreenQuestions';
import { ASSIGNMENT_EXPLANATION } from '../../../../data/InitialAssignmentExplanation';
import Explanation from "../../Explanation/Explanation";
import { ColorsBlue } from '../../../../constants/palet';
import Questions from '../../questions/Questions';
import { ChartContext } from '../../../../store/chart-context';
import { checkDataCorrectnessHandlerMotorQ2 } from '../../questions/verifyDataFunctions';
import { generateAnswerConstantSlope, generateAnswerMotorQ3, generateAnswerMotorQ5 } from '../../questions/generateAnswers';
import { getSpecificAssignmentsDetail } from '../../../../hooks/assignmentDetails';
import { UserProfileContext } from '../../../../store/userProfile-context';
import ProjectOneCustomContainer from '../../questions/CustomQuestionContainers/ProjectOneCustomContainer';
import { ShowIconsContext } from '../../../../store/show-icons-context';
import ExplanationAnimation from '../../Explanation/ExplanationAnimation';
import { TheoryExplanation } from '../../../../data/TheoryExplanation';
import ThinkScreen from '../../questions/ThinkScreen';

function InformationQuestionsScreenOne({ assignmentTopic, assignmentNumber, isFocused }) {
    const [slideCount, setSlideCount] = useState(0);
    const [typing, setTyping] = useState(true);
    const { chartToggle, setChartToggleHandler } = useContext(ChartContext)
    const userprofileCtx = useContext(UserProfileContext);
    const [answersStudent, setAnswersStudent] = useState([])
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    const showIconCtx = useContext(ShowIconsContext);
    
    useEffect(() => {
      async function fetchData() {
          const studentAnswerQ2 = await getSpecificAssignmentsDetail(school_id, class_id, group_id, 34, 'MOTOR');
          const studentAnswerQ4 = await getSpecificAssignmentsDetail(school_id, class_id, group_id, 36, 'MOTOR');
          const studentAnswerQ5 = await getSpecificAssignmentsDetail(school_id, class_id, group_id, 37, 'MOTOR');
  
          const arrayAnswers = [studentAnswerQ2.answers_open_questions[studentAnswerQ2.answers_open_questions.length - 1].answer, 
          studentAnswerQ4.answers_open_questions[studentAnswerQ4.answers_open_questions.length - 1].answer, 
          studentAnswerQ5.answers_open_questions[studentAnswerQ5.answers_open_questions.length - 1].answer]
          setAnswersStudent(arrayAnswers)
      }
      fetchData()
    }, [])
    
    
    console.log('asnwersstudents', answersStudent)
    //Filter out assignments for the correct subject
    const questions = assignmentTopic.filter(item => item.subject === "MOTOR"); //maybe also filter for Vragen Opdrcht hier
    const sortedQuestions = questions.sort((a, b) => a.assignment_number - b.assignment_number);

    //upon changing to this screen, set the thread id to the first thread id

    console.log(`check CodingScreen`)

    //If chart toggle of distance and or velocity is true, set chart toggle to false here
    useEffect(() => {
      if (chartToggle.p_t) {
        setChartToggleHandler("p_t")
      }
  
      if (chartToggle.u_t) {
        setChartToggleHandler("u_t")
      }
  
      if (chartToggle.i_t) {
        setChartToggleHandler("i_t")
      }

      if (!chartToggle.s_t) {
        setChartToggleHandler("s_t")
      }
    }, [])

    console.log('s-t', chartToggle.s_t)

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



    function IconHandler() {
      console.log('check CHECK')
      showIconCtx.setShowIconsHandler('robotStore')
  }

    return (
      <View style = {styles.topBorder}>
      {slideCount === 0 && <QuestionsMap 
      numTiles = {15}
      onPress={setSlideCount}
      /> } 
        {slideCount === 1 &&
        <IntroScreenQuestions 
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}
          typing={typing}
          setTyping={setTyping}
          answer = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_11.answer}
          thread_id = {ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_11.thread_id}
          title = "Motoren testen"
          description = "In dit deel gaan jij en je team data verzamelen over de motoren van de rover. Deze data kunnen we gebruiken om andere motoren te testen op hun prestaties."
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          setIcon = {IconHandler}
          screenType = "Motor"
          slideCount={slideCount}
        /> 
        }
        {
        slideCount === 2 &&
        <ThinkScreen
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}
          slideCount={slideCount}
          isFocused={isFocused}
          topic = "Beweging"
          questions = {["Wat weet jij over snelheid en versnelling? Welke wiskunde komt terug die je al geleerd hebt?", "Welke kennis heb je al?", "Waarom zou je deze kennis nodig hebben?", "Welke vergelijkingen zou je kunnen gebruiken?", "Zijn jullie het eens met elkaar? Waarom wel/niet?"]}
          setSlideCount={setSlideCount}

        />
        }
        {  
        slideCount === 3 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Verplaatsing en Afstand"
          description = {`Stel jezelf de volgende vragen: \n\n- Wat is verplaatsing en wat is afstand?\n\n- Is er een verschil tussen verplaatsing en afstand?\n\n- Kan de snelheid negatief zijn?\n\nVergeet niet dat je chatgpt vragen kan stellen!`} 
          questions={sortedQuestions}
          assignmentNumber={slideCount - 2}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}
          slideCount={slideCount}
          chatgptAnswer = {true}
          currentExerciseLesson = {2}

          />
        }
        {slideCount === 4 &&
          <Explanation
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {TheoryExplanation.ProjectOneConstantSpeed}
            thread_id = {7}
            topic = "Constante Snelheid"
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            slideCount={slideCount}
            ExplanationAnimation={ExplanationAnimation}
            video = {require('./../../../../../assets/instructions/starting_measurement.mp4')}
          />
        }
        {  
        slideCount === 5 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Grafieken: (s, t) - (v, t)"
          description = {`In Dit onderdeel ga jij je begrip voor afstand, snelheid en versnelling verbeteren. Maak observaties wat er gebeurd als de motor sneller of langzamer gaat draaien`} 
          questions={sortedQuestions}
          assignmentNumber={slideCount - 3}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}
          slideCount={slideCount}
          performedMeasurement
          customMeasurement = {true}
          currentExerciseLesson = {2}
          />
        }
        {slideCount === 6 &&
          <Explanation 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {TheoryExplanation.ProjectOneLineCalculation}
            thread_id = {7}
            topic = "Formule van een Lijn"
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            slideCount={slideCount}
            ExplanationAnimation={ExplanationAnimation}
          />
        }
        { 
        slideCount === 7 &&
          <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
          title = "Formule Opstellen"
          description = {`Bij het opstellen van de formule voor een lijn moet je je altijd afvragen met wat voor soort lijn je te maken hebt. Welke orde is het? Is het een rechte lijn of een parabool?`} 
          questions={sortedQuestions}
          assignmentNumber={slideCount - 4}
          isFocused={isFocused}
          setSlideCount={setSlideCount}
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}
          slideCount={slideCount}
          checkDataCorrectnessHandler={checkDataCorrectnessHandlerMotorQ2}
          normal_and_multiple_choice={true}
          generate_answer={generateAnswerConstantSlope}
          performedMeasurement
          currentExerciseLesson = {2}
          />
        }
        { 
        slideCount === 8 &&
            <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
            title = "Agelegde afstand"
            description = {`Om een voorspelling te doen over de afgelegde afstand van de rover na 60 seconde kan je de formule voor de lijn gebruiken.`} 
            questions={sortedQuestions}
            assignmentNumber={slideCount - 4}
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            slideCount={slideCount}
            generate_answer={generateAnswerMotorQ3}
            currentExerciseLesson = {2}
            />
        }
        {slideCount === 9 &&
          <Explanation 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {TheoryExplanation.ProjectOneConstantAcceleration}
            thread_id = {7}
            topic = "Constante Versnelling"
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            slideCount={slideCount}
            ExplanationAnimation={ExplanationAnimation}
          />
        }
        { 
        slideCount === 10 &&
            <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
            title = "Snelheid en Versnelling"
            description = {`wat weten we over de snelheid als er een constante versnelling plaats vindt?`} 
            questions={sortedQuestions}
            assignmentNumber={slideCount - 5}
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            slideCount={slideCount}
            performedMeasurement
            customMeasurement = {true}
            currentExerciseLesson = {2}
            />
        }
        {slideCount === 11 &&
          <Explanation 
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            typing={typing}
            setTyping={setTyping}
            answer = {TheoryExplanation.ProjetOneNewtonsLaws}
            thread_id = {7}
            topic = "Newtons Wetten"
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            slideCount={slideCount}
            ExplanationAnimation={ExplanationAnimation}
          />
        }
        { 
          slideCount === 12 &&
            <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
            title = "Resulterende Kracht"
            description = {`Wat betekend de resulterende kracht? Weet je welke formule daarbij hoort en waar deze formule vandaan komt? Hint: De versnelling is constant.`} 
            questions={sortedQuestions}
            assignmentNumber={slideCount - 6}
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            slideCount={slideCount}
            generate_answer={generateAnswerMotorQ5}
            normal_and_multiple_choice={true}
            currentExerciseLesson = {3}
            />
        }
        {
        slideCount === 13 &&
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
              slideCount={slideCount}
            /> 
        }
        { 
        slideCount === 14 &&
            <Questions //TODO in questions toevoegen dat je naar de volgende gaat als je hem goed hebt
            title = "Kapotte Motoren"
            description = {`Gebasseerd op de data die jij hebt verzameld, kan je bepalen welke motor kapot is. Niet elke motor is hetzelfde, daarom rekenen we met marges van ± 10%. In de haakjes, (), staat jouw gevonden waarde 
  
1. De gemiddelde versnelling ligt tussen de \n    ${((parseFloat(answersStudent[2]) - 0.06).toFixed(2))} en ${((parseFloat(answersStudent[2]) + 0.06).toFixed(2))} m/s². \n    Jouw test: a = ${answersStudent[2]} ± 0.06 m/s²

2. De gemiddelde snelheid tijdens de meeting \n    is niet lager dan ${((parseFloat(answersStudent[1]) - 0.04).toFixed(2))} m/s. \n    Jouw test: vgem = ${answersStudent[1]} ± 0.04 m/s

3. De afgelegde afstand na 15 seconde is \n    hoger dan ${(15 * (parseFloat(answersStudent[0])  - answersStudent[0] / 10).toFixed(2))} m \n    Jouw test: s = ${answersStudent[0]} m/s • 15 s → ${15 * (parseFloat(answersStudent[0])  - answersStudent[0] / 10).toFixed(2)} ± ${answersStudent[0]} m

4. De maximale snelheid is niet hoger dan ${0.33} \n    m/s \n    *Waarde gevonden door andere crew*

5. Als gaspedaal wordt losgelaten, staat de \n    motor in minder dan ${1.1} seconde stil. \n    *Waarde gevonden door andere crew*     

Geef ook de bijbehorende ongelijkheidstekens aan die bij de eisen horen.
            
            `} 
            questions={sortedQuestions}
            assignmentNumber={slideCount - 7}
            isFocused={isFocused}
            setSlideCount={setSlideCount}
            nextSlideHandler={nextSlideHandler}
            prevSlideHandler={prevSlideHandler}
            slideCount={slideCount}
            // slideCountEnd={true}  
            CustomContainer={ProjectOneCustomContainer}
            performedMeasurement
            answersStudent={answersStudent}
            customMeasurement = {true}
            currentExerciseLesson = {3}
            />
        }
        {
        slideCount === 15 &&
        <ThinkScreen
          nextSlideHandler={nextSlideHandler}
          prevSlideHandler={prevSlideHandler}
          slideCount={slideCount}
          isFocused={isFocused}
          topic = "Beweging"
          questions = {["Reflecteer op jullie eerste bevindingen", "Welke nieuwe kennis heb je opgedaan?", "Hoe zou je aanpak veranderen met jouw nieuwe kennis?", "", "Zijn jullie het nog steeds met elkaar eens over jullie oorspronkelijke bevingen? Waarom wel/niet?"]}
          slideCountEnd={true}
        />
        }
      </View>
    );
}

export default React.memo(InformationQuestionsScreenOne)


const styles = StyleSheet.create({
  topBorder: {
    flex: 1,
  }
})
