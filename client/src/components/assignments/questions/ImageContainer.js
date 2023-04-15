import { useIsFocused } from '@react-navigation/native'
import { BlurView } from 'expo-blur';
import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
import { StyleSheet, View, Animated, FlatList, Alert} from "react-native"
import { ColorsBlue, ColorsLighterGold, ColorsTile } from "../../../constants/palet"
import { deleteMeasurementResult, getSpecificMeasurementResult } from "../../../hooks/measurement_results";
import { ChartContext } from "../../../store/chart-context";
import { UserProfileContext } from "../../../store/userProfile-context";
import Icon from "../../Icon";
import ChartDisplay from "../../robot/driving_on_command/chartDisplay";
import LoadingChat from "../../UI/LoadingChat";
import AssignmentOptionsBar from "./assignmentOptionsBar";

function ImageContainer({
    imageHeight,
    title,
    assignment_number,
    tokens,
    keyboardHeight,
    subject,
    chartAvailable,
    setChartAvailable,
    redirectToMeasurementHandler,
  }) {
    const chartCtx = useContext(ChartContext);
    const userprofileCtx = useContext(UserProfileContext);
    const [isFetched, setIsFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isFocused = useIsFocused();
    const chartLength = chartCtx.finalChartData.length;
    const flatListRef = useRef(null);
  
    async function fetchData() {
        try {
            const specificAssignmentImages = await getSpecificMeasurementResult(
                userprofileCtx.userprofile.id,
                title,
                assignment_number,
                subject
            );
            console.log(specificAssignmentImages)
            if (specificAssignmentImages.length === 0) {
                console.log(
                `failed to fetch or no images are present in the database`
                );
                setIsFetched(false);
                setIsLoading(false);
                setChartAvailable(false);
                return;
            }

                chartCtx.setAllChartsDataHandler(specificAssignmentImages);
                setChartAvailable(true);
                setIsFetched(true);
                setIsLoading(false);
            } 
        catch (error) {
            console.log('no images yet');
            setIsFetched(false);
            setChartAvailable(false);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!isFocused || isFetched) {
            return;
        }
        setIsLoading(true);
        setIsFetched(false);
        setChartAvailable(false);
    
        fetchData();
    }, [assignment_number, isFocused, userprofileCtx.userprofile.id, chartCtx]);
  
    if (!isFocused || chartLength === 0) {
      return null;
    }
  
    function handleScroll(event) {
      const { contentOffset, layoutMeasurement } = event.nativeEvent;
      const index = Math.floor(contentOffset.x / layoutMeasurement.width);
      setCurrentIndex(index);
    }
  
    async function deleteImageHandler() {
      const currentChartData = chartCtx.finalChartData[currentIndex];
      if (!currentChartData?.distance) {
        Alert.alert('Produce data before deleting an image');
        return;
      }
      const recordNumber = currentChartData.recordNumber;
  
      await deleteMeasurementResult(recordNumber)
        .then(() => {
          console.log(`deleted image with record_number: ${recordNumber}`);
          chartCtx.setFinalChartData(
            chartCtx.finalChartData.filter(
              (data) => data.recordNumber !== recordNumber
            )
          );
          console.log(`deleted image from local app wide state`);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  
    function renderImage({ item }) {
        return (
          <Animated.View style={[styles.image, { height: imageHeight, width: 370 }]}>
            <BlurView style={[styles.graphContainer]} intensity={10} tint="dark">
              <ChartDisplay
                chartData={item}
                chartToggle={chartCtx.chartToggle}
                trueCount={chartCtx.trueCount}
                finalPlot={true}
                displayChart={chartCtx.trueCount > 1 ? 460 : 290}
              />
            </BlurView>
          </Animated.View>
        );
      }
    
      function onMetingPressed(index) {
        flatListRef.current.scrollToIndex({ index, animated: true });
      }

      
      return (
        <>
          {isLoading ? (
            <LoadingChat size="large" color={ColorsBlue.blue900} />
          ) : (
            chartAvailable && (
              <>
                <View style={styles.optionbar}>
                  <AssignmentOptionsBar
                    midIcon="trash-can-outline"
                    rightIcon="menu-down"
                    midIconHandler={deleteImageHandler}
                    text={tokens}
                    chartLength={chartLength}
                    redirectToMeasurementHandler={redirectToMeasurementHandler}
                    currentIndex={currentIndex}
                    onMetingPressed={onMetingPressed}
                  />
                </View>
                <View style={styles.container}>
                  <Animated.View style={{ marginBottom: keyboardHeight }}>
                    <View style={styles.imageContainer}>
                      {isFetched && (
                        <FlatList
                          ref={flatListRef}
                          data={chartCtx.finalChartData}
                          keyExtractor={(item, index) => index}
                          renderItem={renderImage}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          pagingEnabled
                          onScroll={handleScroll}
                        />
                      )}
                    </View>
                  </Animated.View>
                </View>
              </>
            )
          )}
        </>
      );
}

export default React.memo(ImageContainer)





const styles= StyleSheet.create({
    graphContainer: {
        flex: 1
    },
    imageContainer: {
        justifyContent: 'center',
    },  
    image: {
        alignSelf: 'center',
        justifyContent: 'center',
    },
    container: {
        marginHorizontal: 8,
        marginVertical: 6,
        borderColor: `rgba(77, 77, 77, 0.5)`,
        borderWidth: 1,
        padding: 1.6,
        shadowColor: `rgba(11, 11, 11)`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 2
    },
    optionbar:{
        marginHorizontal: 8,
        marginTop: 17,
        borderColor: `rgba(77, 77, 77, 0.5)`,
        borderWidth: 1,
        padding: 1.6,
        shadowColor: `rgba(11, 11, 11)`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 2
    }
})