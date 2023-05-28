import { VictoryLine, VictoryChart, VictoryTheme, VictoryZoomContainer, VictoryScatter, VictoryAxis, VictoryGroup, ZoomHelpers, VictoryContainer } from "victory-native";
import { ColorsBlue, ColorsBrownWood, ColorsGray, ColorsGreen, ColorsPurple, ColorsRed } from "../../../../constants/palet";
import {StyleSheet, View, Text, Button} from 'react-native'
import Icon from "../../../Icon";
import { useRef, useState } from "react";

function ChartDataPlot({chartData, yMin, yMax, xMin, xMax, title, xlabel, ylabel, finalPlot, motorNumber, trueCount}) {
    const ColorPoints = [ColorsRed.red700, ColorsBrownWood.wood500, ColorsGreen.green900,  ColorsPurple.purple600, ]
    const panFactor = 0.2;

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

    const [zoomDomain, setZoomDomain] = useState({ x: [0, finalPlot ? xMax + 0.5 : 0.5], y: [finalPlot ? yMin - cutoff : 0, isFinite(yMax) ? yMax + cutoff : 0.5] });

    const handleZoomIn = () => {
      // Implement your logic to calculate the new zoom domain for zooming in
      const newZoomDomain = { 
        x: [zoomDomain.x[0] * 1.2, zoomDomain.x[1] * 0.8], 
        y: [zoomDomain.y[0] * 1.2, zoomDomain.y[1] * 0.8] 
      };
      setZoomDomain(newZoomDomain);
    };
  
    const handleZoomOut = () => {
      // Implement your logic to calculate the new zoom domain for zooming out
      const newZoomDomain = { 
        x: [zoomDomain.x[0] * 0.8, zoomDomain.x[1] * 1.2], 
        y: [zoomDomain.y[0] * 0.8, zoomDomain.y[1] * 1.2] 
      };
      setZoomDomain(newZoomDomain);
    };

    const handleRefresh = () => {
        setZoomDomain({ x: [0, xMax + 0.5], y: [yMin - cutoff, yMax + cutoff] });
    }

    const handlePanLeft = () => {
        const xRange = zoomDomain.x[1] - zoomDomain.x[0];
        const newXMin = Math.max(xMin, zoomDomain.x[0] - panFactor * xRange);
        const newXMax = Math.min(xMax, zoomDomain.x[1] - panFactor * xRange);
        setZoomDomain({ ...zoomDomain, x: [newXMin, newXMax] });
      };
      
      const handlePanRight = () => {
        const xRange = zoomDomain.x[1] - zoomDomain.x[0];
        const newXMin = Math.max(xMin, zoomDomain.x[0] + panFactor * xRange);
        const newXMax = Math.min(xMax, zoomDomain.x[1] + panFactor * xRange);
        setZoomDomain({ ...zoomDomain, x: [newXMin, newXMax] });
      };

    return (
        <View style = {[styles.container]}>
            <Text style={[styles.title, {top: !finalPlot && trueCount == 1 ? '3%' : 0}]}>
                    {title}
            </Text>
            <Text style={[styles.yLabel, {top: trueCount == 1 ? 40 : 30}]}>{ylabel}</Text>
            <View style = {{marginTop: !finalPlot && trueCount == 1 ? 60 : 20}}>
                <VictoryChart 
                    theme={customTheme}
                    domain={{x: [xMin, xMax + xMax / 14], y: [yMin - cutoff, yMax + cutoff]}}
                    containerComponent={
                        finalPlot ? 
                        <VictoryZoomContainer 
                            zoomDomain={zoomDomain}
                            onZoomDomainChange={(domain) => setZoomDomain(domain)}
                        /> : <VictoryContainer />
                    }
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
                        <VictoryGroup key={i}>
                            <VictoryLine
                                data={data}
                                x="time"
                                y="value"
                                style={{
                                    data: { stroke: ColorPoints[i] }
                                }}
                            />
                            <VictoryScatter
                                data={data}
                                x="time"
                                y="value"
                                style={{
                                    data: { fill: 'white', stroke: ColorPoints[i], strokeWidth: 3 }
                                }}
                            />
                        </VictoryGroup>
                    ))}
                </VictoryChart>
            </View>

                {/* right icons */}
              {finalPlot &&
              <>

                    <View style = {{position: 'absolute', top: '11%', right: '15%'}}>
                        <Icon icon="zoom-in" 
                            MaterialIconsDir={true} 
                            onPress={() => handleZoomIn()} 
                            size = {30}
                            color = {ColorsBlue.blue400}
                        />
                    </View>
                    <View style = {{position: 'absolute', top: '11%', right: '5%'}}>
                        <Icon 
                            icon="zoom-out" 
                            MaterialIconsDir={true} 
                            onPress={() => handleZoomOut()} 
                            size = {30}
                            color = {ColorsBlue.blue400}
                        />
                    </View>


                    {/* left icons */}
                    <View style = {{position: 'absolute', top: '11%', left: '5%'}}>
                        <Icon 
                            icon="refresh" 
                            onPress={() => handleRefresh()} 
                            size = {23}
                            color = {ColorsBlue.blue400}
                        />
                    </View>
                    
                    <View style = {{position: 'absolute', top: '11%', left: '15%'}}>
                        <Icon 
                            icon="pan-left" 
                            onPress={() => handlePanLeft()}
                            size = {28}
                            color = {ColorsBlue.blue400}
                            differentDir={true}
                        />
                    </View>
                    <View style = {{position: 'absolute', top: '11%', left: '20%'}}>
                        <Icon 
                            icon="pan-right" 
                            onPress={() => handlePanRight()}
                            size = {28}
                            color = {ColorsBlue.blue400}
                            differentDir={true}
                        />
                    </View>
              </>
              }
        </View>
    );
}

export default ChartDataPlot;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 20
    },
    title: {
        position: 'absolute',
        left: "38%",
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