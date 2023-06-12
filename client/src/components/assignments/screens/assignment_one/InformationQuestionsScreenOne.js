import { View, Text, StyleSheet, Button, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import QuestionsMap from '../../questions/QuestionsMap';
import IntroScreenQuestions from '../../questions/IntroScreenQuestions';
import { ASSIGNMENT_EXPLANATION } from '../../../../data/InitialAssignmentExplanation';
import Explanation from "../../Explanation/Explanation";
import { ColorsBlue } from '../../../../constants/palet';
import Questions from '../../questions/Questions';
import { ChartContext } from '../../../../store/chart-context';
import { checkDataCorrectnessHandlerMotorQ2 } from '../../questions/verifyDataFunctions';
import { generateAnswerConstantSlope, generateAnswerMotorQ4, generateAnswerMotorQ5, generateAnswerMotorQ6 } from '../../questions/generateAnswers';
import { getSpecificAssignmentsDetail } from '../../../../hooks/assignmentDetails';
import { UserProfileContext } from '../../../../store/userProfile-context';
import ProjectOneCustomContainer from '../../questions/CustomQuestionContainers/ProjectOneCustomContainer';
import { ShowIconsContext } from '../../../../store/show-icons-context';
import ExplanationAnimation from '../../Explanation/ExplanationAnimation';
import { TheoryExplanation } from '../../../../data/TheoryExplanation';
import ThinkScreen from '../../questions/ThinkScreen';
import { ScrollContext } from '../../../../store/scroll-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';



const { width: SCREEN_WIDTH } = Dimensions.get('window');

function InformationQuestionsScreenOne({ assignmentTopic, isFocused, initSlideCount }) {
    const [slideCount, setSlideCount] = useState(initSlideCount);
    const [typing, setTyping] = useState(true);
    const { chartToggle, setChartToggleHandler } = useContext(ChartContext)
    const userprofileCtx = useContext(UserProfileContext);

    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    const showIconCtx = useContext(ShowIconsContext);
    const flatListRef = useRef(1);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollPositionRef = useRef(0);
    const scrollCtx = useContext(ScrollContext)
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const onScrollBeginDrag = () => setIsScrolling(true);
    const onScrollEndDrag = () => setIsScrolling(false);
    // const [screenFocussed, setScreenFocussed] = useState(true);
    const screenFocussed = useIsFocused();




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



    //Filter out assignments for the correct subject
    const questions = assignmentTopic.filter(item => item.subject === "MOTOR"); //maybe also filter for Vragen Opdrcht hier
    const sortedQuestions = questions.sort((a, b) => a.assignment_number - b.assignment_number);

    const nextSlideHandler = useCallback(() => {
        console.log(`next slide handled`)
        setSlideCount(slideCount + 1);
        // Calculate the offset to scroll to
        const offset = (slideCount) * SCREEN_WIDTH;
        flatListRef.current.scrollToOffset({ offset, animated: false });
        setTyping(true);
    }, [slideCount]);

    const prevSlideHandler = useCallback(() => {
        console.log(`prev slide handled`);
        setSlideCount(slideCount - 1);
        const offset = (slideCount - 2) * SCREEN_WIDTH;
        flatListRef.current.scrollToOffset({ offset, animated: false });
        setTyping(true);
    }, [slideCount]);



    function IconHandler() {
      showIconCtx.setShowIconsHandler('robotStore')
    }

    // vraag 6: '',
    // vraag 7: 'Verschillende Richting'

    const slideTotal = 17 // number + 1
     const SCREENS = useMemo(() => {
      return [
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
            text: {text: 'Introductie', left: '38%'}
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
              "\nDiscussieer met je team over de volgende onderwerpen: \n\n• Snelheid en Versnelling \n• Lineaire Lijnen en Hellingen \n• (s,t) en (v,t) Grafieken\n",
              "Welke kennis heb je al?",                                                                                                                                                                                                                                                                                                                                                                                                                                   
              "Welke vergelijkingen zou je kunnen gebruiken?",
              "",
              "Zijn jullie het eens met elkaar? Waarom wel/niet?",
            ],

            setSlideCount,
            slideTotal,
            assignmentNumber: 0,
            subject: "MOTOR",
            slideCount,
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
            slideTotal,
            text: {text: 'Meten', left: '43%'}
          },
      },
      {
        component: Questions,
        props: {
            questions: sortedQuestions,
            assignmentNumber: 1,
            isFocused,
            setSlideCount,
            nextSlideHandler,
            prevSlideHandler,
            slideCount,
            currentExerciseLesson: 1,
            slideTotal,
            questionTitle: "Afstand en Snelheid",
            showZeroVelocityPlot: true,
            answerHandler: (index) => [
              'We zien hier een lijn vormen waarbij de afstand 0 blijft. v = ds / dt. Dus als ds (verandering in afstand) 0 is, is v (snelheid) ook 0 en dus zijn de afstand en snelheid niet positief, maar beide 0',
              'We zien hier een lijn vormen waarbij de afstand 0 blijft. v = ds / dt. Dus als ds (verandering in afstand) 0 is, is v (snelheid) ook 0.',
              'We zien hier een lijn vormen waarbij de afstand 0 blijft. v = ds / dt. Dus als ds (verandering in afstand) 0 is, is v (snelheid) ook 0 en dus zijn de afstand en snelheid niet negatief, maar beide 0',
          ][index],
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
            text: {text: 'Lineaire lijnen', left: '35%'}
          },
      },
      {
        component: Questions,
        props: {
            questions: sortedQuestions,
            assignmentNumber: 2,
            isFocused,
            setSlideCount,
            nextSlideHandler,
            prevSlideHandler,
            slideCount,
            performedMeasurement: true,
            normal_and_multiple_choice: true,
            currentExerciseLesson: 2,
            slideTotal,
            questionTitle: 'Lineaire lijnen',
            answerHandler: (index) => [
              'We bepalen de snelheid met v = ds / dt, het verschil in afstand gedeeld door het verschil in tijd. Vergelijk dit maar met de helling van een lijn: a = dy / dx, het verschil in y gedeeld door het verschil in x. y = s en x = t, dus a = ds / dt = v.',
              'We bepalen de snelheid met v = ds / dt, het verschil in afstand gedeeld door het verschil in tijd. Vergelijk dit maar met de helling van een lijn: a = dy / dx, het verschil in y gedeeld door het verschil in x. y = s en x = t, dus a = ds / dt = v.',
          ][index],
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
              checkDataCorrectnessHandler: checkDataCorrectnessHandlerMotorQ2, //checks correctness of data
              normal_and_multiple_choice: true,
              generate_answer: generateAnswerConstantSlope, //generates answer based on measurement
              performedMeasurement: true,
              currentExerciseLesson: 3,
              slideTotal,
              questionTitle: "Lineaire lijnen"
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
              topic: "",
              isFocused,
              setSlideCount,
              slideCount,
              ExplanationAnimation: ExplanationAnimation,
              slideTotal,
              text: {text: 'Acceleratie', left: '37%'}
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
              normal_and_multiple_choice: true,
              performedMeasurement: true,
              generate_answer: generateAnswerMotorQ4,
              currentExerciseLesson: 2,
              slideTotal,
              questionTitle: 'Constante Versnelling'
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
              text: {text: 'Krachten & Versnelling', left: '25%'}
            },
        },
        {
          component: Questions,
          props: {
              questions: sortedQuestions,
              assignmentNumber: 5,
              isFocused,
              setSlideCount,
              nextSlideHandler,
              prevSlideHandler,
              slideCount,
              currentExerciseLesson: 2,
              slideTotal,
              generate_answer: generateAnswerMotorQ5,
              normal_and_multiple_choice: true,
              questionTitle: 'Netto Kracht',
              answerHandler: (index) => [
                'De wrijvingskracht werkt altijd in tegenovergestelde richting van de bewegingsrichting. Dus als de netto kracht wordt meegenomen wordt Fnetto = Fmotor - Fwrijv, de netto kracht wordt dus kleiner.',
                'De wrijvingskracht werkt altijd in tegenovergestelde richting van de bewegingsrichting. Dus als de netto kracht wordt meegenomen wordt Fnetto = Fmotor - Fwrijv, de netto kracht wordt dus kleiner.',
                'De wrijvingskracht werkt altijd in tegenovergestelde richting van de bewegingsrichting. Dus als de netto kracht wordt meegenomen wordt Fnetto = Fmotor - Fwrijv, de netto kracht wordt dus kleiner.',
            ][index],
            },
        },
        {
          component: Questions,
          props: {
              questions: sortedQuestions,
              assignmentNumber: 6,
              isFocused,
              setSlideCount,
              nextSlideHandler,
              prevSlideHandler,
              slideCount,
              generate_answer: generateAnswerMotorQ6,
              currentExerciseLesson: 3,
              slideTotal,
              questionTitle: 'Afstand en verplaatsing',
              chatgptAnswer: true,
              removeTries: true,
            },
        },
        {
        component: Questions,
        props: {
            questions: sortedQuestions,
            assignmentNumber: 7,
            isFocused,
            setSlideCount,
            nextSlideHandler,
            prevSlideHandler,
            slideCount,
            generate_answer: generateAnswerMotorQ6,
            currentExerciseLesson: 3,
            slideTotal,
            questionTitle: 'Afstand en verplaatsing',
            performedMeasurement: true,
            answerHandler: (index) => [
              'Bij verplaatsing kijken we naar zowel de grootte als de richting van de afgelegde weg. Als iets een richting heeft dan kan de waarde zowel positief als negatief zijn.',
              'Bij verplaatsing kijken we naar zowel de grootte als de richting van de afgelegde weg. Als iets een richting heeft dan kan de waarde zowel positief als negatief zijn.',
              'Bij verplaatsing kijken we naar zowel de grootte als de richting van de afgelegde weg. Als iets een richting heeft dan kan de waarde zowel positief als negatief zijn.',
              'Bij afstand kijken we alleen naar de grootte van de afgelegde weg. Als iets een richting heeft dan is de waarde altijd positief.',
              'Bij afstand kijken we alleen naar de grootte van de afgelegde weg. Als iets een richting heeft dan is de waarde altijd positief.',
              'Bij afstand kijken we alleen naar de grootte van de afgelegde weg. Als iets een richting heeft dan is de waarde altijd positief.',
          ][index],
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
              text: {text: 'Onderzoek', left: '39%'}
            },
          },
          {
            component: Questions,
            props: {
              questions: sortedQuestions,
              assignmentNumber: 8,
              isFocused,
              setSlideCount,
              nextSlideHandler,
              prevSlideHandler,
              slideCount,
              CustomContainer: ProjectOneCustomContainer,
              performedMeasurement: true,
              customMeasurement: true,
              currentExerciseLesson: 3,
              slideTotal,
              questionTitle: 'Kapotte motoren'
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
              "",
              "Hoe zou je je aanpak veranderen met jouw nieuwe kennis?",
              "Zijn jullie het nog steeds met elkaar eens over jullie oorspronkelijke bevindingen? Waarom wel/niet?",
            ],
            slideCountEnd: true,
            slideTotal,
            setSlideCount,
            assignmentNumber: 8,
            subject: "MOTOR",
            slideCount,
          }
        },
      ]
    },[nextSlideHandler, prevSlideHandler, typing, setTyping, isFocused, setSlideCount, slideCount, slideTotal]);



    const onScroll = useCallback(event => {
        if (scrollCtx.manualScrollRef.current) {
            scrollCtx.manualScrollRef.current = false;
            return;
        }
        scrollPositionRef.current = event.nativeEvent.contentOffset.x;
        const slide = Math.round(scrollPositionRef.current / SCREEN_WIDTH);
        if (slide !== slideCount - 1) {
            setSlideCount(slide + 1);
        }
    }, [slideCount]);

    const setSlideCountHandler = useCallback(slide => {
          setIsLoading(true);
          setSlideCount(slide);
    }, []);




    const renderItem = useCallback( ({ item, index }) => {
        const CurrentScreen = item.component;

        return <CurrentScreen {...item.props} 
        currentSlidePosition = {flatListRef} 
        index = {index}
        />;
    }, []);

    if (!screenFocussed){
      console.log("screen not focussed")
      return
    }
    
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
