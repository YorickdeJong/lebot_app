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
        console.log('power', socketCtx.power)
        if (!socketCtx.power){
            emptyChartData();
            voltageBuffer.current.clear();
            currentBuffer.current.clear();
            powerBuffer.current.clear();
            distanceBuffer.current.forEach(buffer => buffer.clear());
            velocityBuffer.current.forEach(buffer => buffer.clear());
        }
    },[socketCtx.power])


    const [trueCount, setTrueCount] = useState(Object.values(chartToggle).filter(value => value === true).length);

    const bufferSize = 600;

    const voltageBuffer = useRef(new CircularBuffer(bufferSize + 1));
    const currentBuffer = useRef(new CircularBuffer(bufferSize + 1));
    const powerBuffer = useRef(new CircularBuffer(bufferSize + 1));
    
    const distanceBuffer = useRef(
      Array(4) // 4 is the number of motors
        .fill(null)
        .map(() => new CircularBuffer(bufferSize + 1))
    );
    
    const velocityBuffer = useRef(
      Array(4) // 4 is the number of motors
        .fill(null)
        .map(() => new CircularBuffer(bufferSize))
    );

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
            if (chartData.distance){
                return {
                    distance_time: chartData.distance.map((arr, idx) => arr.map((val, i) => ({time: chartData.time[i], value: val}))),
                    velocity_time: chartData.velocity.map((arr, idx) => arr.map((val, i) => ({time: chartData.time[i], value: val}))),
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
        setChartData((prevState) => {
            if (prevState.recordNumber === 0) {
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


                //Movement measurement case
                if (newDataArray.distance){
                    newDataArray.distance.forEach((points, idx) => {
                        const latestPoint = points[points.length - 1];
                        const latestTime = newDataArray.time[newDataArray.time.length - 1];
                        distanceBuffer.current[idx].push({time: latestTime, value: latestPoint});
                    });
                    
                    newDataArray.velocity.forEach((points, idx) => {
                        const latestPoint = points[points.length - 1];
                        const latestTime = newDataArray.time[newDataArray.time.length - 1];
                        velocityBuffer.current[idx].push({time: latestTime, value: latestPoint});
                    });
    
                    return {
                        distance_time: distanceBuffer.current.map(buffer => buffer.toArray()),
                        velocity_time: velocityBuffer.current.map(buffer => buffer.toArray()),
                        motorNumber: newDataArray.motor_number,
                        recordNumber: newDataArray.record_number,
                    };
                }
    
                //Voltage Measurement Case
                if (newDataArray.voltage_array){
                    const latestVoltage = newDataArray.voltage_array[newDataArray.voltage_array.length - 1];
                    const latestCurrent = newDataArray.current_array[newDataArray.current_array.length - 1];
                    const latestPower = newDataArray.power_array[newDataArray.power_array.length - 1];
                    const latestTime = newDataArray.time_array[newDataArray.time_array.length - 1];
                    voltageBuffer.current.push({time: latestTime, value: latestVoltage});
                    currentBuffer.current.push({time: latestTime, value: latestCurrent});
                    powerBuffer.current.push({time: latestTime, value: latestPower});
    
                    return {
                        distance_time: [[], [], [], []],
                        velocity_time: [[], [], [], []],
                        power_time: powerBuffer.current.toArray(),
                        voltage_time: voltageBuffer.current.toArray(),
                        current_time: currentBuffer.current.toArray(),
                        motorNumber: newDataArray.motor_number,
                        recordNumber: newDataArray.record_number,
                    };
                }
            }
            //stop measuremetn after buffersize is reached
            
            
            if (newDataArray.distance){
                if (newDataArray.distance[0].length === bufferSize ) { 
                    socketCtx.setPower((prevPower) => !prevPower);
                    socketCtx.socket.current.emit('driveCommand', { command: '\x03' });
                    Alert.alert('Meeting Gestopt!', 'Je hebt je maximale meettijd bereikt.')
                    return;
                }
                return {
                    distance_time: prevState.distance_time.map((distances_times, idx) => { 
                        const newData = newDataArray.distance[idx];
                        if (!newData) return distances_times;
            
                        const latestPoint = newData[newData.length - 1];
                        const latestTime = newDataArray.time[newDataArray.time.length - 1];
                        distanceBuffer.current[idx].push({time: latestTime, value: latestPoint});
                        
                        return distanceBuffer.current[idx].toArray();
                    }),
                    velocity_time: prevState.velocity_time.map((velocities_time, idx) => {
                        const newData = newDataArray.velocity[idx];
                        if (!newData) return velocities_time;
            
                        const latestPoint = newData[newData.length - 1];
                        const latestTime = newDataArray.time[newDataArray.time.length - 1];
                        velocityBuffer.current[idx].push({time: latestTime, value: latestPoint});
                        
                        return velocityBuffer.current[idx].toArray();
                    }),
                    motorNumber: prevState.motorNumber,
                    recordNumber: prevState.recordNumber,
                };
            }
            if (newDataArray.voltage_array){
                if (newDataArray.power_array.length === bufferSize) {
                    socketCtx.setPower(false);
                    socketCtx.socket.current.emit('driveCommand', { command: '\x03' });
                    Alert.alert('Meeting Gestopt!', 'Je hebt je maximale meettijd bereikt.')
                    return;
                }
                const latestVoltage = newDataArray.voltage_array[newDataArray.voltage_array.length - 1];
                const latestCurrent = newDataArray.current_array[newDataArray.current_array.length - 1];
                const latestPower = newDataArray.power_array[newDataArray.power_array.length - 1];
                const latestTime = newDataArray.time_array[newDataArray.time_array.length - 1];
                voltageBuffer.current.push({time: latestTime, value: latestVoltage});
                currentBuffer.current.push({time: latestTime, value: latestCurrent});
                powerBuffer.current.push({time: latestTime, value: latestPower});
            
                return {
                    distance_time: [[], [], [], []],
                    velocity_time: [[], [], [], []],
                    power_time: powerBuffer.current.toArray(),
                    voltage_time: voltageBuffer.current.toArray(),
                    current_time: currentBuffer.current.toArray(),
                    motorNumber: prevState.motorNumber,
                    recordNumber: prevState.recordNumber,
                };
            }
            });
        }, [socketCtx.power]);

    function emptyChartData(){
        console.log('emptied chart data')
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