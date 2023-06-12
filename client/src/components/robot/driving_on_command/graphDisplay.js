import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { StyleSheet, } from "react-native";
import { ColorsBlue, ColorsBrownWood, ColorsGreen,  ColorsPurple, ColorsRed } from "../../../constants/palet";
import ChartDataPlot from "./charts/FinalChartDataPlot";
import { SocketContext } from "../../../store/socket-context";
import FinalChartDataPlot from "./charts/FinalChartDataPlot";
import LiveChartDataPlot from "./charts/LiveChartDataPlot";
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
    const getTitleXLabelYLabel = useCallback((dataType) => {
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
    }, [dataType])

    
    const {title, xlabel, ylabel} = getTitleXLabelYLabel(dataType)
    let legendItems;


    let xMin, xMax, yMin, yMax;
    if (finalPlot) {
        const yData = data[0].map(point => point.value);
        xMin = 0
        xMax = data[0].length / 2;
        yMin = Math.min(...yData);
        yMax = Math.max(...yData);
    }

    if (motorNumber) {
        legendItems = useMemo(() => [
            motorNumber[0] && { label: `Motor ${motorNumber[0]}`, color: ColorPoints[motorNumber[0] - 1] },
            motorNumber[1] && { label: `Motor ${motorNumber[1]}`, color: ColorPoints[motorNumber[1] - 1] },
            motorNumber[2] && { label: `Motor ${motorNumber[2]}`, color: ColorPoints[motorNumber[2] - 1] },
            motorNumber[3] && { label: `Motor ${motorNumber[3]}`, color: ColorPoints[motorNumber[3] - 1] },
        ].filter(Boolean), [motorNumber]);
    }

    if (data.length === 0){
        return null;
    } 
    return (
        <>
        {finalPlot && 
        <FinalChartDataPlot
            chartData={data}
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
        />
        }
        {!finalPlot && 
        <LiveChartDataPlot
            chartData={data}
            title = {title}
            xlabel = {xlabel}
            ylabel = {ylabel}
            motorNumber = {motorNumber}
            legend = {legend}
            trueCount = {trueCount}
        />}
        </>
    );
}

export default React.memo(GraphDisplay)



