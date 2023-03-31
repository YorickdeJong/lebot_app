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
    const [chartData, setChartData] = useState([]);
    let {xData, yData} = data;
    const numberOfTicks = 8;
    const {title, xlabel, ylabel} = getTitleXLabelYLabel(dataType)

    console.log(`CHECK GRAPHDISPLAY`)

    // Update chart data whenever xData or yData change
    useEffect(() => {
        setChartDataHandler();
    }, [data, finalPlot]);

    const setChartDataHandler = useCallback(() => {
        const flattenData = (xData, yData) => {
            let flattened = [];

            yData.forEach((yArr, yArrIndex) => {
                let lineData = [];
                yArr.forEach((y, index) => {
                    lineData.push({
                        x: xData[index],
                        y,
                    });
                });
                flattened.push(lineData);
            });

            return flattened;
        };

        if (chartData.length === 0) {
            setChartData(flattenData(xData, yData));
        }

        setChartData((prevData) => {
            const newData = flattenData(xData, yData);

            // Initialize prevData if it's empty or contains uninitialized elements
            if (prevData[0].length === 0 || prevData.some((prevLineData) => prevLineData === undefined)) {
                return newData;
            }
            // Check if the newData arrays contain any new points
            const hasNewDataPoints = newData.some((newLineData, i) => newLineData.length !== prevData[i].length);

            // If there are no new data points, return the prevState unchanged
            if (!hasNewDataPoints) {
                return prevData;
            }

            // Update each line with new data
            return prevData.map((prevLineData, i) => {
                const latestTimestamp = newData[i].length > 0 ? newData[i][newData[i].length - 1].x : 0;

                const filterOldData = (arr) =>
                    arr.filter((obj) => latestTimestamp - obj.x <= 60);

                return [...filterOldData(prevLineData), ...newData[i].slice(prevLineData.length)];
            });
        });

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
                <Text style={[styles.title, {paddingBottom: trueCount > 1 ? 5 : 0}]}>
                    {title}
                </Text>
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
                        animate={true}
                        animationDuration={100}
                        animationEasing={"ease-in-out"}
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
                    <BlurView intensity={10} style = {styles.legend}>
                        {legend && <Legend items={legendItems} />}
                    </BlurView>

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
        textAlign: 'flex-end',
        marginRight: 10
    },
    YlableContainer: {
        flexDirection: 'row', 
        alignItems: 'center'
    },
    XlableContainer: {
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center', 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: ColorsBlue.blue50
    },
    legend: {
        left: 0,
        position: 'absolute',
        top: 0,
        borderRadius: 6,
        alignItems: 'center', // Add this line
        justifyContent: 'center', // Add this line
    }
})