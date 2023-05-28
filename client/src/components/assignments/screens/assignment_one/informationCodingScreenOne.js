import React, { useState, useEffect, useRef, useContext,  } from 'react';
import { Animated, Keyboard,  StyleSheet, Dimensions} from 'react-native';
import { ASSIGNMENT_EXPLANATION } from '../../../../data/InitialAssignmentExplanation';
import BatteryScreen from '../../BuildComponent.js/BatteryScreen';
import IntroScreen from '../../BuildComponent.js/IntroScreen';
import CodingExample from '../../CodingComponent.js/CodingExample';
import ExampleExercise from '../../CodingComponent.js/ExampleExercise';
import { ShowIconsContext } from '../../../../store/show-icons-context';
import { FlatList } from 'react-native-gesture-handler';
import { ScrollContext } from '../../../../store/scroll-context';
import { useIsFocused } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


function InformationCodingScreenOne({isFocused}) {
    const [slideCount, setSlideCount] = useState(1);
    const [typing, setTyping] = useState(true);
    const showIconCtx = useContext(ShowIconsContext);
    const flatListRef = useRef(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollPositionRef = useRef(0);
    const scrollCtx = useContext(ScrollContext)
    const isFocusedScreen = useIsFocused();
    //upon changing to this screen, set the thread id to the first thread id

    console.log(`check CodingScreen`)

    useEffect(() => {
        console.log(slideCount)
    }, [slideCount])

    useEffect(() => {
        function navigateToSlide() {
            flatListRef.current.scrollToOffset({
              offset: (slideCount - 1) * SCREEN_WIDTH,
              animated: true, // You can set to false if you don't want animation
            });
          }
          
          navigateToSlide()
    }, [slideCount])

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
        showIconCtx.setShowIconsHandler('chatgpt')
    }

    const slideTotal = 3
    const SCREENS = [
        { 
          component: BatteryScreen,
          props: {
            nextSlideHandler,
            prevSlideHandler,
            slideCount,
            setTyping,
            typing,
            message: ASSIGNMENT_EXPLANATION.CODINGSCREEN_1,
            title: "Coderen Wat Is Dat?",
            description: "In dit deel ga jij je eerste code schrijven waarmee je de motoren kan bedienen. Wist je dat coderen op bijna elke universitaire studie wordt gegeven tegenwoordig?",
            video: require('./../../../../../assets/coderenIntro.mp4'),
            isFocused,
            setIcon: IconHandler,
            screenType: "coding",
            setSlideCount,
            slideTotal,
          }
        },
        {
          component: CodingExample,
          props: {
            nextSlideHandler,
            prevSlideHandler,
            slideCount,
            setTyping,
            typing,
            message: ASSIGNMENT_EXPLANATION.CODINGSCREEN_2,
            title: "Aan en Uit Schakelen",
            description: "Coderen?? Waarom hebben we dat nodig? Coderen is één van de handigste tools die je kan bezitten. Je komt er in het dagelijksleven het meest mee in aanraking, dus waarom zou je niet willen leren hoe het werkt?",
            isFocused,
            setSlideCount,
            slideTotal,
          }
        },
        {
            component: BatteryScreen,
            props: {
              nextSlideHandler,
              prevSlideHandler,
              slideCount,
              setTyping,
              typing,
              message: ASSIGNMENT_EXPLANATION.CODINGSCREEN_3,
              video: require('./../../../../../assets/ifelse.mp4'),
              title: "Jouw Eerste Code",
              description: "In dit deel leer je hoe if else statements werken. Dit is een van de belangrijkste onderdelen van het coderen. Je kan hiermee bijvoorbeeld de lamp uit het vorige deel laten branden als het donker is. If else statements kan je vergelijken met een waar of niet waar uitspraak. Bekijk deze uitspraak: 'Ik doe de lamp aan'. Als deze uitspraak waar is doe ik daadwerkelijk de lamp aan (dit is de actie), als de uitspraak niet waar is doe ik de lamp uit (dit is de actie).",
              isFocused,
              setSlideCount,
              slideTotal,
            }
        }
    ]
    
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

    useEffect(() => {
      if (!isScrolling) {
        const slide = Math.round(scrollPositionRef.current / SCREEN_WIDTH);
        
      }
    }, [isScrolling, slideCount]);
    
    const onScrollBeginDrag = () => setIsScrolling(true);
    const onScrollEndDrag = () => setIsScrolling(false);

    const renderItem = ({ item, index }) => {
        const CurrentScreen = item.component;
        return <CurrentScreen {...item.props} currentSlidePosition = {flatListRef} index = {index}/>;
    };

    if (!isFocusedScreen){
      return 
    }
    return (
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
              onScroll={event => {
                  // Throttle your scroll event here
                  onScroll(event);
              }}
              onScrollBeginDrag={onScrollBeginDrag}
              onMomentumScrollEnd={event => {
                onScrollEndDrag(event)
                scrollCtx.setIsLoading(false);
              }}
          />
    );
}

export default InformationCodingScreenOne;

const styles = StyleSheet.create({

})