import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ASSIGNMENT_EXPLANATION } from "../../../../data/InitialAssignmentExplanation";
import IntroScreenQuestions from "../../questions/IntroScreenQuestions";
import Questions from "../../questions/Questions";
import QuestionsMap from "../../questions/QuestionsMap";
import {View, StyleSheet, Dimensions} from 'react-native';
import { ColorsBlue } from "../../../../constants/palet";
import Explanation from "../../Explanation/Explanation";
import ExplanationAnimation from "../../Explanation/ExplanationAnimation";
import { TheoryExplanation } from "../../../../data/TheoryExplanation";
import BatteryScreen from "../../BuildComponent.js/BatteryScreen";
import SolarEvent from "../../../solar_events/SolarEvent";
import { UserProfileContext } from "../../../../store/userProfile-context";
import { ChartContext } from "../../../../store/chart-context";
import { ScrollContext } from "../../../../store/scroll-context";
import { FlatList } from "react-native";




const { width: SCREEN_WIDTH } = Dimensions.get('window');

function InformationQuestionsScreenTwo({assignmentTopic, assignmentNumber, initSlideCount, isFocused}){
    const [slideCount, setSlideCount] = useState(initSlideCount);
    const [typing, setTyping] = useState(true);
    const { chartToggle, setChartToggleHandler } = useContext(ChartContext)
    const flatListRef = useRef(1);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollPositionRef = useRef(0);
    const scrollCtx = useContext(ScrollContext)

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
        }, [])
      
        useEffect(() => {
          if (!isScrolling) {
            const slide = Math.round(scrollPositionRef.current / SCREEN_WIDTH);
            
          }
      }, [isScrolling, slideCount]);

        
    //Filter out assignments for the correct subject
    const questions = assignmentTopic.filter(item => item.subject === "LED");
    const sortedQuestions = questions.sort((a, b) => a.assignment_number - b.assignment_number);
    //upon changing to this screen, set the thread id to the first thread id

    console.log(`sortedQuestions`, sortedQuestions)



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


    const slideTotal = 13 // number + 1
    
    const SCREENS = useMemo(() => {
    return [
      {
        component: IntroScreenQuestions,
        props: {
          nextSlideHandler,
          prevSlideHandler,
          typing,
          setTyping,
          answer: ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_21.answer,
          thread_id: ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_21.thread_id,
          title: "Zonnestormen",
          description: "In dit deel moet jij ervoor zorgen dat de rover beschermd is tegen zonnestormen.",
          isFocused,
          setSlideCount,
          slideCount,
          video: require('./../../../../../assets/planets/solar_flare.mp4'),
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
          answer: TheoryExplanation.ProjectTwoOhm,
          thread_id: 7,
          topic: "Wet van Ohm",
          isFocused,
          setSlideCount,
          slideCount,
          ExplanationAnimation,
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
          answer: TheoryExplanation.ProjectTwoOhmTwo,
          thread_id: 7,
          topic: "Ohm en snelwegen",
          isFocused,
          setSlideCount,
          slideCount,
          ExplanationAnimation,
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
          answer: TheoryExplanation.ProjectTwoOhmTwo,
          thread_id: 7,
          topic: "Serie schakelingen",
          isFocused,
          setSlideCount,
          slideCount,
          slideTotal,
          ExplanationAnimation,
        },
      },
      {
        component: Explanation,
        props: {
          nextSlideHandler,
          prevSlideHandler,
          typing,
          setTyping,
          answer: TheoryExplanation.ProjectTwoOhmThree,
          thread_id: 7,
          topic: "Parallel schakelingen",
          isFocused,
          setSlideCount,
          slideCount,
          slideTotal,
          ExplanationAnimation,
        },
      },
      {
        component: Questions,
        props: {
          title: "Voltage bepalen",
          description: "In serie schakelingen is de spanning verdeeld over de weerstanden.",
          questions: sortedQuestions,
          assignmentNumber: 1,
          nextSlideHandler,
          prevSlideHandler,
          isFocused,
          setSlideCount,
          slideCount,
          slideTotal,
          currentExerciseLesson: 4,
        },
      },
      {
        component: Questions,
        props: {
          title: "Weerstand berekenen",
          description: "In serie schakelingen is de totale weerstand de som van alle weerstanden.",
          questions: sortedQuestions,
          assignmentTopic,
          assignmentNumber: 2,
          isFocused,
          setSlideCount,
          nextSlideHandler,
          prevSlideHandler,
          slideCount,
          slideTotal,
          currentExerciseLesson: 4,
        },
      },
      {
        component: Questions,
        props: {
          title: "Spanning in serie",
          description: "Spanning in serie schakelingen is over de hele schakeling gelijk.",
          questions: sortedQuestions,
          assignmentTopic,
          assignmentNumber: 3,
          isFocused,
          setSlideCount,
          nextSlideHandler,
          prevSlideHandler,
          slideCount,
          slideTotal,
          currentExerciseLesson: 4,
        },
      },
      {
        component: IntroScreenQuestions,
        props: {
          nextSlideHandler,
          prevSlideHandler,
          typing,
          setTyping,
          answer: ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_22.answer,
          thread_id: ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_22.thread_id,
          title: "Bouw de Schakeling",
          description: "Volg de video om de weerstand in de schakeling te bouwen.",
          isFocused,
          setSlideCount,
          slideTotal,
          slideCount,
        },
      },
      {
        component: Questions,
        props: {
          title: "Kwadratische Vergelijkingen",
          description: "Je leert hier functies herkennen, kwadratische vergelijkingen oplossen en de oplossingen van een vergelijking vinden. Deze kennis gebruiken we om te bepalen hoe lang de lamp kan branden op de accu van de rover",
          questions: sortedQuestions,
          assignmentTopic,
          assignmentNumber: 4,
          isFocused,
          setSlideCount,
          nextSlideHandler,
          prevSlideHandler,
          slideTotal,
          slideCount,
          performedMeasurement: true,
          currentExerciseLesson: 5,
        },
      },
      {
        component: IntroScreenQuestions,
        props: {
          nextSlideHandler,
          prevSlideHandler,
          typing,
          setTyping,
          answer: ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_23.answer,
          thread_id: ASSIGNMENT_EXPLANATION.ASSIGNMENTQUESTIONSINTRO_23.thread_id,
          title: "Test je setup",
          description: "Hoe beter jouw setup is, desde meer reactie tijd je krijgt om je te beschermen tegen de magnetische storemen.",
          isFocused,
          slideTotal,
          setSlideCount,
          slideCount,
          slideCountEnd: true,
        },
      },
      {
        component: SolarEvent,
        props: {
          isFocused,
          slideTotal,
          prevSlideHandler,
        },
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



export default InformationQuestionsScreenTwo

const styles = StyleSheet.create({
    topBorder: {
      flex: 1,
    }
  })
  