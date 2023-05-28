import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  ImageBackground,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  View,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {  Ellipse,  } from 'react-native-svg';
import { ColorsBlue } from '../../../constants/palet';
import Planets from './Planets';
import { useContext } from 'react';
import Icon from '../../Icon';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');


function QuestionsMap({ numTiles, onPress, slideCount }) {
    const isScreenFocused = slideCount === 0;
    const [orbitAnimation] = useState(new Animated.Value(0)); //state that holds instance of orbits
    const loopTime = 120000
    const navigation = useNavigation();
    const tileSize = 38
    const centerX = width / 2;
    const centerY = 0.82 * height / 2 ;
    const ellipticalFactor = 1.7;
    const maxOrbitRadius = height / (2.7 * ellipticalFactor)
    const homeNavigatorHandler = useCallback(() => { // Use useCallback to prevent unnecessary renders
        navigation.navigate('Assignments', {screen: 'AssignmentsResults'});
    }, [navigation]);


    //updates orbits when orbitAnimation changes
    useEffect(() => {
        const animate = () => {
          orbitAnimation.setValue(0);
          Animated.timing(orbitAnimation, {
            toValue: 1,
            duration: loopTime,
            easing: Easing.linear,
            useNativeDriver: true,
          })
          .start(({ finished }) => {
            if (finished) {
              animate();
            }
          });
        };
      
        animate();
    }, []);
        
    const angleOffsets = useMemo(() => {
        const angles = [];
        for (let i = 0; i < numTiles; i++) {
            const angleOffset = (2 * Math.PI * i * (4.13)) / numTiles;
            angles.push(angleOffset);
        }
        return angles;
    }, [numTiles]);
    
    const orbitRadii = useMemo(() => {
        const radii = [];
        for (let i = 0; i < numTiles; i++) {
            const orbitRadius = (maxOrbitRadius * (i + 1)) / numTiles;
            radii.push(orbitRadius);
        }
        return radii;
    }, [numTiles]);

    if (!isScreenFocused) {
        return
    }

    const tilesArray = useMemo(() => Array.from({ length: numTiles - 1 }, (_, i) => i + 1), [numTiles]);
    // const ellipses = useMemo(() => Array.from({ length: numTiles - 1 }, (_, i) => i + 1), [numTiles]);

    const ellipses = useMemo(() => {
        const svgArray = [];
        for (let i = 1; i < numTiles; i++) {
            const orbitRadius = (maxOrbitRadius * (i + 1)) / numTiles ;
            svgArray.push(
                <Ellipse
                    key={`orbit-${i}`}
                    cx={centerX}
                    cy={centerY}
                    rx={orbitRadius}
                    ry={orbitRadius * ellipticalFactor}
                    stroke={ColorsBlue.blue900}
                    strokeWidth={0.6}
                    fill="none"
                />
            );
        }
        return (
            <Svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
                {svgArray}
            </Svg>
        );
    }, [numTiles, centerX, centerY, maxOrbitRadius, ellipticalFactor]);
    
    return (
        <View style = {styles.container}>
            <View style = {{position: 'absolute', top: '2%', left: '3%', zIndex: 10,}}>
                    <Icon 
                        icon = 'home'
                        onPress = {homeNavigatorHandler}
                        size = {26}
                        color = {ColorsBlue.blue500}
                    />
                </View>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                {ellipses}
                {/* Draws orbits */}
                {tilesArray.map((_, i) => {
                    i = i + 1;
                    const size = i === 1 ? tileSize * (0.6 + 0.4 * Math.random()) : tileSize * (0.8 + 0.4 * Math.random());
                    const positionX = orbitAnimation.interpolate({
                        ...withFunction((value) => centerX + orbitRadii[i] * Math.cos(angleOffsets[i] + 2 * Math.PI * value) - size / 2),
                        extrapolate: "clamp",
                    });
                    const positionY = orbitAnimation.interpolate({
                        ...withFunction((value) => centerY + ellipticalFactor * orbitRadii[i] * Math.sin(angleOffsets[i] + 2 * Math.PI * value) - size / 2),
                        extrapolate: "clamp",
                    });
                    if (i === 1) { 
                        return (
                            <Planets
                            key={1}
                            tileNumber={1}
                            size={tileSize}
                            x={centerX - tileSize / 2 }
                            y={centerY - tileSize / 2 }
                            onPress={onPress}
                            />
                        )
                    }
                    else {
                        return (
                            <Animated.View
                                key={i + 1}
                                style={[
                                    { position: "absolute" },
                                    { transform: [{ translateX: positionX }, { translateY: positionY }] },
                                ]}
                            >
                                <Planets
                                    tileNumber={i + 1}
                                    size={size}
                                    x={0}
                                    y={0}
                                    onPress={onPress}
                                />
                            </Animated.View>
                        );
                }
            })}
        </ScrollView>
    </View>
    );
}



export default React.memo(QuestionsMap)


function withFunction(callback) {
    let inputRange = [], outputRange = [], steps = 60;
    
    /// input range 0-1
    for (let i=0; i<=steps; ++i) {
        let key = i/steps;
        inputRange.push(key);
        outputRange.push(callback(key));
    }
    return { inputRange, outputRange };
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        paddingTop: 15,
    },
    pressed: {
        opacity: 0.3,
    },
    tile: {
        backgroundColor: ColorsBlue.blue1300,
    }
});

