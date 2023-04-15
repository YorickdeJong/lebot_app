import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { getLatestMeasurementResult } from "../hooks/measurement_results";
import { SocketContext } from "./socket-context";
import { UserProfileContext } from "./userProfile-context";
import CircularBuffer from "../algorithms/CircularBuffer";

export const ChartContext = createContext({
    chartData: {},
    finalChartData: {},
    chartToggle: {},
    trueCount: null,
    setTrueCount: (data) => {},
    setChartData: (data) => {},
    setFinalChartData: (data) => {},
    setChartToggleHandler: () => {},
    setChartIndividualDataHandler: () => {},
    setAllChartsDataHandler: (newChartData) => {},
    emptyChartData: () => {},
})

function ChartContextProvider({children}) {
    const userprofileCtx = useContext(UserProfileContext); 
    const socketCtx = useContext(SocketContext);
    const [prevMeasurementResultLength, setPrevMeasurementResultLength] = useState(null);
    const [isCurrentMeasurement, setIsCurrentMeasurement] = useState(false);

    const bufferSize = 300;

    const timeBuffer = new CircularBuffer(bufferSize + 1); // 81 elements for time

    const distanceBuffer = Array(4) // 4 is the number of motors
      .fill(null)
      .map(() => new CircularBuffer(bufferSize + 1)); // 81 elements for distance
    
    const speedBuffer = Array(4) // 4 is the number of motors
      .fill(null)
      .map(() => new CircularBuffer(bufferSize)); // 80 elements for speed


    const [finalChartData, setFinalChartData] = useState({
        distance: [[], [], [], []],
        speed: [[], [], [], []],
        time: [],
        motorNumber: [],
        recordNumber: 0,
    });


    const [chartData, setChartData] = useState({
        distance: [[], [], [], []],
        speed: [[], [], [], []],
        time: [],
        motorNumber: [],
        recordNumber: 0,
    });

    const [chartToggle, setChartToggle] = useState({
        "s_t": true,
        "v_t": false,
        "F_s": false,
        "E_t": false,
        "time": true, //always true
        "time_velocity": true, 
        "time_energy": true,
        "distance_force": true
    });

    const [trueCount, setTrueCount] = useState(Object.values(chartToggle).filter(value => value === true).length - 4);

    // Fetch the latest measurement result when the power is turned on and save it such that it can be plotted in the assignments/imageContainer
    useEffect(() => {
         //empty chart data before startingß
        if(socketCtx.power && socketCtx.isMeasurementStarted){
            let prevResults = 0
            let count = 0;
            const interval = setInterval(async () => {
                //fetch when power is turned on
                    const measurementResults = await getLatestMeasurementResult(userprofileCtx.userprofile.id); //TODO CHANGE TO DIFFERENT FETCH
                    count += 1;
                    //checks for prev data which doesn't belong to the current measurement
                    if (!isCurrentMeasurement){
                        if (count < 12 && measurementResults.velocity[0].length > 0){ //adjust count depending on measurement
                                console.log(`no data set`)
                                setIsCurrentMeasurement(true)
                                return
                        }
                    }

                    //check if velocity is not empty
                    if (measurementResults.velocity[0] === undefined){
                        console.log('velocity empty')
                        return
                    }
                    if (prevResults !== measurementResults.distance[0].length){
                        console.log(`executed`)
                        setChartDataHandler(measurementResults)
                        prevResults = measurementResults.distance[0].length;
                    }
            }, 100); // update the chart every second

            setIsCurrentMeasurement(false);
            return () => clearInterval(interval);
        }   
        else {
            emptyChartData();
            socketCtx.setIsMeasurementStarted(false);
            setPrevMeasurementResultLength(0);
        }
        emptyChartData();

    }, [socketCtx.power, socketCtx.isMeasurementStarted]);

    

    // select which charts to display
    function setChartToggleHandler(physicalQuantity) {
        setChartToggle(prevState => {
            return {
                ...prevState,
                [physicalQuantity]: !prevState[physicalQuantity]
            }
        })
    }

    //upon fetching, all charts are set for a certain user_id, assignment_number and title
    const setAllChartsDataHandler = useCallback((newChartData) => {
        if (newChartData === undefined){
            emptyFinalChartData();
            return
        };


        // Directly set the new chart data without using prevState
        setFinalChartData(newChartData.map((chartData, idx) => {
            if (!chartData) {
                return {
                    distance: [[], [], [], []],
                    speed: [[], [], [], []],
                    time: [],
                    motorNumber: [],
                    recordNumber: 0,
                };
            }

            return {
                distance: chartData.distance || [[], [], [], []],
                speed: chartData.velocity || [[], [], [], []],
                time: chartData.time || [],
                motorNumber: chartData.motor_number || [],
                recordNumber: chartData.record_number || 0,
            };
        }));
    }, []);


    //sets specific chart 
    function setChartIndividualDataHandler(physicalQuantity, data) {
        setChartData(prevState => {
            return {
                ...prevState,
                [physicalQuantity]: data
            }
        })
    }

    const setChartDataHandler = useCallback((newDataArray) => {
        setChartData((prevState) => {

            if (prevState.recordNumber === 0) {
                console.log(`executed 1`);

                // Initialize circular buffers
                newDataArray.distance.forEach((points, idx) => {
                    distanceBuffer[idx] = new CircularBuffer(bufferSize + 1);
                    points.forEach(point => distanceBuffer[idx].push(point));
                });

                newDataArray.velocity.forEach((points, idx) => {
                    speedBuffer[idx] = new CircularBuffer(bufferSize);
                    points.forEach(point => speedBuffer[idx].push(point));
                });

                newDataArray.time.forEach(point => timeBuffer.push(point));

                return {
                    distance: distanceBuffer.map(buffer => buffer.toArray()),
                    speed: speedBuffer.map(buffer => buffer.toArray()),
                    time: timeBuffer.toArray(),
                    motorNumber: newDataArray.motor_number,
                    recordNumber: newDataArray.record_number,
                };
            }
            console.log(`EXECUTED 2`);

            return {
                distance: prevState.distance.map((distances, idx) => {
                    const newData = newDataArray.distance[idx];
                    if (!newData) return distances;

                    const newElements = newData.slice(distances.length);
                    newElements.forEach(point => distanceBuffer[idx].push(point));
                    return distanceBuffer[idx].toArray();
                }),
                speed: prevState.speed.map((speeds, idx) => {
                    const newData = newDataArray.velocity[idx];
                    if (!newData) return speeds;

                    const newElements = newData.slice(speeds.length);
                    newElements.forEach(point => speedBuffer[idx].push(point));
                    return speedBuffer[idx].toArray();
                }),
                time: (() => {
                    const newData = newDataArray.time;
                    const newElements = newData.slice(prevState.time.length);
                    newElements.forEach(point => timeBuffer.push(point));
                    return timeBuffer.toArray();
                })(),
                motorNumber: prevState.motorNumber,
                recordNumber: prevState.recordNumber,
            };
        });
    }, []);

    function emptyChartData(){
        setChartData({
                distance: [[], [], [], []],
                speed: [[], [], [], []],
                time: [],
                motorNumber: [],
                recordNumber: 0,
        });
    }
    
    function emptyFinalChartData(){
        setFinalChartData({
                distance: [[], [], [], []],
                speed: [[], [], [], []],
                time: [],
                motorNumber: [],
                recordNumber: 0,
        });
    }


    //
    const values = {
        chartData,
        finalChartData,
        chartToggle,
        trueCount,
        setChartData,
        setFinalChartData,
        setTrueCount,
        setChartToggleHandler,
        setChartIndividualDataHandler,
        setAllChartsDataHandler,
        emptyChartData,
    }
 
    return (
        <ChartContext.Provider value={values}>
            {children}
        </ChartContext.Provider>
    )
}

export default ChartContextProvider