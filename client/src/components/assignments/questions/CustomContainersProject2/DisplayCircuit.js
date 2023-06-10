import { BlurView } from 'expo-blur'
import {View, Text, StyleSheet, Dimensions, Animated, Easing, InteractionManager} from 'react-native'
import { ColorsBlue, ColorsGray } from '../../../../constants/palet'
import { LinearGradient } from 'expo-linear-gradient'
import { useContext, useEffect, useState } from 'react';
import { getSpecificAssignmentsDetail } from '../../../../hooks/assignmentDetails';
import { UserProfileContext } from '../../../../store/userProfile-context';
import Icon from '../../../Icon';
import { useIsFocused } from '@react-navigation/native';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function DisplayCircuit({input, assignment_number, isFocused,}) {
    const userprofileCtx = useContext(UserProfileContext);
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    const [currentAnswer, setCurrentAnswer] = useState(assignment_number === 4 ? input : null);
    const [resistanceAnswer, setResistanceAnswer] = useState(assignment_number === 3 ? input : null);
    const [voltageAnswer, setVoltageAnswer] = useState(assignment_number === 2 && input);
    const [animationActive, setAnimationActive] = useState(false);

    const wireColorAnimation = new Animated.Value(0);
    const BatteryPosX = "16%"
    const BatteryPosY1 = "32%"
    
    console.log('assignmentNumber', assignment_number)
    
    useEffect(() => {
      if (animationActive) {
        const animateWireColor = () => {
            wireColorAnimation.setValue(0);
            Animated.timing(wireColorAnimation, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start(animateWireColor);
        };
    
          animateWireColor();

      }
    }, [animationActive]);
  
    useEffect(() => {
        const animateWireColor = () => {
            wireColorAnimation.setValue(0);
            Animated.timing(wireColorAnimation, {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start(animateWireColor);
        };
      
        animateWireColor();
    }, [isFocused]);


    const wireColor = wireColorAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [ColorsBlue.blue1000, ColorsBlue.blue100, ColorsBlue.blue1000],
      });

    const animatedStyles = {
      backgroundColor: wireColor,
    };
  
    useEffect(() => {
        async function fetchData() {
            const dataVoltage = await getSpecificAssignmentsDetail(school_id, class_id, group_id, 39, 'LED');
            if (dataVoltage && dataVoltage.answers_open_questions.length > 0) {

                //how to get answers from prev q too?
                const correctAnswersFromData = dataVoltage.answers_open_questions.filter(answer => answer.correct);
                setVoltageAnswer(correctAnswersFromData[0].answer)
            }
            const dataResistance = await getSpecificAssignmentsDetail(school_id, class_id, group_id, 40, 'LED');
            if (dataResistance && dataResistance.answers_open_questions.length > 0) {

                //how to get answers from prev q too?
                const correctAnswersFromData = dataResistance.answers_open_questions.filter(answer => answer.correct);
                setResistanceAnswer(correctAnswersFromData[0].answer)
            }
            const dataCurrent = await getSpecificAssignmentsDetail(school_id, class_id, group_id, 41, 'LED');
            if (dataCurrent && dataCurrent.answers_open_questions.length > 0) {

                //how to get answers from prev q too?
                const correctAnswersFromData = dataCurrent.answers_open_questions.filter(answer => answer.correct);
                setCurrentAnswer(correctAnswersFromData[0].answer)
            }
        }
        fetchData();
    }, [])
    
    return (
        <View style = {styles.container}>
            <BlurView intensity={15} tint = "dark" style = {styles.outerContainer}>
                <View style = {styles.header}>
                        <Text style = {styles.headerText}>{'Schakeling'}</Text>
                </View>

                <View style = {{position: 'absolute', top: "17%", left: '2%'}}>
                    <Icon 
                        icon = {animationActive ? "pause" : "play"}
                        size = {30}
                        color = {ColorsGray.gray400}
                        onPress={() => setAnimationActive(!animationActive)}
                    />

                </View>

                {/* Battery */}
                <LinearGradient 
                    style = {[styles.battery, {left: "5%"} ]}
                    colors={[ColorsBlue.blue1300, ColorsBlue.blue1000]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style= {[styles.batteryText, {marginBottom: 5}]}>+</Text>
                    <Text style= {[styles.batteryText, {fontSize: 18, marginBottom: 5}]}>Batterij</Text>
                    <Text style= {styles.batteryText}>U: +5V</Text>
                    <Text style= {[styles.batteryText, {marginTop: 5}]}>-</Text>
                </LinearGradient>
                {/* Wires */}

                <View style={[
                    { top: "8%", left: "24%"},
                    ]}>
                    <Text style = {{fontSize: 18, color: ColorsBlue.blue50}}>I: {currentAnswer ? currentAnswer + "A" : (input && assignment_number == 4 ? input + "A": '...')} </Text>
                </View>

                <Animated.View
                    style={[
                    styles.lineHorizontal,
                    { top: BatteryPosY1, left: BatteryPosX },
                    animatedStyles,
                    ]}
                />
                <Animated.View
                    style={[
                    styles.lineVertical,
                    { top: BatteryPosY1, left: BatteryPosX},
                    animatedStyles,
                    ]}
                />

                {/* Resistor */}
                <LinearGradient 
                    style = {[styles.Resistor ]}
                    colors={[ColorsBlue.blue1300, ColorsBlue.blue1000]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style= {[styles.batteryText, {fontSize: 18, marginBottom: 5}]}>Weerstand</Text>
                    <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 12}}>
                        <Text style= {styles.batteryText}>U: {voltageAnswer ? "+" + voltageAnswer + "V" : (input && assignment_number == 2 ? input + "V" : "...")}</Text>
                        <Text style= {styles.batteryText}>R: {resistanceAnswer ? resistanceAnswer + "Ω" : (input && assignment_number == 3 ? input + "Ω" : "...")}</Text>
                    </View>
                </LinearGradient>


                {/* Wires */}
                <Animated.View
                style={[
                        styles.lineVertical,
                        { top: BatteryPosY1, right: "12%", height: screenHeight * verticalScale(Platform.OS === 'ios' ? 0.13 : moderateScale(0.14)), },
                        animatedStyles                
                    ]}
                />
                <Animated.View
                    style={[
                        styles.lineHorizontal,
                        { top: BatteryPosY1, right: "12%", width: screenWidth * 0.142, },
                        animatedStyles
                    ]}
                />
                {/* Magnetic Protection device */}
                <LinearGradient 
                    style = {[styles.ProtectionDevice ]}
                    colors={[ColorsBlue.blue1300, ColorsBlue.blue1000]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style= {[styles.batteryText, {fontSize: 18, marginBottom: 5}]}>Becherming</Text>
                    <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 8}}>
                        <Text style= {styles.batteryText}>U: +0.5V</Text>
                        <Text style= {styles.batteryText}>R: 63Ω</Text>
                    </View>
                </LinearGradient>

                {/* Wires */}
                <Animated.View
                    style={[
                        styles.lineHorizontal,
                        { top: '86%', right: "31.5%", width: screenWidth * 0.50, },
                        animatedStyles
                    ]}
                />
                <Animated.View
                    style={[
                        styles.lineVertical,
                        { bottom: '17.5%', left: BatteryPosX, height: screenHeight * 0.038, },
                        animatedStyles
                    ]}
                />
            </BlurView>
        </View>
    )
}


export default DisplayCircuit


const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        paddingBottom: 10,
        borderRadius: 20,
    },
    battery: {
        position: 'absolute',
        top: '42%',
        zIndex: 1,
        height: 100,
        width: 80,
        borderColor: ColorsBlue.blue900,
        borderWidth: 1,
        justifyContent: 'center',
        borderRadius: 50
    },
    innerBattery: {
        flex: 1,
    },
    batteryText: {
        color: ColorsBlue.blue100,
        textAlign: 'center',
        fontSize: 14
    },
    Resistor: {
        position: 'absolute',
        top: '22%',
        left: '48%',
        height: 70,
        width: 120,
        borderColor: ColorsBlue.blue900,
        borderWidth: 1,
        justifyContent: 'center',
        zIndex: 1,
        borderRadius: 20
    },
    ProtectionDevice: {
        position: 'absolute',
        top: '70%',
        right: '5%',
        height: 80,
        width: 130,
        borderColor: ColorsBlue.blue900,
        borderWidth: 1,
        justifyContent: 'center',
        borderRadius: 20,
        zIndex: 1,
    },
    lineVertical: {
        position: 'absolute',
        width: 1,
        backgroundColor: ColorsBlue.blue500,
        height: screenHeight * 0.051,
    },
    lineHorizontal: {
        position: 'absolute',
        height: 1,
        backgroundColor: ColorsBlue.blue500,
        width: screenWidth * 0.31,
    },
    header: {
        height: 45,
        backgroundColor: ColorsBlue.blue1250, //`rgba(45, 45, 85, 0.6)`,
    },
    headerText: {
        color: ColorsBlue.blue100,
        fontSize: 25,
        paddingTop: 6,
        paddingRight: 0,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    container: {
        backgroundColor: 'rgba(8, 8, 40, 1)',
        height: 300,
        borderWidth: 1,
        borderColor: `rgba(77, 77, 77, 0.2)`,
        shadowColor: `rgba(11, 11, 11)`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 2,
        marginHorizontal: 8,
        borderRadius: 20,
        overflow: 'hidden'
    }
})