import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react"
import { getLatestMeasurementResult } from "../hooks/measurement_results";
import { SocketContext } from "./socket-context";
import { UserProfileContext } from "./userProfile-context";
import CircularBuffer from "../algorithms/CircularBuffer";
import { AssignmentContext } from "./assignment-context";
import {Alert} from 'react-native'

export const ChartContext = createContext({
    chartData: {},
    finalChartData: {},
    chartToggle: {},
    trueCount: null,
    setTrueCount: (data) => {},
    setChartData: (data) => {},
    setChartDataHandler: (data) => {},
    setFinalChartData: (data) => {},
    setChartToggleHandler: () => {},
    setChartIndividualDataHandler: () => {},
    setAllChartsDataHandler: (newChartData) => {},
    emptyChartData: () => {},
})

function ChartContextProvider({children}) {
    const socketCtx = useContext(SocketContext);

    const [chartToggle, setChartToggle] = useState({
        "s_t": true,
        "v_t": false,
        "p_t": false,
        "u_t": false,
        "i_t": false,   
        // "time": true, //always true
    });

    useEffect(() => {
        if (!socketCtx.power){
            emptyChartData();
        }
    },[socketCtx.power])


    const [trueCount, setTrueCount] = useState(Object.values(chartToggle).filter(value => value === true).length);

    const bufferSize = 600;

    const [finalChartData, setFinalChartData] = useState({
        distance_time: [[], [], [], []],
        velocity_time: [[], [], [], []],
        power_time: [],
        voltage_time: [],
        current_time: [],
        motorNumber: [],
        recordNumber: 0,
    });


    const [chartData, setChartData] = useState({
        distance_time: [[], [], [], []],
        velocity_time: [[], [], [], []],
        power_time: [],
        voltage_time: [],
        current_time: [],
        motorNumber: [],
        recordNumber: 0,
    });

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
    
        // console.log('newData', newChartData)
        if (newChartData === undefined){
            emptyFinalChartData();
            return
        };

        // Directly set the new chart data without using prevState
        setFinalChartData(newChartData.map((chartData, idx) => {
            if (!chartData) {
                return {
                    distance_time: [[], [], [], []],
                    velocity_time: [[], [], [], []],
                    power_time: [],
                    voltage_time: [],
                    current_time: [],
                    motorNumber: [],
                    recordNumber: 0,
                };
            }
            if (chartData.distance_time){
                return {
                    distance_time: chartData.distance_time, 
                    velocity_time: chartData.velocity_time,
                    motorNumber: chartData.motor_number || [],
                    recordNumber: chartData.record_number || 0,
                };
            }
            if (chartData.voltage_array){
                return {
                    distance_time: [[], [], [], []],
                    velocity_time: [[], [], [], []],
                    power_time: chartData.power_array.map((val, i) => ({time: chartData.time_array[i], value: val})),
                    voltage_time: chartData.voltage_array.map((val, i) => ({time: chartData.time_array[i], value: val})),
                    current_time: chartData.current_array.map((val, i) => ({time: chartData.time_array[i], value: val})),
                    motorNumber: chartData.motor_number || [],
                    recordNumber: chartData.record_number || 0,
                };
            }
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
        setChartData(prevState => {
            // if power is off or recordNumber is zero, reset the state
            if (!socketCtx.power) {
                console.log('cleared chart data')
                return {
                    distance_time: [[], [], [], []],
                    velocity_time: [[], [], [], []],
                    power_time: [],
                    voltage_time: [],
                    current_time: [],
                    motorNumber: [],
                    recordNumber: 0,
                };
            }
    
            // If new data arrives and it has 'distance' or 'voltage_array' we update the state
            if (newDataArray.distance_time || newDataArray.voltage_array) {
                // check if buffer size has reached
                const hasReachedBufferSize = (newDataArray.distance_time && newDataArray.distance_time[0].length === bufferSize)
                    || (newDataArray.voltage_array && newDataArray.power_array.length === bufferSize);
                
                // stop measurement if buffer size is reached
                if (hasReachedBufferSize) {
                    socketCtx.setPower((prevPower) => !prevPower);
                    socketCtx.socket.current.emit('driveCommand', { command: '\x03' });
                    Alert.alert('Meeting Gestopt!', 'Je hebt je maximale meettijd bereikt.')
                    return;
                }
    
                return {
                    distance_time: newDataArray.distance_time || [[], [], [], []],
                    velocity_time: newDataArray.velocity_time || [[], [], [], []],
                    power_time: newDataArray.power_array || [],
                    voltage_time: newDataArray.voltage_array || [],
                    current_time: newDataArray.current_array || [],
                    motorNumber: newDataArray.motor_number || [],
                    recordNumber: newDataArray.record_number || 0,
                };
            }
        });
    }, [socketCtx.power]);

    function emptyChartData(){
        setChartData({
            distance_time: [[], [], [], []],
            velocity_time: [[], [], [], []],
            power_time: [],
            voltage_time: [],
            current_time: [],
            motorNumber: [],
            recordNumber: 0,
        });
    }
    
    function emptyFinalChartData(){
        setFinalChartData({
            distance_time: [[], [], [], []],
            velocity_time: [[], [], [], []],
            power_time: [],
            voltage_time: [],
            current_time: [],
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
        setChartDataHandler,
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