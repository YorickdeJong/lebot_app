import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { LineChart, YAxis, XAxis, Grid, ChartContext } from 'react-native-svg-charts';
import { ColorsBlue, ColorsBrownWood, ColorsGreen, ColorsLighterGold, ColorsPurple, ColorsRed } from "../../../constants/palet";
import { Circle } from 'react-native-svg';
import { Path } from "react-native-svg";
import * as shape from 'd3-shape';
import * as d3 from 'd3';
import { Legend } from "./ChartAccesories/Legend";
import { BlurView } from "expo-blur";
import { ChartOptionsContext } from "../../../store/chartOptions-context";
import CircularBuffer from "../../../algorithms/CircularBuffer";
import Icon from "../../Icon";
//-----------------------------------------------------------------//
//N.B. DO NOT IMPORT CHARTCONTEXT HERE, IT WILL CAUSE many rerenders!
//-----------------------------------------------------------------//

const ColorPoints = [ColorsRed.red700, ColorsBrownWood.wood500, ColorsGreen.green900,  ColorsPurple.purple600, ]



function GraphDisplay({
    dataType,
    data,
    chartHeight,
    finalPlot,
    trueCount,
    motorNumber,
    legend,
    isConstant,
}) {
    const [chartData, setChartData] = useState([]); //useState since we want to rerender the chart when new data is added
    const [rerenderKey, setRerenderKey] = useState(0);
    const chartOptionsCtx = useContext(ChartOptionsContext)
    const {title, xlabel, ylabel} = getTitleXLabelYLabel(dataType)
    
    let {xData, yData} = data;
    let legendItems;
    const numberOfTicks = trueCount <= 2 ? 8 : 5; //adjust accordingly to amount of plots displayed
     
    // Update chart data whenever xData or yData change
    useEffect(() => {
        setChartDataHandler();
    }, [data, finalPlot]);

        
    const setChartDataHandler = useCallback(() => {
        const wrappedYData = Array.isArray(yData[0]) ? yData : [yData];

        const maxLength = finalPlot ? 1000 : 349; // Adjust this value according to your needs
        const buffers = wrappedYData.map(() => new CircularBuffer(maxLength)); // 80 elements for speed

        wrappedYData.forEach((yArr, yArrIndex) => {
            yArr.forEach((y, index) => {
                buffers[yArrIndex].push({
                    x: xData[index], //takes care of length such that x is also max 80 in length
                    y,
                });
            });
        });
    
        const flattened = buffers.map((buffer) => buffer.toArray());
        if (chartData.length === 0) {
            setChartData(flattened);
        } 
        else {
            setChartData((prevData) => {
                // Update each line with new data
                return prevData.map((prevLineData, i) => {
                    return flattened[i];
                });
            });
        }
    }, [xData, yData, finalPlot]);

    const findBroadestRange = (data) => {
        let min = Infinity;
        let max = -Infinity;
    
        // Check if input data is 1D or 2D
        const is2DArray = Array.isArray(data[0]);
    
        // Flatten the data array if it's 2D
        const flattenedData = is2DArray
            ? data.reduce((acc, curr) => acc.concat(curr), [])
            : data;
    
        // Find min and max
        min = Math.min(...flattenedData);
        max = Math.max(...flattenedData);
    
        return { min, max };
    };

    const { min: yMin, max: yMax } = findBroadestRange(yData);
    const { min: xMin, max: xMax } = findBroadestRange(xData);

    // Calculate lines for plot
    const Lines = ({x, y}) => {
        const line = shape
        .line()
        .x((d) => x(d.x))
        .y((d) => y(d.y))

          
        return chartData.map((data, index) => {
            const color = ColorPoints[motorNumber.length > 0? motorNumber[index] - 1: index + 1];
            return (
                <Path
                    key={`extra-${index}`}
                    d={line(data)}
                    stroke={color}
                    strokeWidth={2}
                    fill="none"
                />
            );
        });
    };

    const Decorator = ({ x, y,}) => {
        // Scales data point radius to the amount of datapoints

        return chartData.map((data, index) => {
            const maxRadius = 20 / (Math.pow(trueCount, 0.01));
            const radius = Math.min(maxRadius, maxRadius / Math.sqrt(data.length));
            const color = ColorPoints[motorNumber.length > 0 ? motorNumber[index] - 1: index + 1]
            return data.map((value, pointIndex) => (
                <Circle
                key={`${index}-${pointIndex}`}
                cx={x(value.x)}
                cy={y(value.y)}
                r={radius}
                stroke={color}
                fill={'white'}
                />
            ));
        })
    };

    if (motorNumber) {
        legendItems = useMemo(() => [
            motorNumber[0] && { label: `Motor ${motorNumber[0]}`, color: ColorPoints[motorNumber[0] - 1] },
            motorNumber[1] && { label: `Motor ${motorNumber[1]}`, color: ColorPoints[motorNumber[1] - 1] },
            motorNumber[2] && { label: `Motor ${motorNumber[2]}`, color: ColorPoints[motorNumber[2] - 1] },
            motorNumber[3] && { label: `Motor ${motorNumber[3]}`, color: ColorPoints[motorNumber[3] - 1] },
        ].filter(Boolean), [motorNumber]);
    }
    
    if (chartData.length === 0){
        return null;
    } 

    return (
        <View style = {styles.graphContainer}>
            <View style = {[styles.titleContainer]}>
                <Text style={[styles.title, ]}>
                    {title}
                </Text>
                {isConstant != 2 && 
                <View style = {{position: 'absolute', top: 8, left: 19}}>
                    <Icon 
                        size = {30}
                        icon = {isConstant ? "check-circle-outline" : "error-outline"}
                        onPress = {() => {
                            isConstant ? Alert.alert("Correcte Meeting! Je hebt de juiste informatie om het probleem op te lossen.") : Alert.alert("Incorrecte Meeting! Start een nieuwe meeting om de juiste informatie te krijgen.")
                        }}
                        differentDir = {isConstant ? true : false}
                        MaterialIconsDir={isConstant ? false : true}
                        color = {isConstant ? ColorsGreen.green700 : ColorsRed.red700}
                    />
                </View>
                }
            </View>
            {/* Legend */}
            {chartOptionsCtx.showLegend && 
                <BlurView intensity={20} tint="dark" style = {styles.legend}>
                        {legend && motorNumber && <Legend items={legendItems} />}
                </BlurView>
            }
            <View style={{ flexDirection: 'row', height: chartHeight, paddingHorizontal: 10 }}>
                <View style={styles.YlableContainer}>
                    <Text style = {[styles.Ylabel, trueCount === 1 && {marginRight: 5, fontSize: 14}]}>{ylabel}</Text>
                    <YAxis
                    data={Array.isArray(yData[0]) ? yData[0] : yData} // Pass the first array just for axis range calculations
                    contentInset={{top: 0, bottom: trueCount === 1 ? 40 : 30, top: 10 }}
                    svg={{ fontSize: 10, fill: ColorsBlue.blue50 }}
                    numberOfTicks={numberOfTicks}
                    formatLabel={(value) => `${value}`}
                    yMin={yMin}
                    yMax={yMax}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 10,  }}>
                    <LineChart
                        key={rerenderKey}
                        data={Array.isArray(chartData[0]) ? chartData[0] : chartData } // Pass the first array just for axis range calculations
                        contentInset={{ top: 0, left: 5, right: 8, bottom: 10, top: 5 }}
                        style={{ flex: 1 }}
                        yMin={yMin}
                        yMax={yMax}
                        xMin={xMin}
                        xMax={xMax}
                        numberOfTicks = {numberOfTicks}
                        gridMinInterval={1}
                        gridMaxInterval={1}
                        showGrid={true}
                        xAccessor={({ item }) => item.x}
                        yAccessor={({ item }) => item.y}
                    >
                        <Grid
                        svg={{
                            strokeOpacity: 0.5,
                            strokeDasharray: "0",
                            strokeWidth: 1,
                            stroke: ColorsBlue.blue200,
                        }}
                        belowChart={true}
                        />
                            <Lines />   
                            <Decorator />
                    </LineChart>
                    <View style={styles.XlableContainer}>
                        <XAxis
                            data={dataType === "force" ? xData[0] : xData}
                            contentInset={{ left: 5, right: 8 }}
                            svg={{ fontSize: 10, fill: ColorsBlue.blue50 }}
                            numberOfTicks = {numberOfTicks}
                            formatLabel={(value, index) => value ? `${value}` : ''}
                            xMin={xMin}
                            xMax={xMax}
                            xAccessor={({ item }) => item}
                        />
                        <Text style = {[styles.Xlabel, trueCount === 1 && {fontSize: 16}]}>{xlabel}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default React.memo(GraphDisplay)


function getTitleXLabelYLabel(dataType) {
    switch (dataType) {
        case "distance":
            return { title: "s-t graph", xlabel: " t", ylabel: " s" };
        case "speed":
            return { title: "v-t graph", xlabel: " t", ylabel: " v" };
        case "power":
            return { title: "P-t graph", xlabel: " t", ylabel: " P" };
        case "voltage":
            return { title: "U-t graph", xlabel: " t", ylabel: " U" };
        case "current":
            return { title: "I-t graph", xlabel: " t", ylabel: " I" };
        default:
            return { title: "", xlabel: "", ylabel: "" };
    }
}


const styles = StyleSheet.create({
    graphContainer: {
        borderRadius: 10,
        flex: 1,
        // marginBottom: 1,
    },
    Ylabel: {
        fontSize: 8,
        color: ColorsBlue.blue50,
        textAlign: 'center',
        marginRight: 4,
        marginBottom: 20,
        transform: [{rotate: '-90deg'}]
    },
    Xlabel:{
        fontSize: 10,
        color: ColorsBlue.blue50,
        textAlign: 'center',
        marginRight: 10
    },
    YlableContainer: {
        flexDirection: 'row', 
        alignItems: 'center'
    },
    XlableContainer: {
        justifyContent: 'center',
        
    },
    titleContainer: {
        height: 45,
        marginBottom: 20,
        // backgroundColor: `rgba(25, 25, 60, 0.6)`, //`rgba(45, 45, 85, 0.6)`, //`rgba(25, 25, 60, 0.6)`
        shadowColor: `rgba(11, 11, 11)`,
        shadowOffset: {height: 2, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 2,
    },
    title: {
        paddingTop: 7,
        paddingLeft: 10,
        textAlign: 'center', 
        fontSize: 23, 
        fontWeight: '300', 
        color: ColorsBlue.blue50,
    },
    legend: {
        zIndex: 20,
        right: 2,
        position: 'absolute',
        top: 10,
        borderRadius: 6,
        alignItems: 'center', // Add this line
        justifyContent: 'center', // Add this line
    }
})