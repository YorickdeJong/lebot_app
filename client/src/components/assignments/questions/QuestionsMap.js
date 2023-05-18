import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ImageBackground,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {  Ellipse,  } from 'react-native-svg';
import { ColorsBlue } from '../../../constants/palet';
import Planets from './Planets';
import { useContext } from 'react';
import Icon from '../../Icon';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');


function QuestionsMap({ numTiles, onPress }) {
    const [orbitAnimation] = useState(new Animated.Value(0)); //state that holds instance of orbits
    const loopTime = 30000
    const navigation = useNavigation();

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
    }, [orbitAnimation]);

    const tileSize = 38
    const centerX = width / 2;
    const centerY = 0.82 * height / 2 ;
    const maxOrbitRadius = height > 750 ? 180 : 140;
    const ellipticalFactor = 1.7;


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

    // calcualtes orbit position
    const getOrbitPosition = (i, size) => {
        const angleOffset = 2 * Math.PI * Math.random(); // determines starting position of orbit
        const orbitRadius = (maxOrbitRadius * (i + 1)) / numTiles + 20; // determines radius of orbit
        const positionX = orbitAnimation.interpolate({
            ...withFunction((value) => centerX + orbitRadius * Math.cos(angleOffset + 2 * Math.PI * value )- size / 2),
            extrapolate: "clamp",
        });
        const positionY = orbitAnimation.interpolate({
            ...withFunction((value) => centerY + ellipticalFactor * orbitRadius * Math.sin(angleOffset + 2 * Math.PI * value ) - size / 2),
            extrapolate: "clamp",
        });
        return { x: positionX, y: positionY};
    };
    
    const tiles = [];
    for (let i = 0; i < numTiles; i++) {
        let size;
        if (i === 1 ) {
            size = tileSize * (0.6 + 0.4 * Math.random()); // Random size between 0.8 and 1.2 times the base tileSize
        }
        else{
            size = tileSize * (0.8 + 0.4 * Math.random()); // Random size between 0.8 and 1.2 times the base tileSize
        }
        if (i === 0) {
            // Assignment 1 (central tile)
            tiles.push(
                <Planets
                key={1}
                tileNumber={1}
                size={tileSize}
                x={centerX - tileSize / 2 }
                y={centerY - tileSize / 2 }
                onPress={onPress}
                />
            );
        } 
        else {
            // Get the position of the orbit for each tile
            const { x: positionX, y: positionY } = getOrbitPosition(i - 1, size);
            // Use positionX and positionY as translateX and translateY values causing a rotation
            tiles.push(
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
    }

    function homeNavigatorHandler(){
        navigation.navigate('Assignments', {screen: 'AssignmentsResults'})
    }

    return (
        <LinearGradient
            colors={['rgba(2,2,13,1)', 'rgba(2,2,8,1)']}  
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <ImageBackground
            source={require('./../../../../assets/chatbackground.png')}
            style={styles.container}
            imageStyle={{ opacity: 0.07 }}
            >
            <View style = {{position: 'absolute', top: '2%', left: '3%', zIndex: 10}}>
                <Icon 
                    icon = 'home'
                    onPress = {homeNavigatorHandler}
                    size = {26}
                    color = {ColorsBlue.blue500}
                />
            </View>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                {/* Draws orbits */}
                {Array.from({ length: numTiles - 1 }, (_, i) => i + 1).map((_, i) => {
                    const orbitRadius = (maxOrbitRadius * (i + 1)) / numTiles + 20;
                    return (
                        <Svg key={`orbit-${i}`} width="100%" height="100%" style={{ position: 'absolute' }}>
                            <Ellipse
                                cx={centerX}
                                cy={centerY}
                                rx={orbitRadius}
                                ry={orbitRadius * ellipticalFactor}
                                stroke={ColorsBlue.blue900}
                                strokeWidth={0.6}
                                fill="none"
                            />
                        </Svg>
                    );
                })}
                {/* Draws assignments */}
                {tiles}
            </ScrollView>
            </ImageBackground>
        </LinearGradient>
    );
}

export default React.memo(QuestionsMap)

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

