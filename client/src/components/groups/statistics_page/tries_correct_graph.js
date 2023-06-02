
import { VictoryLine, VictoryChart, VictoryTheme, VictoryZoomContainer, VictoryScatter, VictoryAxis, VictoryArea, VictoryBar } from "victory-native";
import { ColorsBlue, ColorsBrownWood, ColorsGray, ColorsGreen, ColorsPurple, ColorsRed } from "../../../constants/palet";
import {StyleSheet, View, Text, Dimensions} from 'react-native'



const screenWidth = Dimensions.get('window').width;
function TriesCorrectGraph({groupData, title, left}) {
    const ColorPoints = [ColorsRed.red700, ColorsBrownWood.wood500, ColorsGreen.green900,  ColorsPurple.purple600, ]

    const xData = groupData.map(point => point.tries);
    const yData = groupData.map(point => point.correct);
    const xMin = 0
    const xMax = Math.max(...xData);
    const yMin = 0
    const yMax = Math.max(...yData);


    const cutoff = 0.1;

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

    return (
    <View style = {styles.container}>
        <Text style={[styles.title, {top: '7%', left: left}]}>
            {title}
        </Text>
        <Text style={[styles.yLabel, {top: 30}]}>Correct</Text>
        <VictoryChart 
            theme={customTheme}
            domain={{x: [xMin, xMax + xMax / 14], y: [yMin, yMax + cutoff]}}
            containerComponent={<VictoryZoomContainer />}
            padding={{right:80, left: 30, top: 55, bottom: 60}} //Add padding here
            >
            <VictoryAxis
                dependentAxis
                style={{
                axisLabel: { dx: 130, dy: 10, fontSize: 16, fontWeight: 'bold', fill: ColorsBlue.blue100, zIndex: 10 }, //Padding for Y-Axis label 
                tickLabels: { fill:  ColorsGray.gray600  },
                }}
            />

            <VictoryAxis
                label={"Pogingen"}
                style={{
                axisLabel: { dy: 30, dx: -5, fontSize: 16, fontWeight: 'bold', fill: ColorsBlue.blue200, zIndex: 10 }, //Padding for X-Axis label
                tickLabels: { fill: ColorsGray.gray600, dx: 8 },
                }}
            />

            <VictoryLine
                data={groupData}
                x="tries"
                y="correct"
                style={{
                data: { stroke: ColorPoints[0] }
                }}
            />
            <VictoryScatter
                data={groupData}
                x="tries"
                y="correct"
                style={{
                data: { fill: 'white', stroke: ColorPoints[0], strokeWidth: 3 }
                }}
            />
            </VictoryChart>
    </View>
    )
}


export default TriesCorrectGraph;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,

        borderColor: `rgba(77, 77, 77, 0.17)`,
        borderWidth: 1,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: {height: 3, width: 1},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
        borderRadius: 20,
        padding: 15,
        height: 380,
        width: screenWidth - 20,
        backgroundColor: ColorsBlue.blue1325,
    },
    title: {
        position: 'absolute',
        left: "43%",
        fontSize: 25, 
        fontWeight: 'bold',
        color: ColorsBlue.blue200,
    },
    yLabel: {
        position: 'absolute',
        color: ColorsBlue.blue100,
        fontSize: 16,
        fontWeight: 'bold',
        top: 0,  // Adjust these as needed
        left: 10,
    
    },

})