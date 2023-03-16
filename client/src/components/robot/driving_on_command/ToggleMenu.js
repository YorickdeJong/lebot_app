import { StyleSheet, View,  Modal, Text, } from "react-native"
import Icon from "../../Icon"
import { ColorsBlue } from "../../../constants/palet"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from 'expo-blur';
import { useContext, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import ChartToggle from "./chartToggle";
import { ChartContext } from "../../../store/chart-context";



function ToggleMenu({toggleModal, isStopActive, headerHeight}) {
    const chartCtx = useContext(ChartContext)

    const toggleChartSettings = (input) => {
        switch(input){
            case 's-t':
                chartCtx.setChartToggleHandler("s_t")
                break;
            case 'v-t':
                chartCtx.setChartToggleHandler("v_t")
                break;
            case 'F-s':
                chartCtx.setChartToggleHandler("F_s")
                break;
            case 'E-t':
                chartCtx.setChartToggleHandler("E_t")
                break;
        }
    };

    return (
        <Modal 
        visible={isStopActive} 
        animationType="slide"
        transparent>
            <BlurView style={styles.modalContainer} intensity={20}>
                <LinearGradient 
                style = {[styles.modal, { marginTop: headerHeight }]}
                colors={[ColorsBlue.blue1200, ColorsBlue.blue1100]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                    >
                        <View style = {styles.chartToggleContainer}>
                            <View style = {{ flexDirection: 'row', justifyContent: 'space-between'}}>
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
                            <ChartToggle 
                            graphName = "s-t graph:"
                            toggleChart = {chartCtx.chartToggle.s_t}
                            toggleChartSettings = {toggleChartSettings.bind(this, 's-t')}
                            />

                            <ChartToggle 
                            graphName = "v-t graph:"
                            toggleChart = {chartCtx.chartToggle.v_t}
                            toggleChartSettings = {toggleChartSettings.bind(this, 'v-t')}
                            />

                            <ChartToggle 
                            graphName = "F-s graph:"
                            toggleChart = {chartCtx.chartToggle.F_s}
                            toggleChartSettings = {toggleChartSettings.bind(this, 'F-s')}
                            />
                            
                            <ChartToggle 
                            graphName = "E-t graph:"
                            toggleChart = {chartCtx.chartToggle.E_t}
                            toggleChartSettings = {toggleChartSettings.bind(this, 'E-t')}
                            />
                            </View>
                        </View>

                    
                </LinearGradient>
            </BlurView>
        </Modal>
    )
}

export default ToggleMenu

const styles = StyleSheet.create({
    icon: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 5
    },  
    modal: {
        width: '90%',
        height: 300,
        borderRadius: 5,
        borderWidth: 0.7,
        borderColor: ColorsBlue.blue700,
    },
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    title: {
        color: ColorsBlue.blue200,
        fontSize: 26,
        alignSelf: 'center',
        marginRight: 40,
        marginTop: 35
    },
    chartToggleContainer: {
        marginLeft: 0,
    },
})