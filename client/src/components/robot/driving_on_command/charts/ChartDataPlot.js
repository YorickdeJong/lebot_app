import { VictoryLine, VictoryChart, VictoryTheme, VictoryZoomContainer, VictoryScatter, VictoryAxis } from "victory-native";
import { ColorsBlue, ColorsBrownWood, ColorsGray, ColorsGreen, ColorsPurple, ColorsRed } from "../../../../constants/palet";
import {StyleSheet, View, Text} from 'react-native'
import Icon from "../../../Icon";

function ChartDataPlot({chartData, yMin, yMax, xMin, xMax, title, xlabel, ylabel, finalPlot, motorNumber, trueCount}) {
    const ColorPoints = [ColorsRed.red700, ColorsBrownWood.wood500, ColorsGreen.green900,  ColorsPurple.purple600, ]
    
    const customTheme = {
        ...VictoryTheme.material,
        axis: {
          ...VictoryTheme.material.axis,
          style: {
            ...VictoryTheme.material.axis.style,
            grid: {
              stroke: "grey", // change grid color here
              strokeWidth: 0.6 // change grid line thickness here
            }
          }
        }
      }

    let cutoff;
    if (Math.abs(yMax) > Math.abs(yMin)) {
        cutoff = Math.abs(yMax) / 8;
    } 
    else {
        cutoff = Math.abs(yMin) / 8;
    }

    const paddingCountOne = { top: finalPlot ? 40 : 20, bottom: finalPlot ? 55 : 0, left: 48, right: 35 }
    const paddingCountTwo = { top: finalPlot ? 40 : 30, bottom: finalPlot ? 120 : 170, left: 48, right: 35 }

    return (
        <View style = {[styles.container]}>
            <Text style={[styles.title, {top: !finalPlot && trueCount == 1 && '3%'}]}>
                    {title}
            </Text>
            <Text style={[styles.yLabel, {top: trueCount == 1 ? 40 : 30}]}>{ylabel}</Text>
            <View style = {{marginTop: !finalPlot && trueCount == 1 ? 60 : 20}}>
                <VictoryChart 
                    theme={customTheme}
                    domain={{x: [xMin, xMax + xMax / 14], y: [yMin - cutoff, yMax + cutoff]}}
                    containerComponent={finalPlot && <VictoryZoomContainer />}
                    padding={trueCount == 1 ? paddingCountOne : paddingCountTwo} //Add padding here
                    >
                    <VictoryAxis
                    dependentAxis
                    style={{
                        axisLabel: { dx: 130, dy: 10, fontSize: 19, fontWeight: 'bold', fill: ColorsBlue.blue100, zIndex: 10 }, //Padding for Y-Axis label 
                        tickLabels: { fill: finalPlot ? ColorsGray.gray600 : 'white', },
                    }}
                    />
                    <VictoryAxis
                    label={xlabel}
                    style={{
                        axisLabel: { dy: -5, dx: 155, fontSize: 19, fontWeight: 'bold', fill: ColorsBlue.blue100, zIndex: 10 }, //Padding for X-Axis label
                        tickLabels: { fill: finalPlot ? ColorsGray.gray600 : 'white', dx: 8 },
                    }}
                    />
                    {chartData.map((data, i) => (
                        <VictoryLine
                        key={i}
                        data={data}
                        x="time"
                        y="value"
                        style={{
                            data: { stroke: ColorPoints[i] }
                        }}
                        />
                    ))}
                    {chartData.map((data, i) => (
                        <VictoryScatter
                        key={i}
                        data={data}
                        x="time"
                        y="value"
                        style={{
                            data: { fill: 'white', stroke: ColorPoints[i], strokeWidth: 3 }
                        }}
                        />
                    ))}
                </VictoryChart>
            </View>
        </View>
    );
}

export default ChartDataPlot;

const styles = StyleSheet.create({
    container: {
        // marginBottom: 100,
        flex: 1
        
        // height: '100%'
    },
    title: {
        position: 'absolute',
        left: "40%",
        fontSize: 23, 
        fontWeight: '300', 
        color: ColorsBlue.blue200,
    },
    yLabel: {
        position: 'absolute',
        color: ColorsBlue.blue50,
        fontSize: 18,
        fontWeight: 'bold',
        top: 0,  // Adjust these as needed
        left: 25,
    },

})