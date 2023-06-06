import { useIsFocused } from '@react-navigation/native'
import { BlurView } from 'expo-blur';
import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { StyleSheet, View, Animated, FlatList, Alert} from "react-native"
import { ColorsBlue} from "../../../constants/palet"
import { deleteMeasurementResult, getSpecificMeasurementResult } from "../../../hooks/measurement_results";
import { ChartContext } from "../../../store/chart-context";
import { UserProfileContext } from "../../../store/userProfile-context";
import ChartDisplay from "../../robot/driving_on_command/chartDisplay";
import LoadingChat from "../../UI/LoadingChat";
import AssignmentOptionsBar from "./assignmentOptionsBar";
import { deletePowerMeasurementResult, getSpecificPowerMeasurementResult } from '../../../hooks/power_measurement.hooks';
import Swiper from 'react-native-swiper';

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
    setSlideCount,
    slideTotal,
    currentSlidePosition,
    isKeyboardOpen,
  }) {
    const chartCtx = useContext(ChartContext);
    const [isFetched, setIsFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isFocused = useIsFocused();
    const chartLength = chartCtx.finalChartData.length;
    // const flatListRef = useRef(null);
    const swiperRef = useRef(null);
    const userprofileCtx =  useContext(UserProfileContext);
    const {school_id, class_id, group_id} = userprofileCtx.userprofile;
    const [alertShown, setAlertShown] = useState(false);
    const [velocity, setVelocity] = useState([]);

    const fetchData = useCallback(async () => {
        let specificAssignmentImages;
        if (!performedMeasurement){
            setIsLoading(false);
            setIsFetched(false);
            setChartAvailable(false);
            return;
        }
        try {
            setIsLoading(true);
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
                  setVelocity(specificAssignmentImages.map(data => data.velocity_time));
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
    }, [school_id, class_id, group_id, title, assignment_number, subject, performedMeasurement, slideCount]);


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
    }, [assignment_number, isFocused, chartCtx.finalChartData, slideCount]);
  
    const deleteImageHandler = useCallback(async () => {
        const {recordNumber} = chartCtx.finalChartData[currentIndex];
        console.log('CURRENTCHARTDATA: ', recordNumber);

        Alert.alert(
          'Let Op!',
          'Weet je zeker dat je deze meting wilt verwijderen?',
          [
              {
                  text: 'No',
                  onPress: () => {},
                  style: 'cancel',
              },
              {
                  text: 'Yes',
                  onPress: async () => {
                      try {
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
                                setIsLoading(false);
                              })
                              .catch((error) => {
                                console.log(error);
                                setIsLoading(false);
                              });
                            
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
                                setIsLoading(false);
                              })
                              .catch((error) => {
                                console.log('failed to delete', error);
                                setIsLoading(false);
                            });
                            
                        }
                      }
                      catch(error) {
                          Alert.alert('Het is niet gelukt om de meting te verwijderen')
                          return
                      }
                  }
                }
              ]
          )
    }, [subject, chartCtx.finalChartData, currentIndex]);
  
    function renderImage({ item, index }) {
        let isConstant;
          if (checkDataCorrectnessHandler) {
            // isConstant = checkDataCorrectnessHandler(velocity[index]);
            isConstant = true
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
            <Animated.View style={[styles.image, { height: imageHeight, borderRadius: 18 }]}>
                {/* Add condition to check which subject we are looking at */}
                <ChartDisplay
                  chartData={item}
                  chartToggle={chartCtx.chartToggle}
                  trueCount={chartCtx.trueCount}
                  finalPlot={true}
                  displayChart={chartCtx.trueCount > 1 ? 470 : 290}
                  subject = {subject}
                  isConstant={isConstant}
                />
            </Animated.View>
          );
    }
      

    function onMetingPressed(index) {
        swiperRef.current.scrollBy(index - currentIndex, true);
    }

    if (!isFocused) {
      // setChartAvailable(false);
      return null;
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
                    slideTotal = {slideTotal}
                    currentSlidePosition = {currentSlidePosition}
                  />
            </View>
          {chartAvailable && chartLength > 0 &&
            <Swiper
              ref={swiperRef}
              loop={false}
              showsPagination={true}
              dotColor={"#000000"}
              activeDotColor={"#999999"}
              index={currentIndex}
              onIndexChanged={(index) => setCurrentIndex(index)}
              style={{height: chartCtx.trueCount === 1 ? 380 : 570}}
              removeClippedSubviews={false}
              renderPagination={(index, total, context) => {
                return (
                  <View style={styles.paginationContainer}>
                    {[...Array(total)].map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          {marginBottom: chartCtx.trueCount === 1 ? 10 : 0},
                          i === index ? { backgroundColor: "#999999" } : { backgroundColor: "#000000" }
                        ]}
                      />
                    ))}
                  </View>
                );
              }}
            >
              {chartCtx.finalChartData.map((item, index) => (
                <View key={index} style={styles.container}>
                  <Animated.View style={{ marginBottom: isKeyboardOpen ? keyboardHeight : 0 }}>
                    {isFetched && renderImage({ item, index })}
                  </Animated.View>
                </View>
              ))}
            </Swiper>
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
      },
      image: {
        // alignSelf: 'center',
        // justifyContent: 'center',
        overflow: 'hidden',
      },
      container: {
        marginHorizontal: 8,
        borderColor: `rgba(77, 77, 77, 0.17)`,
        borderWidth: 1,
        shadowColor: `rgba(0, 0, 0, 1)`,
        shadowOffset: {height: 3, width: 1},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
        borderRadius: 20,
        backgroundColor: ColorsBlue.blue1300,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 2,
        
    },
})