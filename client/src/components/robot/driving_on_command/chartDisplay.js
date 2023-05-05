import React, { useCallback, useContext, useEffect, useState, useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { ChartContext } from "../../../store/chart-context"
import GraphDisplay from "./graphDisplay"

function ChartDisplay({chartData, chartToggle, trueCount, finalPlot, displayChart, subject, isConstant}) {

    let toggleOptionsCount;
    let chartHeight;

    if (subject === "MOTOR"){
        toggleOptionsCount = 1
    }

    if (subject === "CAR"){
        toggleOptionsCount = 4
    }

    if (displayChart){
      //adjust ratios to fit graphs
        if (trueCount === 1){
            chartHeight = displayChart - 5 
        }
        if (trueCount === 2){
            chartHeight = displayChart - 50
        }
        if (trueCount === 3){
            chartHeight = displayChart - 70
        }
    }
    

    let doubleChartHeight;
    let firstDataType, secondDataType, thirdDataType, fourthDataType
    let firstYData, secondYData, thirdYData, fourthYData;
    let firstXData, secondXData, thirdXData, fourthXData;
    let motorNumber, filteredChartData; 
               

    const filteredData = useCallback(() => {
        return Object.entries(chartToggle)
            .reduce((acc, [key, value], index) => {
                if (index > toggleOptionsCount) { //Change this need to change starting position 
                    return acc;
                }
                if (value === true) {
                    const chartDataKey = Object.keys(chartData)[index];
                    if (chartDataKey in chartData) { // Check if the key exists in the chartData
                        acc[chartDataKey] = chartData[chartDataKey]; //returns array with 1, 2
                    }
                }
                return acc;
            }, {});
    }, [chartToggle, chartData]);


    const selectXdata = useCallback((dataType, chartData) => {
        switch(dataType){
            case 'distance':
                return chartData.time; 
            case 'speed':
                return chartData.time.slice(1);
            case 'power':
                return chartData.time;
            case 'current':
                return chartData.time;
            case 'voltage':
                return chartData.time;
        }
    }, [chartData])

    if (subject === "MOTOR"){
        if (chartData.distance.length === 0) {
            console.log('distance data is empty');
            return;
        }
    }

    switch(trueCount){
        case 1:
            filteredChartData = filteredData();
            motorNumber  = chartData.motorNumber;
            try {
                [firstDataType, firstYData] = Object.entries(filteredChartData)[0];
                firstXData = selectXdata(firstDataType, chartData);
            }
            catch(error){
                console.log(error)
                return;
            }

            const padding = displayChart? 0 : 20; 
            return (
                <View style = {{height: displayChart }}>
                    {!(firstYData[0] === undefined) && <GraphDisplay 
                    dataType={firstDataType}
                    data={{ xData: firstXData, yData: firstYData }}
                    chartHeight = {chartHeight}
                    finalPlot = {finalPlot}
                    trueCount = {trueCount}
                    padding = {padding}
                    motorNumber = {subject === "MOTOR" ? motorNumber : false}
                    legend
                    isConstant = {isConstant}
                    />}
                </View>
            )

        case 2:
            console.log('check 2')
            filteredChartData = filteredData();
            motorNumber = chartData.motorNumber;
            
            const entriesTwo = Object.entries(filteredChartData);
            [firstDataType, firstYData] = entriesTwo[0];
            [secondDataType, secondYData] = entriesTwo.length > 1 ? entriesTwo[1] : [null, []];
        
            firstXData = selectXdata(firstDataType, chartData);
            secondXData = secondDataType
              ? selectXdata(secondDataType, chartData)
              : [];
        
            doubleChartHeight = chartHeight / 2

            return (
                <View style = {{height: displayChart}}>
                    <View>
                            {!(firstYData[0] === undefined) && <GraphDisplay 
                            dataType={firstDataType}
                            data={{ xData: firstXData, yData: firstYData }}
                            chartHeight = {doubleChartHeight}
                            finalPlot = {finalPlot}
                            trueCount = {trueCount}
                            motorNumber = {subject === "MOTOR" ? motorNumber : false}
                            legend
                            isConstant = {isConstant}
                            />}
                    </View>
                    <View style = {{marginTop: displayChart / 1.65}}>
                        {!(secondYData[0] === undefined) && <GraphDisplay 
                        dataType={secondDataType}
                        data={{ xData:secondXData, yData: secondYData }}
                        chartHeight = {doubleChartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {subject === "MOTOR" ? motorNumber : false}
                        />}
                    </View>
                </View>
            )

        case 3:
            console.log('check 3')
            filteredChartData = filteredData();
            motorNumber  = chartData.motorNumber;

            const entriesThree = Object.entries(filteredChartData);
            [firstDataType, firstYData] = entriesThree[0];
            [secondDataType, secondYData] = entriesThree[1];
            [thirdDataType, thirdYData] = entriesThree.length > 1 ? entriesThree[1] : [null, []];

            
            firstXData = selectXdata(firstDataType, chartData);
            secondXData = selectXdata(secondDataType, chartData)
            thirdXData = thirdDataType
              ? selectXdata(thirdDataType, chartData)
              : [];
        

            doubleChartHeight = chartHeight / 2;

            return (
                <View style = {{height: displayChart}}>
                    <View style = {{flex: 1}}>
                        {!(firstYData[0] === undefined) && <GraphDisplay 
                        dataType={firstDataType}
                        data={{ xData: firstXData, yData: firstYData }}
                        chartHeight = {doubleChartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {subject === "MOTOR" ? motorNumber : false}
                        legend
                        isConstant = {isConstant}
                        />}
                    </View>
                    <View style = {[styles.twoCharts, {marginTop: displayChart / 1.6}]}>
                        {!(secondYData[0] === undefined) && <GraphDisplay 
                        dataType={secondDataType}
                        data={{ xData:secondXData, yData: secondYData }}
                        chartHeight = {doubleChartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {subject === "MOTOR" ? motorNumber : false}
                        />}
                        {!(thirdYData[0] === undefined) && <GraphDisplay 
                        dataType={thirdDataType}
                        data={{ xData:thirdXData, yData: thirdYData }}
                        chartHeight = {doubleChartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {subject === "MOTOR" ? motorNumber : false}
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
                        motorNumber = {subject === "MOTOR" ? motorNumber : false}
                        legend
                        />}
                        {!(secondYData[0] === undefined) && <GraphDisplay 
                        dataType={secondDataType}
                        data={{ xData:secondXData, yData: secondYData }}
                        chartHeight = {chartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {subject === "MOTOR" ? motorNumber : false}
                        />}
                    </View>
                    <View style = {styles.twoCharts}>
                        {!(thirdYData[0] === undefined) && <GraphDisplay 
                        dataType={thirdDataType}
                        data={{ xData:thirdXData, yData: thirdYData }}
                        chartHeight = {chartHeight}
                        finalPlot = {finalPlot}
                        trueCount = {trueCount}
                        motorNumber = {subject === "MOTOR" ? motorNumber : false}
                        />}
                        {!(fourthYData[0]=== undefined) && <GraphDisplay 
                        dataType={fourthDataType}
                        data={{ xData:fourthXData, yData: fourthYData }}
                        chartHeight = {chartHeight}
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



const styles = StyleSheet.create({
    twoCharts: {
        flexDirection: "row",
    },
})