import React, { useCallback, useContext, useEffect, useState, useMemo } from "react"
import { StyleSheet, View } from "react-native"
import GraphDisplay from "./graphDisplay"


let count = 0;
function ChartDisplay({chartData, chartToggle, trueCount, finalPlot, displayChart, subject, isConstant}) {

    let chartHeight;
    let doubleChartHeight;
    let selectedData, dataType;
    let motorNumber; 

    if (displayChart){
      //adjust ratios to fit graphs
        if (trueCount === 1){
            chartHeight = displayChart - 5 
        }
        if (trueCount === 2){
            chartHeight = displayChart - 50
        }
    }

    switch(trueCount){
        case 1:
            motorNumber  = chartData.motorNumber;
            [selectedData, dataType] = selectPlotData(chartToggle, chartData);

            const padding = displayChart? 0 : 20; 
            return (
                <View style = {{ paddingTop: 10,  borderRadius: 20}}>
                    {!(selectedData[0] === undefined) && 
                        <GraphDisplay 
                        dataType={dataType[0]}
                        data = {selectedData[0]} 
                        chartHeight = {chartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        padding = {padding}
                        motorNumber = {subject === "MOTOR" ? motorNumber : false}
                        legend
                        isConstant = {isConstant}
                        />
                    }
                </View>
            )

        case 2:
            doubleChartHeight = chartHeight / 2
            motorNumber = chartData.motorNumber;
            [selectedData, dataType] = selectPlotData(chartToggle, chartData);

            return (
                <View style = {{height: displayChart, paddingTop: finalPlot ? 10 : 10, width: '100%'}}>
                    <View>
                            {!(selectedData[0] === undefined) && <GraphDisplay 
                            dataType={dataType[0]}
                            data = {selectedData[0]}
                            chartHeight = {doubleChartHeight}
                            finalPlot = {finalPlot}
                            trueCount = {trueCount}
                            motorNumber = {subject === "MOTOR" ? motorNumber : false}
                            legend
                            isConstant = {isConstant}
                            />}
                    </View>
                    <View style = {{marginTop: finalPlot ? displayChart / 1.65 : displayChart / 1.85}}>
                        {!(selectedData[1] === undefined) && <GraphDisplay 
                        dataType={dataType[1]}
                        data = {selectedData[1]}
                        chartHeight = {doubleChartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {subject === "MOTOR" ? motorNumber : false}
                        />}
                    </View>
                </View>
            )
    }
}


export default React.memo(ChartDisplay)


function selectPlotData(chartToggle, chartData){
    let selectedData = [];
    let dataType = [];

    if (chartToggle.s_t) {
        selectedData.push(chartData.distance_time);
        dataType.push('distance_time')
    }
    
    if (chartToggle.v_t) {
        selectedData.push(chartData.velocity_time);
        dataType.push('velocity_time')
    }
    
    if (chartToggle.p_t) {
        selectedData.push(chartData.power_time);
        dataType.push('power_time')
    }
    
    if (chartToggle.u_t) {
        selectedData.push(chartData.voltage_time);
        dataType.push('voltage_time')
    }
    
    if (chartToggle.i_t) {
        selectedData.push(chartData.current_time);
        dataType.push('current_time')
    }

    return [selectedData, dataType]; 
}


const styles = StyleSheet.create({
    twoCharts: {
        flexDirection: "row",
    },
})