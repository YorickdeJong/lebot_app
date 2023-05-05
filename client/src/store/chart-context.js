import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { getLatestMeasurementResult } from "../hooks/measurement_results";
import { SocketContext } from "./socket-context";
import { UserProfileContext } from "./userProfile-context";
import CircularBuffer from "../algorithms/CircularBuffer";
import { AssignmentContext } from "./assignment-context";

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
        "time": true, //always true
    });

    const [trueCount, setTrueCount] = useState(Object.values(chartToggle).filter(value => value === true).length - 1);

    const bufferSize = 300;

    const timeBuffer = new CircularBuffer(bufferSize + 1); // 81 elements for time
    const voltageBuffer = new CircularBuffer(bufferSize + 1);
    const currentBuffer = new CircularBuffer(bufferSize + 1);
    const powerBuffer = new CircularBuffer(bufferSize + 1);

    const distanceBuffer = Array(4) // 4 is the number of motors
      .fill(null)
      .map(() => new CircularBuffer(bufferSize + 1)); // 81 elements for distance
    
    const speedBuffer = Array(4) // 4 is the number of motors
      .fill(null)
      .map(() => new CircularBuffer(bufferSize)); // 80 elements for speed


    const [finalChartData, setFinalChartData] = useState({
        distance: [[], [], [], []],
        speed: [[], [], [], []],
        power: [],
        voltage: [],
        current: [],
        time: [],
        motorNumber: [],
        recordNumber: 0,
    });


    const [chartData, setChartData] = useState({
        distance: [[], [], [], []],
        speed: [[], [], [], []],
        power: [],
        voltage: [],
        current: [],
        time: [],
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
                    power: [],
                    voltage: [],
                    current: [],
                    time: [],
                    motorNumber: [],
                    recordNumber: 0,
                };
            }
            if (chartData.distance){
                setChartData
                return {
                    distance: chartData.distance || [[], [], [], []],
                    speed: chartData.velocity || [[], [], [], []],
                    time: chartData.time || [],
                    motorNumber: chartData.motor_number || [],
                    recordNumber: chartData.record_number || 0,
                };
            }
            if (chartData.voltage_array){
                return {
                    distance: [[], [], [], []],
                    speed: [[], [], [], []],
                    power: chartData.power_array || [],
                    voltage: chartData.voltage_array || [],
                    current: chartData.current_array || [],
                    time: chartData.time_array || [],
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
            console.log('prevState', prevState)
            console.log('newDataArray', newDataArray)

            if (prevState.recordNumber === 0) {
                if (!socketCtx.power) {
                    console.log('cleared chart data')
                    return {
                        distance: [[], [], [], []],
                        speed: [[], [], [], []],
                        power: [],
                        voltage: [],
                        current: [],
                        time: [],
                        motorNumber: [],
                        recordNumber: 0,
                    };
                }
                // Initialize circular buffers and adds check if it exists
                
                //Movement measurement case
                if (newDataArray.distance){
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

                //Voltage Measurement Case
                if (newDataArray.voltage_array){
                    console.log('check Voltage')
                    newDataArray.voltage_array.forEach(point => voltageBuffer.push(point));
                    newDataArray.current_array.forEach(point => currentBuffer.push(point));
                    newDataArray.power_array.forEach(point => powerBuffer.push(point));
                    newDataArray.time_array.forEach(point => timeBuffer.push(point));

                    return {
                        distance: [[], [], [], []],
                        speed: [[], [], [], []],
                        power: powerBuffer.toArray(),
                        voltage: voltageBuffer.toArray(),
                        current: currentBuffer.toArray(),
                        time: timeBuffer.toArray(),
                        motorNumber: newDataArray.motor_number,
                        recordNumber: newDataArray.record_number,
                    };
                }
            }
            if (newDataArray.distance){
                return {
                    distance: prevState.distance.map((distances, idx) => { //add conditional check here
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
            }
            if (newDataArray.voltage_array){
                console.log('check SET VOLTAGE')
                return {
                    distance: [[], [], [], []],
                    speed: [[], [], [], []],
                    power: (() => {
                        const newData = newDataArray.power_array;
                        const newElements = newData.slice(prevState.power.length);
                        newElements.forEach(point => powerBuffer.push(point));
                        return powerBuffer.toArray();
                    })(),
                    voltage: (() => {
                        const newData = newDataArray.voltage_array;
                        const newElements = newData.slice(prevState.voltage.length);
                        newElements.forEach(point => voltageBuffer.push(point));
                        return voltageBuffer.toArray();
                    })(),
                    current: (() => {
                        const newData = newDataArray.current_array;
                        const newElements = newData.slice(prevState.current.length);
                        newElements.forEach(point => currentBuffer.push(point));
                        return currentBuffer.toArray();
                    })(),
                    time: (() => {
                        const newData = newDataArray.time_array;
                        const newElements = newData.slice(prevState.time.length);
                        newElements.forEach(point => timeBuffer.push(point));
                        return timeBuffer.toArray();
                    })(),
                    motorNumber: prevState.motorNumber,
                    recordNumber: prevState.recordNumber,
                };
            }
        });
    }, [socketCtx.power]);

    function emptyChartData(){
        console.log('emptied chart data')
        setChartData({
            distance: [[], [], [], []],
            speed: [[], [], [], []],
            power: [],
            voltage: [],
            current: [],
            time: [],
            motorNumber: [],
            recordNumber: 0,
        });
    }
    
    function emptyFinalChartData(){
        setFinalChartData({
            distance: [[], [], [], []],
            speed: [[], [], [], []],
            power: [],
            voltage: [],
            current: [],
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