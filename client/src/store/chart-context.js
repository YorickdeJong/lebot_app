import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { getLatestMeasurementResult } from "../hooks/measurement_results";
import { SocketContext } from "./socket-context";
import { UserProfileContext } from "./userProfile-context";

export const ChartContext = createContext({
    chartData: {},
    chartToggle: {},
    trueCount: null,
    setTrueCount: (data) => {},
    setChartData: (data) => {},
    setChartToggleHandler: () => {},
    setChartIndividualDataHandler: () => {},
    setAllChartsDataHandler: (newChartData) => {},
})

function ChartContextProvider({children}) {
    const userprofileCtx = useContext(UserProfileContext); 
    const socketCtx = useContext(SocketContext);
    const [prevMeasurementResultLength, setPrevMeasurementResultLength] = useState(null);

    const [chartData, setChartData] = useState({
        distance: [[], [], [], []],
        speed: [[], [], [], []],
        force: [[], [], [], []],
        energy: [[], [], [], []],
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
        if(socketCtx.power && socketCtx.isMeasurementStarted){
            
            let prevResults = 0
            emptyChartData(); //empty chart data before starting

            const interval = setInterval(async () => {
                //fetch when power is turned on
                    const measurementResults = await getLatestMeasurementResult(userprofileCtx.userprofile.id); //TODO CHANGE TO DIFFERENT FETCH
                    //only set chartDataHandler if measurement results lengths are unequal
                    if (prevResults !== measurementResults.distance[0].length){
                        setChartDataHandler(measurementResults)
                        prevResults = measurementResults.distance[0].length;
                    }
            }, 100); // update the chart every second

            return () => clearInterval(interval);
        }   
        else {
            emptyChartData();
            socketCtx.setIsMeasurementStarted(false);
            setPrevMeasurementResultLength(0);
        }
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
            emptyChartData();
            return
        };


        // Directly set the new chart data without using prevState
        setChartData(newChartData.map((chartData, idx) => {
            if (!chartData) {
                return {
                    distance: [[], [], [], []],
                    speed: [[], [], [], []],
                    force: [[], [], [], []],
                    energy: [[], [], [], []],
                    time: [],
                    motorNumber: [],
                    recordNumber: 0,
                };
            }

            return {
                distance: chartData.distance || [[], [], [], []],
                speed: chartData.velocity || [[], [], [], []],
                force: chartData.force || [[], [], [], []],
                energy: chartData.energy || [[], [], [], []],
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
            //handle the case where prevState has not yet been set
            if (prevState[0] === undefined) {
                return {
                    distance: newDataArray.distance, 
                    speed: newDataArray.velocity, 
                    force: newDataArray.force, 
                    energy: newDataArray.energy,
                    time: newDataArray.time, 
                    motorNumber: newDataArray.motor_number,
                    recordNumber: newDataArray.record_number, 
            };
            }
            return prevState.map((prevStateItem, idx) => {
                const newData = newDataArray[idx];
                if (!newData) {
                    return prevStateItem;
                }

                const lastIndexDistance = prevStateItem.distance.length - 1;
                const lastIndexVelocity = prevStateItem.speed.length - 1;
                const lastIndexForce = prevStateItem.force.length - 1;
                const lastIndexEnergy = prevStateItem.energy.length - 1;

                const hasNewDataPoints = newData.distance.length !== lastIndexDistance;
                if (!hasNewDataPoints) {
                    return prevStateItem;
                }

                const latestTimestamp = newData.time[newData.time.length - 1];
                
                //Filter 1D array
                const filterOldData = (arr, timeArr) =>
                    arr.filter((_, index) => latestTimestamp - timeArr[index] <= 60);

                //fitler 2D array
                const filterOldData2D = (arr2D, timeArr) =>
                    arr2D.map(arr => arr.filter((_, index) => latestTimestamp - timeArr[index] <= 60));


                const combinedData = {
                    distance: [
                        ...filterOldData2D(prevStateItem.distance, prevStateItem.time),
                        ...newData.distance.slice(lastIndexDistance),
                    ],
                    speed: [
                        ...filterOldData2D(prevStateItem.speed, prevStateItem.time),
                        ...newData.velocity.slice(lastIndexVelocity),
                    ],
                    force: [
                        ...filterOldData2D(prevStateItem.force, prevStateItem.time),
                        ...newData.force.slice(lastIndexForce),
                    ],
                    energy: [
                        ...filterOldData2D(prevStateItem.energy, prevStateItem.time),
                        ...newData.energy.slice(lastIndexEnergy),
                    ],
                    time: [
                        ...filterOldData(prevStateItem.time, prevStateItem.time),
                        ...newData.time.slice(lastIndexDistance),
                    ],
                };

                return combinedData;
            });
        });
    }, []);

    function emptyChartData(){
        setChartData({
                distance: [[], [], [], []],
                speed: [[], [], [], []],
                force: [[], [], [], []],
                energy: [[], [], [], []],
                time: [],
                motorNumber: [],
                recordNumber: 0,
        });
    }
    
    //
    const values = {
        chartData,
        chartToggle,
        trueCount,
        setTrueCount,
        setChartToggleHandler,
        setChartIndividualDataHandler,
        setAllChartsDataHandler,
        setChartData
    }
 
    return (
        <ChartContext.Provider value={values}>
            {children}
        </ChartContext.Provider>
    )
}

export default ChartContextProvider