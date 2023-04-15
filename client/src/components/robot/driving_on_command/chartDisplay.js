import React, { useCallback, useContext, useEffect, useState, useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { ChartContext } from "../../../store/chart-context"
import GraphDisplay from "./graphDisplay"

function ChartDisplay({chartData, chartToggle, trueCount, finalPlot, displayChart}) {
    console.log(`chartdisaply CHECK`)

    if (displayChart){
        chartHeight = trueCount == 1 ? displayChart - 15: displayChart - 48 //adjust ratios to fit graphs
    }
    
    let doubleChartHeight;
    let firstDataType, secondDataType, thirdDataType, fourthDataType
    let firstYData, secondYData, thirdYData, fourthYData;
    let firstXData, secondXData, thirdXData, fourthXData;
    let motorNumber, filteredChartData; 
               

    const filteredData = useCallback(() => {
        return Object.entries(chartToggle)
                .reduce((acc, [key, value], index) => {
                    if (index > 1){
                        return acc; 
                    }
                    if (value === true) {
                        const chartDataKey = Object.keys(chartData)[index];
                        acc[chartDataKey] = chartData[chartDataKey]; //returns array with 1, 2, 3, 4 arrays
                    }
                    return acc;
                }, {});

    }, [chartToggle, chartData]) 


    const selectXdata = useCallback((dataType, chartData) => {
        switch(dataType){
            case 'distance':
                return chartData.time; 
            case 'speed':
                    return chartData.time.slice(1);
        }
    }, [chartData])

    if (chartData.distance.length === 0) {
        console.log('data is empty');
        return;
    }

    
    
    switch(trueCount){
        case 1:
            filteredChartData = filteredData();
            motorNumber  = chartData.motorNumber;
            //TODO handle 2D arrays + handle distance array
            [firstDataType, firstYData] = Object.entries(filteredChartData)[0];
            firstXData = selectXdata(firstDataType, chartData);

            const padding = displayChart? 0 : 20; 

            return (
                <View style = {{height: displayChart ? displayChart : chartHeight}}>
                    {!(firstYData[0] === undefined) && <GraphDisplay 
                    dataType={firstDataType}
                    data={{ xData: firstXData, yData: firstYData }}
                    chartHeight = {chartHeight}
                    finalPlot = {finalPlot}
                    trueCount = {trueCount}
                    padding = {padding}
                    motorNumber = {motorNumber}
                    legend
                    />}
                </View>
            )

        case 2:
            filteredChartData = filteredData();
            motorNumber = chartData.motorNumber;
            const entries = Object.entries(filteredChartData);
            [firstDataType, firstYData] = entries[0];
            [secondDataType, secondYData] = entries.length > 1 ? entries[1] : [null, []];
        
            firstXData = selectXdata(firstDataType, chartData);
            secondXData = secondDataType
              ? selectXdata(secondDataType, chartData)
              : [];
        
            
            doubleChartHeight = chartHeight / 2

            return (
                <View style = {{height: displayChart ? displayChart : chartHeight * 2}}>
                    {!(firstYData[0] === undefined) && <GraphDisplay 
                    dataType={firstDataType}
                    data={{ xData: firstXData, yData: firstYData }}
                    chartHeight = {doubleChartHeight}
                    finalPlot = {finalPlot}
                    trueCount = {trueCount}
                    motorNumber = {motorNumber}
                    legend
                    />}
                    {!(secondYData[0] === undefined) && <GraphDisplay 
                    dataType={secondDataType}
                    data={{ xData:secondXData, yData: secondYData }}
                    chartHeight = {doubleChartHeight}
                    finalPlot = {finalPlot}
                    trueCount = {trueCount}
                    motorNumber = {motorNumber}
                    />}
                </View>
            )

        case 3:
            filteredChartData = filteredData();
            motorNumber  = chartData.motorNumber;
            [firstDataType, firstYData] = Object.entries(filteredChartData)[0];
            [secondDataType, secondYData] = Object.entries(filteredChartData)[1];
            [thirdDataType, thirdYData] = Object.entries(filteredChartData)[2];
            
            firstXData = selectXdata(firstDataType, chartData);
            secondXData = selectXdata(secondDataType, chartData);
            thirdXData = selectXdata(thirdDataType, chartData);
            
            doubleChartHeight = displayChart ? chartHeight / 2 : chartHeight / 2.3;
            return (
                <View style = {{height: displayChart ? displayChart : chartHeight * 2}}>
                    <View style = {{flex: 1}}>
                        {!(firstYData[0] === undefined) && <GraphDisplay 
                        dataType={firstDataType}
                        data={{ xData: firstXData, yData: firstYData }}
                        chartHeight = {chartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {motorNumber}
                        legend
                        />}
                    </View>
                    <View style = {styles.twoCharts}>
                        {!(secondYData[0] === undefined) && <GraphDisplay 
                        dataType={secondDataType}
                        data={{ xData:secondXData, yData: secondYData }}
                        chartHeight = {chartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {motorNumber}
                        />}
                        {!(thirdYData[0] === undefined) && <GraphDisplay 
                        dataType={thirdDataType}
                        data={{ xData:thirdXData, yData: thirdYData }}
                        chartHeight = {chartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {motorNumber}
                        />}
                    </View>
                </View>
            )

        case 4:
            filteredChartData = filteredData();
            motorNumber  = chartData.motorNumber;
            [firstDataType, firstYData] = Object.entries(filteredChartData)[0];
            [secondDataType, secondYData] = Object.entries(filteredChartData)[1];
            [thirdDataType, thirdYData] = Object.entries(filteredChartData)[2];
            [fourthDataType, fourthYData] = Object.entries(filteredChartData)[3];
            
            firstXData = selectXdata(firstDataType, chartData);
            secondXData = selectXdata(secondDataType, chartData);
            thirdXData = selectXdata(thirdDataType, chartData);
            fourthXData = selectXdata(fourthDataType, chartData);

            doubleChartHeight = displayChart ? chartHeight / 2 : chartHeight / 2.3;

            return (
                <View style = {{height: displayChart ? displayChart : chartHeight * 2}}>
                    <View style = {styles.twoCharts}>
                        {!(firstYData[0] === undefined) && <GraphDisplay 
                        dataType={firstDataType}
                        data={{ xData: firstXData, yData: firstYData }}
                        chartHeight = {chartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {motorNumber}
                        legend
                        />}
                        {!(secondYData[0] === undefined) && <GraphDisplay 
                        dataType={secondDataType}
                        data={{ xData:secondXData, yData: secondYData }}
                        chartHeight = {chartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {motorNumber}
                        />}
                    </View>
                    <View style = {styles.twoCharts}>
                        {!(thirdYData[0] === undefined) && <GraphDisplay 
                        dataType={thirdDataType}
                        data={{ xData:thirdXData, yData: thirdYData }}
                        chartHeight = {chartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {motorNumber}
                        />}
                        {!(fourthYData[0]=== undefined) && <GraphDisplay 
                        dataType={fourthDataType}
                        data={{ xData:fourthXData, yData: fourthYData }}
                        chartHeight = {chartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {motorNumber}
                        />}
                    </View>
                </View>
            )
    }
}


export default React.memo(ChartDisplay)



const styles = StyleSheet.create({
    twoCharts: {
        flexDirection: "row",
    },
})