import React, { useState, useEffect, useRef, useContext,  } from 'react';
import { Animated, Keyboard,  StyleSheet, Dimensions} from 'react-native';
import { ASSIGNMENT_EXPLANATION } from '../../../../data/InitialAssignmentExplanation';
import BatteryScreen from '../../BuildComponent.js/BatteryScreen';
import IntroScreen from '../../BuildComponent.js/IntroScreen';
import CodingExample from '../../CodingComponent.js/CodingExample';
import { ShowIconsContext } from '../../../../store/show-icons-context';
import { FlatList } from 'react-native-gesture-handler';
import { ScrollContext } from '../../../../store/scroll-context';
import { useIsFocused } from '@react-navigation/native';
import CodingEditorExample from '../../CodingComponent.js/CodingEditorExample';


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

    const slideTotal = 4
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
            video: require('./../../../../../assets/coderenIntro.mp4'),
            isFocused,
            setIcon: IconHandler,
            screenType: "coding",
            setSlideCount,
            slideTotal,
            text: {text : 'Introductie', left: '37%'}
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
            isFocused,
            setSlideCount,
            slideTotal,
            text: {text : 'Voorbeeld', left: '37%'}
          }
        },
        {
            component: CodingEditorExample                                                                                                                                                                                                                                                ,
            props: {
              nextSlideHandler,
              prevSlideHandler,
              slideCount,
              setTyping,
              typing,
              message: ASSIGNMENT_EXPLANATION.CODINGSCREEN_3,
              isFocused,
              setSlideCount,
              slideTotal,
              text: {text : 'Lamp Aan/Uit', left: '33%'}
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

export default React.memo(InformationCodingScreenOne);

const styles = StyleSheet.create({

})