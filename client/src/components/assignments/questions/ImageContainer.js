import { useIsFocused } from '@react-navigation/native'
import { BlurView } from 'expo-blur';
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Animated, FlatList, Alert} from "react-native"
import { ColorsBlue, ColorsLighterGold, ColorsTile } from "../../../constants/palet"
import { deleteMeasurementResult, getSpecificMeasurementResult } from "../../../hooks/measurement_results";
import { ChartContext } from "../../../store/chart-context";
import { UserProfileContext } from "../../../store/userProfile-context";
import Icon from "../../Icon";
import ChartDisplay from "../../robot/driving_on_command/chartDisplay";
import LoadingChat from "../../UI/LoadingChat";
import AssignmentOptionsBar from "./assignmentOptionsBar";

function ImageContainer({imageHeight, title, assignment_number, tokens, keyboardHeight}) {
    const chartCtx = useContext(ChartContext)
    const userprofileCtx = useContext(UserProfileContext);
    const [isFetched, setIsFetched] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dataArrayLength, setDataArrayLength] = useState([]);
    const [chartAvailable, setChartAvailable] = useState(false);
    const isFocused = useIsFocused();
    const chartLength = chartCtx.chartData.length

    console.log(`CHECK IMAGE CONTAINER`)
    
    useEffect(() => {
        if (!isFocused){ //if the screen isn't focussed, don't render
            return;
        }
        setIsLoading(true)
        setIsFetched(false)
        setChartAvailable(false)
        setDataArrayLength(Array.from({ length: chartLength }, (_, index) => index));
    }, [assignment_number, isFocused, chartLength])

    useEffect(() => {
        if (!isFocused){
            return;
        }
        if (chartLength === 0){
            setIsFetched(false);
        }
    }, [isLoading])


    useEffect(() => {   
        if (!isFocused){
            return;
        }
        if (isFetched){
            setIsLoading(false)
            return
        }

        async function fetchData(){
            setIsLoading(true)
            try {
                const specificAssignmentImages = await getSpecificMeasurementResult(
                    userprofileCtx.userprofile.id, 
                    title, 
                    assignment_number
                );
                if (specificAssignmentImages.length === 0){
                    console.log(`failed to fetch or no images are present in the database`)
                    setIsFetched(false)
                    setIsLoading(false)
                    setChartAvailable(false)
                    return 
                }
                setDataArrayLength(Array.from({ length: specificAssignmentImages.length }, (_, index) => index));
                chartCtx.setAllChartsDataHandler(specificAssignmentImages);
                console.log(`fetched`)
                setChartAvailable(true)
                setIsFetched(true)
                setIsLoading(false)
            }
            catch (error){
                console.log('no images yet')
                setIsFetched(false)
                setChartAvailable(false)
                setIsLoading(false)
            }
        }
        
        fetchData();
        
    }, [assignment_number, isFetched, chartLength])

    if (!isFocused){
        return null;
    }
    
    if (chartLength === 0){
        return null
    }

    function handleScroll(event) {
        const { contentOffset, layoutMeasurement } = event.nativeEvent;
        const index = Math.floor(contentOffset.x / layoutMeasurement.width);
        setCurrentIndex(index);
    }
    
    async function deleteImageHandler() {
        const currentChartData = chartCtx.chartData[currentIndex]
        //check if the current chart data is empty, such that the user can't delete an image that doesn't exist
        if (!currentChartData?.distance){
            Alert.alert('Produce data before deleting an image');
            return;
        }
        const recordNumber = currentChartData.recordNumber

        // delete image data from database for current user, title and assignment number 
        await deleteMeasurementResult(recordNumber)
            .then(() => {
                console.log(`deleted image with record_number: ${recordNumber}`);
                chartCtx.setChartData(chartCtx.chartData.filter(
                    (data) => data.recordNumber !== recordNumber
                ));
                // chartCtx.setAllChartsDataHandler(filteredData);
                console.log(`deleted image from local app wide state`)
            })
            .catch(error => {
                console.log(error);
            });
    }
    
    function assignmentRewardHandler(){
        console.log('pressed')
    }
        
    console.log(imageHeight)
    function renderImage({item}){    
        return (
            //width = imageWidth + marginContainer + margin QuestionTileContianer
            <Animated.View style={[styles.image, {height: imageHeight, width: 390}]}> 
                <BlurView style={[styles.graphContainer]} intensity={7}>
                    <ChartDisplay 
                        chartData = {item}
                        chartToggle = {chartCtx.chartToggle}
                        trueCount = {chartCtx.trueCount}
                        finalPlot = {true}
                        displayChart = {460}
                    />
                </BlurView>
            </Animated.View>
        )
    }

    return (
        <>
      {isLoading ? (
        <LoadingChat size="large" color={ColorsBlue.blue900} />
      ) : (
        <>
        {chartAvailable && 
        <>
            <AssignmentOptionsBar 
            midIcon = 'trash-can-outline'
            rightIcon = 'gold'
            midIconHandler = {deleteImageHandler}
            rightIconHandler = {assignmentRewardHandler}
            text = {tokens}
            />
                <Animated.View style={{ marginBottom: keyboardHeight}}>
                    <View style={[styles.imageContainer]}>
                        <>

                        {isFetched && 
                        <>
                        <FlatList 
                            data={chartCtx.chartData} //order chart data based on time stamp .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            keyExtractor={(item, index) => index}
                            renderItem={renderImage}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled
                            onScroll={handleScroll}
                        />  
                        <BlurView intensity={7} style = {{alignItems: 'center',}}>
                            <FlatList
                            data={dataArrayLength}
                            keyExtractor={(item, index) => index}
                            renderItem = {({item, index}) => (
                                <View style = {{marginBottom: 5}}>
                                    <Icon 
                                    icon = {index === currentIndex ? "ellipse-sharp" : "ellipse-outline"}
                                    color = {index === currentIndex ? ColorsLighterGold.gold400: ColorsTile.blue200}
                                    size = {30} 
                                    />
                                </View>
                            )}
                            horizontal
                            />
                        </BlurView>
                        <View style={styles.border}/>
                        </>
                        }
                        </>
                    </View>
                </Animated.View>
        </>
        }
        </>
      )}
        </>
    
    )
}

export default ImageContainer





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
    border: {
        borderBottomColor: `rgba(77, 77, 77, 0.5)`,
        borderBottomWidth: 0.6,
        shadowColor: `rgba(33, 33, 33`,
        shadowOffset: {height: 1, width: 0},
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 1,
    },
})