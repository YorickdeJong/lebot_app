import React, { useContext, useEffect, useRef, useState,  } from 'react';
import { Animated, View, StyleSheet, Dimensions, FlatList } from 'react-native';
import { ASSIGNMENT_EXPLANATION } from '../../../../data/InitialAssignmentExplanation';
import BatteryScreen from '../../BuildComponent.js/BatteryScreen';
import { ScrollContext } from '../../../../store/scroll-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


function InformationBuildScreenOne({isFocused}) {
    const [slideCount, setSlideCount] = useState(1);
    const [typing, setTyping] = useState(true);
    const flatListRef = useRef(1);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollPositionRef = useRef(0);
    const scrollCtx = useContext(ScrollContext)

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
            message: ASSIGNMENT_EXPLANATION.BUILDSCREEN_1,
            title: "Mars Rover",
            description: "We zijn neergestord op een onbekende planeet die dezelfde eigenschappen heeft als de aarde. We kunnen de buitenlucht helaas niet inademen, daarom gaan we een rover bouwen die ons kan helpen bij het bereiken van een ontdekte basis.",  //your description
            video: require('./../../../../../assets/marsVideo.mp4'),
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
            message: ASSIGNMENT_EXPLANATION.BUILDSCREEN_2,
            title: "Batterij Aansluiten",
            description: "Sluit de batterij aan op het blauwe bordje. De rode draad moet altijd in de plus kant en de blauwe draad in de min kant. Als het groene lampje gaat branden, dan weet je dat je het goed hebt gedaan.",  //your description
            video: require('./../../../../../assets/marsVideo.mp4'),
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
              message: ASSIGNMENT_EXPLANATION.BUILDSCREEN_3,
              title: "Motor Aansluiten",
              description: "Sluit nu de motor aan op het blauwe bordje. De rode draad moet aan de meest linker kant van de zwarte aansluiting. Sluit motor 1 aan op M1, motor 2 op M2, enzovoort",  //your description
              video: require('./../../../../../assets/batterijFilm.mp4'),
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
              message: ASSIGNMENT_EXPLANATION.BUILDSCREEN_3,
              title: "Motor Aansluiten",
              description: "Sluit nu de motor aan op het blauwe bordje. De rode draad moet aan de meest linker kant van de zwarte aansluiting. Sluit motor 1 aan op M1, motor 2 op M2, enzovoort",  //your description
              video: require('./../../../../../assets/BatterijFilm2.mp4'),
              isFocused,
              setSlideCount,
              slideTotal,
            }
          },
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
            initialNumToRender={2} // Render 2 items initially
            maxToRenderPerBatch={2} // Render 2 items in each batch
            windowSize={2} // Render the visible screen and one offscreen in both directions
            initialScrollIndex={isScrolling ? null : slideCount - 1}
        />
      );
}

export default InformationBuildScreenOne;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
    },
});
