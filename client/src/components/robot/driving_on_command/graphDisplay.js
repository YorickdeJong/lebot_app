import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
//-----------------------------------------------------------------//
//N.B. DO NOT IMPORT CHARTCONTEXT HERE, IT WILL CAUSE many rerenders!
//-----------------------------------------------------------------//

const ColorPoints = [ColorsRed.red700, ColorsPurple.purple600,  ColorsGreen.green900, ColorsBrownWood.wood500]



function GraphDisplay({
    dataType,
    data,
    chartHeight,
    finalPlot,
    trueCount,
    padding,
    motorNumber,
    legend
}) {
    const [chartData, setChartData] = useState([]); //useState since we want to rerender the chart when new data is added
    const [rerenderKey, setRerenderKey] = useState(0);
    const chartOptionsCtx = useContext(ChartOptionsContext)
    let {xData, yData} = data;
    const numberOfTicks = 8;
    const {title, xlabel, ylabel} = getTitleXLabelYLabel(dataType)
     
    
    // Update chart data whenever xData or yData change
    useEffect(() => {
        setChartDataHandler();
    }, [data, finalPlot]);
    
        
    const setChartDataHandler = useCallback(() => {
        const maxLength = finalPlot ? 1000 : 349; // Adjust this value according to your needs
        const buffers = yData.map(() => new CircularBuffer(maxLength)); // 80 elements for speed
    
        yData.forEach((yArr, yArrIndex) => {
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
        } else {
            setChartData((prevData) => {
                // Update each line with new data
                return prevData.map((prevLineData, i) => {
                    return flattened[i];
                });
            });
        }
    }, [xData, yData, finalPlot]);

    const findBroadestRange = (data2D) => {
        let min = Infinity;
        let max = -Infinity;

        // Flatten the data array
        const flattenedData = data2D.reduce((acc, curr) => acc.concat(curr), []);

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
            const color = ColorPoints[motorNumber[index] - 1];

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
            const maxRadius = 15 / (trueCount ** 0.8);
            const radius = Math.min(maxRadius, maxRadius / Math.sqrt(data.length));
            const color = ColorPoints[motorNumber[index] - 1]

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

    const legendItems = useMemo(() => [
        motorNumber[0] && { label: `Motor ${motorNumber[0]}`, color: ColorPoints[motorNumber[0] - 1] },
        motorNumber[1] && { label: `Motor ${motorNumber[1]}`, color: ColorPoints[motorNumber[1] - 1] },
        motorNumber[2] && { label: `Motor ${motorNumber[2]}`, color: ColorPoints[motorNumber[2] - 1] },
        motorNumber[3] && { label: `Motor ${motorNumber[3]}`, color: ColorPoints[motorNumber[3] - 1] },
    ].filter(Boolean), [motorNumber]);
    
    if (chartData.length === 0){
        return null;
    } 

    return (
        <View style = {styles.graphContainer}>
            <View style = {{marginVertical: trueCount > 1 ? 5 : 10, marginTop: trueCount > 1 ? 5 : 10}}>
                <Text style={[styles.title, ]}>
                    {title}
                </Text>
            </View>
            {/* Legend */}
            {chartOptionsCtx.showLegend && 
                <BlurView intensity={20} tint="dark" style = {styles.legend}>
                        {legend && <Legend items={legendItems} />}
                </BlurView>
            }
            <View style={{ flexDirection: 'row', height: chartHeight }}>
                <View style={styles.YlableContainer}>
                    <Text style = {[styles.Ylabel, trueCount === 1 && {marginRight: 5, fontSize: 14}]}>{ylabel}</Text>
                    <YAxis
                    data={yData[0]} // Pass the first array just for axis range calculations
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
                        data={chartData[0]} // Pass the first array just for axis range calculations
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
        case "force":
            return { title: "f-s graph", xlabel: " s", ylabel: " N" };
        case "energy":
            return { title: "E-t graph", xlabel: " t", ylabel: " J" };
        default:
            return { title: "", xlabel: "", ylabel: "" };
    }
}


const styles = StyleSheet.create({
    graphContainer: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        padding: 5,
        paddingTop: 20,
        paddingRight: 10,
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
    title: {
        textAlign: 'center', 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: ColorsBlue.blue50
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