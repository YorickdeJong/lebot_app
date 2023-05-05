import { StyleSheet, View,  Modal, Text, } from "react-native"
import Icon from "../../Icon"
import { ColorsBlue } from "../../../constants/palet"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from 'expo-blur';
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import ChartToggle from "./chartToggle";
import { ChartContext } from "../../../store/chart-context";
import { ChartOptionsContext } from "../../../store/chartOptions-context";



function ToggleMenu({toggleModal, isStopActive, headerHeight, displayNumber, subject}) {
    const chartCtx = useContext(ChartContext)
    const chartOptionsCtx = useContext(ChartOptionsContext)

    useEffect(() => {
        chartCtx.setTrueCount(Object.values(chartCtx.chartToggle).filter(value => value === true).length - 1); //minus 1 here since time is always true
        
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
            <BlurView style={styles.modalContainer} intensity={20}>
                <View style = {styles.shadow}>
                    <LinearGradient 
                    style = {[styles.modal, { marginTop: headerHeight }]}
                    colors={[ColorsBlue.blue1200, ColorsBlue.blue1100]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                        >
                            <View style = {styles.chartToggleContainer}>
                                <View style = {styles.header}>
                                    <View style = {styles.icon}>
                                        <Icon 
                                        icon="close" 
                                        size={30} 
                                        color={ColorsBlue.blue200} 
                                        onPress={toggleModal}
                                        />
                                    </View>
                                    <Text style = {styles.title}>Display Charts</Text>
                                    <Text />
                                </View>
                                <View style = {{justifyContent: 'center', alignItems: 'center'}}>
                                <View style = {{alignItems: 'flex-start'}}>
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
                                    />
                                    }
                                </View>

                                </View>
                            </View>

                        
                    </LinearGradient>
                </View>
            </BlurView>
        </Modal>
    )
}

export default React.memo(ToggleMenu)

const styles = StyleSheet.create({
    shadow: {
        shadowColor: ColorsBlue.blue1400,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 3,
        width: '85%',
        height: 300,
        marginBottom: 100
    },
    header: {
        height: 50,
        backgroundColor: ColorsBlue.blue900,
        shadowColor: ColorsBlue.blue1300,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3,
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
        borderRadius: 5,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
        flex: 1,

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
    },
    chartToggleContainer: {
        marginLeft: 0,
    },
})