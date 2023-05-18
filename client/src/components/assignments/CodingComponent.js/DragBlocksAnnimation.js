import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ColorsBlue } from '../../../constants/palet';
import PressableButton from '../../robot/robot_commands/PressableButton';
import LightBulbAnimation from './LightBulbAnimation';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { cond, eq, set, useCode } from 'react-native-reanimated';
import DragableBlock from './DragableBlock';
import Border from './Border';

function DragBlocksAnimation() {
    const borderRef = useRef(null);

    const handleDrop = useCallback((dropData, borderRef) => { // Wrap with useCallback
        if (borderRef.current) {
            borderRef.current.measure((x, y, width, height, pageX, pageY) => {
                const dropX = dropData.offsetX;
                const dropY = dropData.offsetY;

                console.log('pageX: ', pageX);
                console.log('pageY: ', pageY);
                console.log('dropX: ', dropX);
                console.log('dropY: ', dropY);
                
                console.log('Block dropped');
                if (
                    dropX >= pageX &&
                    dropX <= pageX + width &&
                    dropY >= pageY &&
                    dropY <= pageY + height
                ) {
                    console.log('Block dropped inside the border');
                    // Handle the block drop inside the border
                }
            });
        }
    }, []); // Pass an empty dependency array
    
    return (
      <>
        <LightBulbAnimation exercise />
          <View style={[styles.conditions, {paddingVertical: 20}]}>
              <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.text}>if</Text>
                  <Border 
                  text = "Conditie = rechts"
                  extraStyle={{marginRight: 0, marginLeft: 10}}/>
              </View>

              <Border 
              text = "Actie"
              />

              <Text style={[styles.text, { marginTop: 5 }]}>else</Text>
              <Border 
              text = "Actie"
              />
              </View>


              <View>
              <DragableBlock
              text="rechts"
              onDrop={(dropData) => handleDrop(dropData, borderRef)}
              />
              <DragableBlock
              text="links"
              onDrop={(dropData) => handleDrop(dropData, borderRef)}
              />
              <DragableBlock
              text="motor aan"
              onDrop={(dropData) => handleDrop(dropData, borderRef)}
              />
              <DragableBlock
              text="motor uit"
              onDrop={(dropData) => handleDrop(dropData, borderRef)}
              />
              </View>
          </View>
      </>
    );
}

export default React.memo(DragBlocksAnimation);

const styles = StyleSheet.create({
  conditions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: ColorsBlue.blue1390,
    marginTop: 8,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: `rgba(77, 77, 77, 0.2)`,
    borderRadius: 20,
    shadowColor: `rgba(0, 0, 0, 1)`,
    shadowOffset: { height: 3, width: 1 },
    shadowRadius: 3,
    shadowOpacity: 1,
    elevation: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ColorsBlue.blue100,
    marginLeft: 10,
  },
  draggableBlock: {
    zIndex: 100,

  },
  border: {
    width: 140,
    height: 40,
    borderColor: ColorsBlue.blue1100,
    backgroundColor: ColorsBlue.blue1000,
    borderWidth: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 10
  }
});