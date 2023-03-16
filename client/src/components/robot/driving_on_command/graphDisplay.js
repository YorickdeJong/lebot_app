import { useContext, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LineChart, YAxis, XAxis, Grid } from 'react-native-svg-charts';
import { ColorsBlue, ColorsRed } from "../../../constants/palet";
import { Rect, Circle } from 'react-native-svg';
import { LinearGradient } from "expo-linear-gradient";
import { ChartContext } from "../../../store/chart-context";


function GraphDisplay({dataType, yData, xData, chartHeight}) {
    const chartCtx = useContext(ChartContext);
    const newChartData = useMemo(() => xData.map((x, index) => ({ x, y: yData[index] })), [xData, yData]);
    // const [chartData, setChartData] = useState(newChartData);
    // console.log(`new chart ${newChartData}`)


    // useEffect(() => {
    //     // Add new data points to the chart data
    //     setChartData(prevChartData => ({
    //         ...prevChartData,
    //         [dataType]: [...prevChartData[dataType], ...newChartData],
    //     }));
    // }, [newChartData]);

    
    let title, xlable, ylable;
    switch(dataType){
        case "distance":
            title = "s-t graph";
            xlable = " t";
            ylable = " s";
            break;
        case "speed":
            title = "v-t graph";
            xlable = " t";
            ylable = " v";
            break;
        case "force":
            title = "f-s graph";
            xlable = " s";
            ylable = " N";
            break;
        case "energy":
            title = "E-t graph";
            xlable = " t";
            ylable = " J";
            break;
    }

    const numberOfTicks = 7;
    const xDataordered = xData.sort((a, b) => a - b);

    const Decorator = ({ x, y, data }) => {
        //scales data point radius to amount of datapoints
        const maxRadius = 15/ (chartCtx.trueCount ** 0.8);
        const radius = Math.min(maxRadius, maxRadius / Math.sqrt(data.length));

        return data.map((value, index) => (
            <Circle
                key={index}
                cx={x(value.x)}
                cy={y(value.y)}
                r={radius}
                stroke={ColorsRed.red500}
                fill={'white'}
            />
        ));
    };

    return (
        <LinearGradient 
            style = {styles.graphContainer}
            colors={[ColorsBlue.blue1200, ColorsBlue.blue1100]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
             >
                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginVertical: 8, color: ColorsBlue.blue50 }}>
                    {title}
                </Text>
            <View style={{ flexDirection: 'row', height: chartHeight }}>
                <View style={styles.YlableContainer}>
                    <Text style = {[styles.Ylabel, chartCtx.trueCount === 1 && {marginRight: 5, fontSize: 14}]}>{ylable}</Text>
                    <YAxis
                    data={yData}
                    contentInset={{top: 0, bottom: 40}}
                    svg={{ fontSize: 10, fill: ColorsBlue.blue50 }}
                    numberOfTicks={numberOfTicks}
                    formatLabel={(value) => `${value}`}
                    yMin={Math.min(...yData)}
                    yMax={Math.max(...yData)}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart
                        data={newChartData}
                        svg={{ stroke: ColorsRed.red500 }}
                        contentInset={{top: 0, bottom: 40, left: 5, right: 8}}
                        style={{ flex: 1 }}
                        yMin={Math.min(...yData)}
                        yMax={Math.max(...yData)}
                        xMin={0}
                        xMax={Math.max(...xData)}
                        numberOfTicks={numberOfTicks}
                        gridMinInterval={1}
                        gridMaxInterval={1}
                        animate={true}
                        animationDuration={200}
                        animationEasing={'ease-in-out'}
                        showGrid={true}
                        xAccessor={({ item }) => item.x}
                        yAccessor={({ item }) => item.y}
                    >
                    
                    <Grid
                    svg={{
                        strokeOpacity: 0.5,
                        strokeDasharray: '0',
                        strokeWidth: 1,
                        stroke: ColorsBlue.blue200
                    }}
                    belowChart={true}
                    />
                    <Decorator data={newChartData}/>
                    </LineChart>
                    <View style={styles.XlableContainer}>
                        <XAxis
                            data={xDataordered}
                            contentInset={{ left: 5, right: 8 }}
                            svg={{ fontSize: 10, fill: ColorsBlue.blue50 }}
                            numberOfTicks={5}
                            formatLabel={(value, index) => value ? `${value}` : ''}
                            xMin={0}
                            xMax={xData[xData.length - 1]}
                            xAccessor={({ item }) => item}
                        />
                        <Text style = {[styles.Xlabel, chartCtx.trueCount === 1 && {marginTop: 5, fontSize: 16}]}>{xlable}</Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};




export default GraphDisplay


const styles = StyleSheet.create({
    graphContainer: {
        margin: 2,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ColorsBlue.blue1200,
        borderColor: ColorsBlue.blue700,
        borderWidth: 0.6,
        elevation: 4, 
        shadowColor: ColorsBlue.blue900,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 4,
        shadowOpacity: 0.7,
        flex: 1,
        padding: 5,
    },
    Ylabel: {
        fontSize: 8,
        color: ColorsBlue.blue50,
        textAlign: 'center',
        marginRight: 4,
        marginBottom: 60,
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
        justifyContent: 'center'
    },
})