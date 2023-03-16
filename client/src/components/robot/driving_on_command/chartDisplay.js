import { useContext, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ChartContext } from "../../../store/chart-context"
import GraphDisplay from "./graphDisplay"




function ChartDisplay(){
    const chartCtx = useContext(ChartContext)
    const [filteredChartData, setFilteredChartData] = useState(chartCtx.chartData)

    let chartHeight = chartCtx.trueCount === 1 ? 400 : 350;
    let dataType1, dataType2, dataType3, dataType4
    let yData1, yData2, yData3, yData4

    useEffect(() => {
    if (chartCtx.chartData.distance.length === 0) {
        console.log('data is empty');
        return;
    }

    console.log(`CHART DATA CHECK ${chartCtx.chartData}`)
    const indexData = Object.entries(chartCtx.chartToggle)
        .reduce((acc, [key, value], index) => {
        if (value === true) {
            acc.push(index);
        }
        return acc;
        }, []);

    const filteredData = indexData.reduce((acc, index) => {
        const key = Object.keys(chartCtx.chartData)[index];
        const value = Object.values(chartCtx.chartData)[index];
        acc[key] = value;
        return acc;
    }, {});

    console.log(`filtered data: ${JSON.stringify(filteredData)}`)
    setFilteredChartData(filteredData);
    }, [chartCtx.chartData, chartCtx.chartToggle]);


    switch(chartCtx.trueCount){
        case 1:
            [dataType1, yData1] = Object.entries(filteredChartData)[0];
            console.log(dataType1 + " " + yData1)
            return (
                <View style = {styles.chartContainer}>
                    <GraphDisplay 
                    dataType={dataType1}
                    yData={yData1}
                    xData={selectXdata(dataType1, chartCtx)}
                    chartHeight = {chartHeight}
                    />
                </View>
            )

        case 2:
            [dataType1, yData1] = Object.entries(filteredChartData)[0];
            [dataType2, yData2] = Object.entries(filteredChartData)[1];
            chartHeight = chartHeight / 2;
            
            return (
                <View style = {styles.chartContainer}>
                    <GraphDisplay 
                    dataType={dataType1}
                    yData={yData1}
                    xData={selectXdata(dataType1, chartCtx)}
                    chartHeight = {chartHeight}
                    />
                    <GraphDisplay 
                    dataType={dataType2}
                    yData={yData2}
                    xData={selectXdata(dataType2, chartCtx)}
                    chartHeight = {chartHeight}
                    />
                </View>
            )

        case 3:
            [dataType1, yData1] = Object.entries(filteredChartData)[0];
            [dataType2, yData2] = Object.entries(filteredChartData)[1];
            [dataType3, yData3] = Object.entries(filteredChartData)[2];
            chartHeight = chartHeight / 2;
            return (
                <View style = {styles.chartContainer}>
                    <View style = {{flex: 1}}>
                        <GraphDisplay 
                        dataType={dataType1}
                        yData={yData1}
                        xData={selectXdata(dataType1, chartCtx)}
                        chartHeight = {chartHeight}
                        />
                    </View>
                    <View style = {styles.twoCharts}>
                        <GraphDisplay 
                        dataType={dataType2}
                        yData={yData2}
                        xData={selectXdata(dataType2, chartCtx)}
                        chartHeight = {chartHeight}
                        />
                        <GraphDisplay 
                        dataType={dataType3}
                        yData={yData3}
                        xData={selectXdata(dataType3, chartCtx)}
                        chartHeight = {chartHeight}
                        />
                    </View>
                </View>
            )

        case 4:
            [dataType1, yData1] = Object.entries(filteredChartData)[0];
            [dataType2, yData2] = Object.entries(filteredChartData)[1];
            [dataType3, yData3] = Object.entries(filteredChartData)[2];
            [dataType4, yData4] = Object.entries(filteredChartData)[3];
            chartHeight = chartHeight / 2;

            return (
                <View style = {styles.chartContainer}>
                    <View style = {styles.twoCharts}>
                        <GraphDisplay 
                        dataType={dataType1}
                        yData={yData1}
                        xData={selectXdata(dataType1, chartCtx)}
                        chartHeight = {chartHeight}
                        />
                        <GraphDisplay 
                        dataType={dataType2}
                        yData={yData2}
                        xData={selectXdata(dataType2, chartCtx)}
                        chartHeight = {chartHeight}
                        />
                    </View>
                    <View style = {styles.twoCharts}>
                        <GraphDisplay 
                        dataType={dataType3}
                        yData={yData3}
                        xData={selectXdata(dataType3, chartCtx)}
                        chartHeight = {chartHeight}
                        />
                        <GraphDisplay 
                        dataType={dataType4}
                        yData={yData4}
                        xData={selectXdata(dataType4, chartCtx)}
                        chartHeight = {chartHeight}
                        />
                    </View>
                </View>
            )
    }
}


export default ChartDisplay

function selectXdata(dataType, chartCtx) {
    switch(dataType){
        case 'distance':
            return chartCtx.chartData.time;
        case 'speed':
            return chartCtx.chartData.timeVelocity;
        case 'force':
            return chartCtx.chartData.distanceForce;
        case 'energy':
            return chartCtx.chartData.timeEnergy;
    }
}

const styles = StyleSheet.create({
    twoCharts: {
        flexDirection: "row",
        flex: 1
    },
    chartContainer: {
        height: 450,
        
    }
})