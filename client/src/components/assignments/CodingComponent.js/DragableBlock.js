import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ColorsBlue } from '../../../constants/palet';
import { PanGestureHandler, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  cond,
  eq,
  set,
  useCode,
  block,
  add,
  Value,
} from 'react-native-reanimated';

const DragableBlock = ({ text, onDrop, borderRef })  => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const blockRef = useRef(null);
    const dragX = new Animated.Value(0);
    const dragY = new Animated.Value(0);
    const gestureState = new Animated.Value(-1);

    useEffect(() => {
        if (blockRef.current) {
        blockRef.current.measure((x, y, width, height, pageX, pageY) => {
            setOffset({ x: pageX, y: pageY });
        });
        }
    }, []);

    const handleDropHandler = (event) => {
        event.persist(); // Add this line
        console.log('Block dropped');
        console.log(event.nativeEvent.translationX);
        console.log(onDrop)
        if (onDrop) {
            onDrop(
            {
                translationX: event.nativeEvent.translationX,
                translationY: event.nativeEvent.translationY,
                offsetX: offset.x,
                offsetY: offset.y,
            },
            borderRef // Add this line
            );
        }
    }
    

    const onGestureEventFunc = ({ nativeEvent }) => {
        dragX.setValue(nativeEvent.translationX);
        dragY.setValue(nativeEvent.translationY);
        gestureState.setValue(nativeEvent.state);
    };

    const onHandlerStateChangeFunc = (event) => {
        if (event.nativeEvent.state === State.END) {
                handleDropHandler(event);
                setOffset((prevOffset) => ({
                x: prevOffset.x + event.nativeEvent.translationX,
                y: prevOffset.y + event.nativeEvent.translationY,
            }));
            dragX.setValue(0);
            dragY.setValue(0);
        }
    };

    return (
        <Animated.View
            style={[
            styles.draggableBlock,
            {
                transform: [
                { translateX: add(offset.x, dragX) },
                { translateY: add(offset.y, dragY) },
                ],
            },
            ]}
        >
            <LongPressGestureHandler
            onHandlerStateChange={handleDropHandler} // Add this line
            minDurationMs={0}
            >
            <PanGestureHandler
                onGestureEvent={onGestureEventFunc}
                onHandlerStateChange={onHandlerStateChangeFunc}
            >
                <View ref={blockRef} style={styles.block}>
                <Text style={[styles.text]}>{text}</Text>
                </View>
            </PanGestureHandler>
            </LongPressGestureHandler>
        </Animated.View>
    );
}

export default React.memo(DragableBlock); //prevents the rerender of ExampleExercise to affect he DragBlock component to lose its state or event


const styles = StyleSheet.create({
  conditions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorsBlue.blue100,
  },
  draggableBlock: {
    zIndex: 100,
  },
  block: {
    zIndex: 100,
    width: 100,
    height: 40,
    marginVertical: 2, 
    backgroundColor: ColorsBlue.blue1100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 15,
  }
});