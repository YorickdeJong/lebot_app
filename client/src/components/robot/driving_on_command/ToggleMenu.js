import { StyleSheet, View,  Modal, Text, } from "react-native"
import Icon from "../../Icon"
import { ColorsBlue } from "../../../constants/palet"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from 'expo-blur';
import React, { useContext, useEffect, useState } from "react";
import ChartToggle from "./chartToggle";
import { ChartContext } from "../../../store/chart-context";
import { ChartOptionsContext } from "../../../store/chartOptions-context";
import BlurWrapper from "../../UI/BlurViewWrapper";



function ToggleMenu({toggleModalClose, isStopActive, assignmentNumber, subject}) {
    const chartCtx = useContext(ChartContext)
    const chartOptionsCtx = useContext(ChartOptionsContext)

    useEffect(() => {
        chartCtx.setTrueCount(Object.values(chartCtx.chartToggle).filter(value => value === true).length); //minus 1 here since time is always true
        
    }, [chartCtx.chartToggle, subject])

    const toggleChartSettings = (input) => {
        switch(input){
            case 's-t':
                chartCtx.setChartToggleHandler("s_t")
                break;
            case 'v-t':
                chartCtx.setChartToggleHandler("v_t")
                break;
            case 'p-t':
                chartCtx.setChartToggleHandler("p_t")
                break;
            case 'u-t':
                chartCtx.setChartToggleHandler("u_t")
                break;
            case 'i-t':
                chartCtx.setChartToggleHandler("i_t")
                break;
        }
    };

    return (
        <Modal 
        visible={isStopActive} 
        animationType="fade"
        transparent>
            <BlurWrapper style={styles.modalContainer} intensity={20} customColor={'rgba(40, 40, 80, 0.7)'}>
                <View style = {[styles.shadow, {marginBottom: assignmentNumber === 2 && subject === 'MOTOR' ? 0 : 100}]}>
                    <LinearGradient 
                    style = {[styles.modal]}
                    colors={[ColorsBlue.blue1200, ColorsBlue.blue1100]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                        >
                                <View style = {styles.header}>
                                    <View style = {styles.icon}>
                                        <Icon 
                                        icon="close" 
                                        size={30} 
                                        color={ColorsBlue.blue200} 
                                        onPress={toggleModalClose}
                                        />
                                    </View>
                                    <Text style = {styles.title}>Soorten Grafieken</Text>
                                    <Text />
                                </View>
                                <View style = {{justifyContent: 'center'}}>
                                    {subject === "MOTOR" && <ChartToggle 
                                    graphName = "s-t graph:"
                                    toggleChart = {chartCtx.chartToggle.s_t}
                                    toggleChartSettings = {toggleChartSettings.bind(this, 's-t')}
                                    />}

                                    {subject === "MOTOR" && <ChartToggle 
                                    graphName = "v-t graph:"
                                    toggleChart = {chartCtx.chartToggle.v_t}
                                    toggleChartSettings = {toggleChartSettings.bind(this, 'v-t')}
                                    />}

                                    {subject === "CAR" &&  <ChartToggle 
                                    graphName = "P-t graph:"
                                    toggleChart = {chartCtx.chartToggle.p_t}
                                    toggleChartSettings = {toggleChartSettings.bind(this, 'p-t')}
                                    />}
                                    
                                    {subject === "CAR" &&   <ChartToggle 
                                    graphName = "U-t graph:"
                                    toggleChart = {chartCtx.chartToggle.u_t}
                                    toggleChartSettings = {toggleChartSettings.bind(this, 'u-t')}
                                    />}

                                    {subject === "CAR" &&   <ChartToggle 
                                    graphName = "I-t graph:"
                                    toggleChart = {chartCtx.chartToggle.i_t}
                                    toggleChartSettings = {toggleChartSettings.bind(this, 'i-t')}
                                    />}


                                    {subject === "MOTOR" && <ChartToggle 
                                    graphName = "show legend:"
                                    toggleChart = {chartOptionsCtx.showLegend}
                                    toggleChartSettings = {() => chartOptionsCtx.showLegendHandler()}
                                    notShowBorder
                                    />
                                    }

                                </View>

                        
                    </LinearGradient>
                </View>
                {assignmentNumber === 2 && subject === 'MOTOR' &&
                <View style = {[styles.shadow, {height: 300, marginTop: 15 }]}>
                    <LinearGradient 
                        style = {styles.textContainer}
                        colors={[ColorsBlue.blue1200, ColorsBlue.blue1100]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                            >
                            <View style = {styles.header}>
                                <Text style = {[styles.title, {marginBottom: 0}]}>Soorten Grafieken</Text>
                            </View>
                            <Text style = {[styles.title, {fontSize: 18, color: ColorsBlue.blue50, paddingHorizontal: 35, paddingVertical: 15}]}>Hier kan je de grafieken kiezen die je live wilt zien.{'\n\n'}- (s,t) geeft informatie over afstand, tijd en snelheid. {'\n\n'}- (v,t) geeft informatie over snelheid, tijd en versnelling. {'\n\n'}Druk op de aanknop om een meting te starten.</Text>
                    </LinearGradient>
                </View>
                }
            </BlurWrapper>
        </Modal>
    )
}

export default React.memo(ToggleMenu)

const styles = StyleSheet.create({
    textContainer: {
        marginBottom: 0, 
        borderRadius: 5,
        elevation: 3,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
    },
    shadow: {
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 3,
        width: '85%',
        maxHeight: 300,
        borderRadius: 20,
    },
    header: {
        height: 50,
        backgroundColor: ColorsBlue.blue900,
        shadowColor: ColorsBlue.blue1300,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    icon: {
        position: 'absolute',
        right: 10,
        top: 8,
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { height: 2, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
    },  
    modal: {
        borderRadius: 20,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
        maxHeight: 300,
    },
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    title: {
        color: ColorsBlue.blue100,
        fontSize: 26,
        alignSelf: 'center',
        marginTop: 8,
        textShadowColor: ColorsBlue.blue1400,
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 2,
    },
})