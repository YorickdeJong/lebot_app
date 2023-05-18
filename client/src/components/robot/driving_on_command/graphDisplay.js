import React, { useContext, useEffect, useMemo, useState } from "react";
import { StyleSheet, } from "react-native";
import { ColorsBlue, ColorsBrownWood, ColorsGreen,  ColorsPurple, ColorsRed } from "../../../constants/palet";
import ChartDataPlot from "./charts/ChartDataPlot";
import { SocketContext } from "../../../store/socket-context";
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
    const {title, xlabel, ylabel} = getTitleXLabelYLabel(dataType)
    const socketCtx = useContext(SocketContext);
    let legendItems;

    // Other lines remain same...
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        setChartData(data)
    }, [data, finalPlot, socketCtx.power]);

    const flattenedChartData = [].concat(...chartData.flat());

    const xData = flattenedChartData.map(point => point.time);
    const yData = flattenedChartData.map(point => point.value);
    const xMin = Math.min(...xData);
    const xMax = Math.max(...xData);
    const yMin = Math.min(...yData);
    const yMax = Math.max(...yData);

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
        <>
        <ChartDataPlot
            chartData={chartData}
            xMin={xMin}
            xMax={xMax}
            yMin={yMin}
            yMax={yMax}
            title = {title}
            xlabel = {xlabel}
            ylabel = {ylabel}
            motorNumber = {motorNumber}
            legend = {legend}
            trueCount = {trueCount}
            finalPlot = {finalPlot}
        />
        </>
    );
}

export default React.memo(GraphDisplay)


function getTitleXLabelYLabel(dataType) {
    switch (dataType) {
        case "distance_time":
            return { title: "s-t graph", xlabel: " t", ylabel: " s" };
        case "velocity_time":
            return { title: "v-t graph", xlabel: " t", ylabel: " v" };
        case "power_time":
            return { title: "P-t graph", xlabel: " t", ylabel: " P" };
        case "voltage_time":
            return { title: "U-t graph", xlabel: " t", ylabel: " U" };
        case "current_time":
            return { title: "I-t graph", xlabel: " t", ylabel: " I" };
        default:
            return { title: "", xlabel: "", ylabel: "" };
    }
}


const styles = StyleSheet.create({
    graphContainer: {
        borderRadius: 10,
        flex: 1,
    },
    titleContainer: {
        height: 45,
        marginBottom: 20,
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