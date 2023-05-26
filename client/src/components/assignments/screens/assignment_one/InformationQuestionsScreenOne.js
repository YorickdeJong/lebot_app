import { View, Text, StyleSheet, Button, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
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
import { throttle } from 'lodash';
import { ScrollContext } from '../../../../store/scroll-context';
import LoadingChat from '../../../UI/LoadingChat';



const { width: SCREEN_WIDTH } = Dimensions.get('window');

function InformationQuestionsScreenOne({ assignmentTopic, assignmentNumber, isFocused }) {
    const [slideCount, setSlideCount] = useState(0);
    const [typing, setTyping] = useState(true);
    const { chartToggle, setChartToggleHandler } = useContext(ChartContext)
    const userprofileCtx = useContext(UserProfileContext);
    const [answersStudent, setAnswersStudent] = useState([])
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    const showIconCtx = useContext(ShowIconsContext);
    const flatListRef = useRef(1);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollPositionRef = useRef(0);
    const scrollCtx = useContext(ScrollContext)
    const [isLoading, setIsLoading] = useState(true);
    const onScrollBeginDrag = () => setIsScrolling(true);
    const onScrollEndDrag = () => setIsScrolling(false);

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
      setIsLoading(false)
    }, [])
  
    useEffect(() => {
      if (!isScrolling) {
        const slide = Math.round(scrollPositionRef.current / SCREEN_WIDTH);
        
      }
    }, [isScrolling, slideCount]);

    if (!isFocused){
      return
    }

    //Filter out assignments for the correct subject
    const questions = assignmentTopic.filter(item => item.subject === "MOTOR"); //maybe also filter for Vragen Opdrcht hier
    const sortedQuestions = questions.sort((a, b) => a.assignment_number - b.assignment_number);

    function nextSlideHandler(){
        console.log(`next slide handled`)
        setSlideCount(slideCount + 1);
        // Calculate the offset to scroll to
        const offset = (slideCount) * SCREEN_WIDTH;
        flatListRef.current.scrollToOffset({ offset, animated: false });
        setTyping(true);
    }

    function prevSlideHandler(){
        console.log(`prev slide handled`)
        setSlideCount(slideCount - 1);
        // Calculate the offset to scroll to
        const offset = (slideCount - 2) * SCREEN_WIDTH;
        flatListRef.current.scrollToOffset({ offset, animated: false });
        setTyping(true);
    }



    function IconHandler() {
      console.log('check CHECK')
      showIconCtx.setShowIconsHandler('robotStore')
    }


    const slideTotal = 15
    const SCREENS = [
      {
        component: IntroScreenQuestions,
        props: {
            nextSlideHandler,
            prevSlideHandler,
            typing,
            setTyping,
            answer: ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_11.answer,
            thread_id: ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_11.thread_id,
            title: "Motoren testen",
            description: "In dit deel gaan jij en je team data verzamelen over de motoren van de rover. Deze data kunnen we gebruiken om andere motoren te testen op hun prestaties.",
            isFocused,
            setSlideCount,
            setIcon: IconHandler,
            screenType: "Motor",
            slideCount,
            slideTotal,
          },
      },
      {
        component: ThinkScreen,
          props: {
            nextSlideHandler,
            prevSlideHandler,
            slideCount,
            isFocused,
            topic: "Beweging",
            questions: [
              "Wat weet jij over snelheid en versnelling? Welke wiskunde komt terug die je al geleerd hebt?",
              "Welke kennis heb je al?",
              "Waarom zou je deze kennis nodig hebben?",
              "Welke vergelijkingen zou je kunnen gebruiken?",
              "Zijn jullie het eens met elkaar? Waarom wel/niet?",
            ],
            setSlideCount,
            slideTotal,
            slideCount,
          },
      },
      {
        component: Questions,
        props: {
            title: "Verplaatsing en Afstand",
            description:
            "Stel jezelf de volgende vragen:\n\n- Wat is verplaatsing en wat is afstand?\n\n- Is er een verschil tussen verplaatsing en afstand?\n\n- Kan de snelheid negatief zijn?\n\nVergeet niet dat je ChatGPT vragen kan stellen!",
            questions: sortedQuestions,
            assignmentNumber: 1,
            isFocused,
            setSlideCount,
            nextSlideHandler,
            prevSlideHandler,
            slideCount,
            chatgptAnswer: true,
            currentExerciseLesson: 2,
            slideTotal,
          },
      },
      {
        component: Explanation,
        props: {
            nextSlideHandler,
            prevSlideHandler,
            typing,
            setTyping,
            answer: TheoryExplanation.ProjectOneConstantSpeed,
            thread_id: 7,
            topic: "Constante Snelheid",
            isFocused,
            setSlideCount,
            slideCount,
            ExplanationAnimation: ExplanationAnimation,
            video: require("./../../../../../assets/instructions/starting_measurement.mp4"),
            slideTotal,
          },
      },
      {
        component: Questions,
        props: {
            title: "Grafieken: (s, t) - (v, t)",
            description:
            "In dit onderdeel ga jij je begrip voor afstand, snelheid en versnelling verbeteren. Maak observaties wat er gebeurt als de motor sneller of langzamer gaat draaien",
            questions: sortedQuestions,
            assignmentNumber: 2,
            isFocused,
            setSlideCount,
            nextSlideHandler,
            prevSlideHandler,
            slideCount,
            performedMeasurement: true,
            customMeasurement: true,
            currentExerciseLesson: 2,
            slideTotal,
          },
      },
      {
        component: Explanation,
          props: {
            nextSlideHandler,
            prevSlideHandler,
            typing,
            setTyping,
            answer: TheoryExplanation.ProjectOneLineCalculation,
            thread_id: 7,
            topic: "Formule van een Lijn",
            isFocused,
            setSlideCount,
            slideCount,
            ExplanationAnimation: ExplanationAnimation,
            slideTotal,
          },
        },
        {
          component: Questions,
          props: {
              title: "Formule Opstellen",
              description:
              "Bij het opstellen van de formule voor een lijn moet je je altijd afvragen met wat voor soort lijn je te maken hebt. Welke orde is het? Is het een rechte lijn of een parabool?",
              questions: sortedQuestions,
              assignmentNumber: 3,
              isFocused,
              setSlideCount,
              nextSlideHandler,
              prevSlideHandler,
              slideCount,
              checkDataCorrectnessHandler: checkDataCorrectnessHandlerMotorQ2,
              normal_and_multiple_choice: true,
              generate_answer: generateAnswerConstantSlope,
              performedMeasurement: true,
              currentExerciseLesson: 2,
              slideTotal,
            },
        },
        {
          component: Questions,
            props: {
              title: "Agelegde afstand",
              description:
              "Om een voorspelling te doen over de afgelegde afstand van de rover na 60 seconden, kan je de formule voor de lijn gebruiken.",
              questions: sortedQuestions,
              assignmentNumber: 4,
              isFocused,
              setSlideCount,
              nextSlideHandler,
              prevSlideHandler,
              slideCount,
              generate_answer: generateAnswerMotorQ3,
              currentExerciseLesson: 2,
              slideTotal,
            },
        },
        {
          component: Explanation,
          props: {
              nextSlideHandler,
              prevSlideHandler,
              typing,
              setTyping,
              answer: TheoryExplanation.ProjectOneConstantAcceleration,
              thread_id: 7,
              topic: "Constante Versnelling",
              isFocused,
              setSlideCount,
              slideCount,
              ExplanationAnimation: ExplanationAnimation,
              slideTotal,
            },
        },
        {
          component: Questions,
          props: {
              title: "Snelheid en Versnelling",
              description:
              "Wat weet je over de snelheid als er een constante versnelling plaatsvindt?",
              questions: sortedQuestions,
              assignmentNumber: 5,
              isFocused,
              setSlideCount,
              nextSlideHandler,
              prevSlideHandler,
              slideCount,
              performedMeasurement: true,
              customMeasurement: true,
              currentExerciseLesson: 2,
              slideTotal,
            },
        },
        {
          component: Explanation,
          props: {
              nextSlideHandler,
              prevSlideHandler,
              typing,
              setTyping,
              answer: TheoryExplanation.ProjetOneNewtonsLaws,
              thread_id: 7,
              topic: "Newtons Wetten",
              isFocused,
              setSlideCount,
              slideCount,
              ExplanationAnimation: ExplanationAnimation,
              slideTotal,
            },
        },
        {
          component: Questions,
          props: {
              title: "Resulterende Kracht",
              description:
              "Wat betekent de resulterende kracht? Weet je welke formule daarbij hoort en waar deze formule vandaan komt? Hint: De versnelling is constant.",
              questions: sortedQuestions,
              assignmentNumber: 6,
              isFocused,
              setSlideCount,
              nextSlideHandler,
              prevSlideHandler,
              slideCount,
              generate_answer: generateAnswerMotorQ5,
              normal_and_multiple_choice: true,
              currentExerciseLesson: 3,
              slideTotal,
            },
        },
        {
          component: IntroScreenQuestions,
          props: {
              nextSlideHandler,
              prevSlideHandler,
              typing,
              setTyping,
              answer: ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_12.answer,
              thread_id: ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_12.thread_id,
              title: "Evenwijdige lijnen",
              description: "Wat voor grafiek zien we hier? Wat voor consequenties heeft dit op de gegeven mogelijke antwoorden?",
              isFocused,
              setSlideCount,
              slideCount,
              slideTotal,
            },
          },
          {
            component: Questions,
            props: {
              title: "Kapotte Motoren",
              description: `Gebasseerd op de data die jij hebt verzameld, kan je bepalen welke motor kapot is. Niet elke motor is hetzelfde, daarom rekenen we met marges van ± 10%. In de haakjes, (), staat jouw gevonden waarde 
  
1. De gemiddelde versnelling ligt tussen de ${((parseFloat(answersStudent[2]) - 0.06).toFixed(2))} en ${((parseFloat(answersStudent[2]) + 0.06).toFixed(2))} m/s². \nJouw test: a = ${answersStudent[2]} ± 0.06 m/s²

2. De gemiddelde snelheid tijdens de meeting is niet lager dan ${((parseFloat(answersStudent[1]) - 0.04).toFixed(2))} m/s. \nJouw test: vgem = ${answersStudent[1]} ± 0.04 m/s

3. De afgelegde afstand na 15 seconde is hoger dan ${(15 * (parseFloat(answersStudent[0])  - answersStudent[0] / 10).toFixed(2))} m \nJouw test: s = ${answersStudent[0]} m/s • 15 s → ${15 * (parseFloat(answersStudent[0])  - answersStudent[0] / 10).toFixed(2)} ± ${answersStudent[0]} m

4. De maximale snelheid is niet hoger dan ${0.33} m/s \n*Waarde gevonden door andere crew*

5. Als gaspedaal wordt losgelaten, staat de motor in minder dan ${1.1} seconde stil. \n*Waarde gevonden door andere crew*     

Geef ook de bijbehorende ongelijkheidstekens aan die bij de eisen horen.
            
            `, 
              questions: sortedQuestions,
              assignmentNumber: 7,
              isFocused,
              setSlideCount,
              nextSlideHandler,
              prevSlideHandler,
              slideCount,
              CustomContainer: ProjectOneCustomContainer,
              performedMeasurement: true,
              answersStudent,
              customMeasurement: true,
              currentExerciseLesson: 3,
              slideTotal,
            },
        },
        {
          component: ThinkScreen,
          props: {
            nextSlideHandler,
            prevSlideHandler,
            slideCount,
            isFocused,
            topic: "Beweging",
            questions: [
              "Reflecteer op jullie eerste bevindingen",
              "Welke nieuwe kennis heb je opgedaan?",
              "Hoe zou je aanpak veranderen met jouw nieuwe kennis?",
              "",
              "Zijn jullie het nog steeds met elkaar eens over jullie oorspronkelijke bevindingen? Waarom wel/niet?",
            ],
            slideCountEnd: true,
            slideTotal,
            setSlideCount,
            slideCount,
          }
        },
    ];



    const onScroll = event => {
        // If a manual scroll is in progress, do not run onScroll logic
        if (scrollCtx.manualScrollRef.current) {
          scrollCtx.manualScrollRef.current = false;
            return;
        }

        scrollPositionRef.current = event.nativeEvent.contentOffset.x;
        const slide = Math.round(scrollPositionRef.current / SCREEN_WIDTH);
        if (slide !== slideCount - 1) {
          setSlideCount(slide + 1);
        }
    };

    const setSlideCountHandler = (slide) => {
        setIsLoading(true);
        setSlideCount(slide);
    }




    const renderItem = ({ item, index }) => {
        console.log('Rendering item at index:', index);
        const CurrentScreen = item.component;
        return <CurrentScreen {...item.props} 
        currentSlidePosition = {flatListRef} 
        index = {index}
        />;
    };

    console.log('Check is lOading', isLoading)
    console.log('slideCount', slideCount)
    
    return (
        <View style = {styles.topBorder}>
        {slideCount === 0 && 
        <QuestionsMap 
        numTiles = {slideTotal}
        onPress={setSlideCountHandler}
        slideCount = {slideCount}
        /> } 
        {slideCount > 0 &&
          <FlatList
            ref={flatListRef}
            data={SCREENS}
            horizontal
            pagingEnabled
            removeClippedSubviews
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(_, index) => 'screen-' + index}
            getItemLayout={(data, index) => (
              { length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index }
            )}
            initialNumToRender={Platform.OS === 'ios' ? 5 : 3} // Render 2 items initially
            maxToRenderPerBatch={Platform.OS === 'ios' ? 5 : 3} // Render 2 items in each batch
            windowSize={Platform.OS === 'ios' ? 5 : 3} // Render the visible screen and one offscreen in both directions
            onScroll={event => {
                // Throttle your scroll event here
                onScroll(event);
            }}
            onScrollBeginDrag={onScrollBeginDrag}
            onMomentumScrollEnd={event => {
              onScrollEndDrag(event)
              scrollCtx.setIsLoading(false);
            }}
            initialScrollIndex={isScrolling ? null : slideCount - 1}
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
