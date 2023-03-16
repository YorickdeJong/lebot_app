import { createContext, useContext, useEffect, useState } from "react"
import { getLatestMeasurementResult } from "../hooks/measurement_results";
import { SocketContext } from "./socket-context";
import { UserProfileContext } from "./userProfile-context";

export const ChartContext = createContext({
    chartData: {},
    chartToggle: {},
    trueCount: null,
    setChartToggleHandler: () => {},
    setChartIndividualDataHandler: () => {},
    setAllChartsDataHandler: () => {},
})

function ChartContextProvider({children}) {
    const userprofileCtx = useContext(UserProfileContext); 
    const socketCtx = useContext(SocketContext);

    const [chartData, setChartData] = useState({
        distance: [],
        speed: [],
        force: [],
        energy: [],
        time: [],
        timeVelocity:[],
        timeEnergy:[],
        distanceForce:[],
    });

    const [chartToggle, setChartToggle] = useState({
        "s_t": true,
        "v_t": false,
        "F_s": false,
        "E_t": false,
        "time": true, //always true
        "timeVelocity": true,
        "timeEnergy": true,
        "distanceForce": true,
    });

    const [trueCount, setTrueCount] = useState(Object.values(chartToggle).filter(value => value === true).length - 4);

    useEffect(() => {
        setTrueCount(Object.values(chartToggle).filter(value => value === true).length - 4); //minus 1 here since time is always true
    }, [chartToggle])

    useEffect(() => {
        console.log(`CHECK CHECK`)
        console.log(`data length: ${chartData.distance.length}`)
        if(socketCtx.power && socketCtx.isMeasurementStarted){
        const interval = setInterval(async () => {
            //fetch when power is turned on
                //wait 20 seconds untill script has started -> problem data has already been gathered then maybe 
                const measurementResults = await getLatestMeasurementResult(userprofileCtx.userprofile.id)
                console.log(`CHECK CHECK`)
                console.log(`measurement resukts ${measurementResults}`)

                setChartDataHandler(measurementResults)
            }, 2000); // update the chart every second
            
            return () => clearInterval(interval);
        }   
        else {
            setChartData({
                distance: [],
                speed: [],
                force: [],
                energy: [],
                time: [],
                timeVelocity:[],
                timeEnergy:[],
                distanceForce:[],
            })
            socketCtx.setIsMeasurementStarted(false);
        }
    }, [socketCtx.power, socketCtx.isMeasurementStarted]);


    useEffect(() => {
        // console.log(chartData)
    }, [chartData])

    function setChartToggleHandler(physicalQuantity) {
        setChartToggle(prevState => {
            return {
                ...prevState,
                [physicalQuantity]: !prevState[physicalQuantity]
            }
        })
    }

    function setAllChartsDataHandler(data) {
        setChartData({})
    }


    function setChartIndividualDataHandler(physicalQuantity, data) {
        setChartData(prevState => {
            return {
                ...prevState,
                [physicalQuantity]: data
            }
        })
    }
 
    function setChartDataHandler(newData) {
        setChartData(prevState => {
            return {
                ...prevState,
                distance: [...prevState.distance, ...newData.distance],
                time: [...prevState.time, ...newData.time],
                speed: [...prevState.speed, ...newData.velocity],
                force: [...prevState.force, ...newData.force],
                energy: [...prevState.energy, ...newData.energy],
                timeVelocity: [...prevState.timeVelocity, ...newData.time_velocity],
                timeEnergy: [...prevState.timeEnergy, ...newData.time_energy],
                distanceForce: [...prevState.distanceForce, ...newData.distance_force]
            }
        });
    }

    const values = {
        chartData,
        chartToggle,
        trueCount,
        setChartToggleHandler,
        setChartIndividualDataHandler,
        setAllChartsDataHandler,
    }
 
    return (
        <ChartContext.Provider value={values}>
            {children}
        </ChartContext.Provider>
    )
}

export default ChartContextProvider