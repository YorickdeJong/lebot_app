import { useIsFocused } from '@react-navigation/native'
import { BlurView } from 'expo-blur';
import React, { useContext, useEffect, useState, useRef } from "react";
import { StyleSheet, View, Animated, FlatList, Alert} from "react-native"
import { ColorsBlue} from "../../../constants/palet"
import { deleteMeasurementResult, getSpecificMeasurementResult } from "../../../hooks/measurement_results";
import { ChartContext } from "../../../store/chart-context";
import { UserProfileContext } from "../../../store/userProfile-context";
import ChartDisplay from "../../robot/driving_on_command/chartDisplay";
import LoadingChat from "../../UI/LoadingChat";
import AssignmentOptionsBar from "./assignmentOptionsBar";
import { deletePowerMeasurementResult, getSpecificPowerMeasurementResult } from '../../../hooks/power_measurement.hooks';

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
    checkDataCorrectnessHandler,
    blinkButton,
    performedMeasurement,
    opacityChange,
    slideCount,
    nextSlideHandler,
    prevSlideHandler,
    slideCountEnd,
    setSlideCount
  }) {
    const chartCtx = useContext(ChartContext);
    const [isFetched, setIsFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isFocused = useIsFocused();
    const chartLength = chartCtx.finalChartData.length;
    const flatListRef = useRef(null);
    const userprofileCtx =  useContext(UserProfileContext);
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    const [alertShown, setAlertShown] = useState(false);
    const [velocity, setVelocity] = useState([]);
    async function fetchData() {
      let specificAssignmentImages;
      try {
            if (subject === "MOTOR"){
              //change this fetch to fetch specific group result
                specificAssignmentImages = await getSpecificMeasurementResult( //if subject -> fetch from power data
                    school_id, 
                    class_id, 
                    group_id,
                    title,
                    assignment_number,
                    subject
                );
                setVelocity(specificAssignmentImages.map(data => data.velocity));
            } 

            if (subject === "CAR"){
                specificAssignmentImages = await getSpecificPowerMeasurementResult( //if subject -> fetch from power data
                    school_id, 
                    class_id, 
                    group_id,
                    title,
                    assignment_number,
                    subject
                );

            }
            if (specificAssignmentImages.length === 0) {
                console.log(
                  `failed to fetch or no images are present in the database`
                );
                setIsFetched(false);
                setIsLoading(false);
                setChartAvailable(false);
                return;
            }
                // set final chart data
                chartCtx.setAllChartsDataHandler(specificAssignmentImages);
                //ADD setAllPowerCharsDataHandler
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

        if (chartLength === 0) {
            setChartAvailable(false);
        }
        else {
            setChartAvailable(true);
        }
    
        fetchData();
    }, [assignment_number, isFocused, chartCtx]);
  
    if (!isFocused || chartLength === 0) {
      setChartAvailable(false);
      return null;
    }
  
    function handleScroll(event) {
        const { contentOffset, layoutMeasurement } = event.nativeEvent;
        const index = Math.floor(contentOffset.x / layoutMeasurement.width);
        setCurrentIndex(index);
    }
  
    async function deleteImageHandler() {
        const {recordNumber} = chartCtx.finalChartData[currentIndex];
        console.log('CURRENTCHARTDATA: ', recordNumber);
        // const recordNumber = currentChartData.recordNumber;

        if (subject === "MOTOR"){
            if (!recordNumber) {
              Alert.alert('Produce data before deleting an image');
              return;
            }
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
              setIsLoading(false);
        }

        if (subject === "CAR"){
            if (!recordNumber) {
              Alert.alert('Produce data before deleting an image');
              return;
            }
            await deletePowerMeasurementResult(recordNumber)
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
            setIsLoading(false);
        }
    
    }
  
    function renderImage({ item, index }) {
      let isConstant;
        if (checkDataCorrectnessHandler) {
          isConstant = checkDataCorrectnessHandler(velocity[index]);
        }
        else {
          isConstant = 2;
        }
        //check if measurement is accurate enough
        if (!alertShown && (!isConstant && isConstant !== 2)) {
          Alert.alert('Deze meeting is waarschijnlijk niet accuraat genoeg, het is verstandig om de meeting opnieuw te doen en deze meeting te verwijderen.');
          setAlertShown(true);
        }

        return (
          <Animated.View style={[styles.image, { height: imageHeight, width: 372, borderRadius: 20 }]}>
            <View style={[styles.graphContainer]}>
              {/* Add condition to check which subject we are looking at */}
              <ChartDisplay
                chartData={item}
                chartToggle={chartCtx.chartToggle}
                trueCount={chartCtx.trueCount}
                finalPlot={true}
                displayChart={chartCtx.trueCount > 1 ? 460 : 290}
                subject = {subject}
                isConstant={isConstant}
              />

            </View>
          </Animated.View>
        );
      }
    
      function onMetingPressed(index) {
        flatListRef.current.scrollToIndex({ index, animated: true });
      }

      
      return (
        <>
          {isLoading ? (
            <View style = {{marginBottom: 20}}>
              <LoadingChat size="large" color={ColorsBlue.blue900} />
            </View>
          ) : (
              <>
              <View> 
                    <AssignmentOptionsBar
                      midIconHandler={deleteImageHandler}
                      text={tokens}
                      chartLength={chartLength}
                      redirectToMeasurementHandler={redirectToMeasurementHandler}
                      currentIndex={currentIndex}
                      onMetingPressed={onMetingPressed}
                      subject={subject}
                      blinkButton = {blinkButton}
                      chartAvailable={chartAvailable}
                      performedMeasurement={performedMeasurement}
                      opacityChange={opacityChange}
                      slideCount = {slideCount}
                      nextSlideHandler = {nextSlideHandler}
                      prevSlideHandler = {prevSlideHandler}
                      slideCountEnd = {slideCountEnd}
                      setSlideCount = {setSlideCount}
                    />
              </View>
            {chartAvailable && 
                <View style={styles.container}>
                  <Animated.View style={{ marginBottom: keyboardHeight,  }}>
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
            }
            </>
          )}
        </>
      );
}

export default React.memo(ImageContainer)





const styles= StyleSheet.create({
    graphContainer: {
        flex: 1,
        shadowColor: `rgba(77, 77, 77, 0.15)`,
        shadowOffset: {height: 2, width: 1},
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 2,
        backgroundColor: ColorsBlue.blue1390,
      },
      imageContainer: {
        justifyContent: 'center',
      },  
      image: {
        alignSelf: 'center',
        justifyContent: 'center',
        // backgroundColor: 'rgba(0, 0, 20, 0.75)',
        overflow: 'hidden',
      },
      container: {
        marginHorizontal: 8,
        marginVertical: 8,
        borderColor: `rgba(77, 77, 77, 0.17)`,
        borderWidth: 1,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: {height: 3, width: 1},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
        borderRadius: 20,
    },
})