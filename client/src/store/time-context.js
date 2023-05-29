import { createContext, useContext, useEffect, useState } from 'react';
import { ipAddressComputer } from '../data/ipaddresses.data';
import io from 'socket.io-client';
import { updateTimeLesson } from '../hooks/time-lessons.hook';

export const TimeContext = createContext();

export const useSocketTimeLessons = () => {
    return useContext(TimeContext);
  };

export const TimeContextProvider = ({ children, namespace }) => {
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [socket, setSocket] = useState(null);
    const SOCKET_SERVER_URL = ipAddressComputer + namespace;
    const [timeData, setTimeData] = useState([]);
    const [changedTimeData, setChangedTimeData] = useState(false);
    const [activeTimers, setActiveTimers] = useState({});
    
    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL, { 
            autoConnect: true,     
            reconnectionAttempts: 10,
            timeout: 10000 });
        setSocket(newSocket);
    
        // Add your listeners here
        newSocket.on('connect_error', (error) => {
            console.error('Connection error time Context:', error);
        });
    
        newSocket.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
            if (reason === 'io server disconnect') {
                newSocket.connect();
            }
        });
    
        newSocket.on('reconnect', (attemptNumber) => {
            console.log('Reconnected after', attemptNumber, 'attempts');
        });
    
        newSocket.on('reconnect_failed', () => {
            console.error('Reconnection failed');
        });
    
        return () => {
            newSocket.close();
        };
    }, []);


    function globalClock(specificLesson) {
        const duration = calculateTimeLeft(specificLesson);
        const class_id = specificLesson.class_id;

        if (specificLesson.duration === 10000) {
            setActiveTimers((prevActiveTimers) => ({
                ...prevActiveTimers,
                [class_id]: {
                    timer: timer,
                    lesson_number: specificLesson.lesson_number,
                },
            }));
        }
        // Clear any existing timer for this class_id
        if (activeTimers[class_id]) {
            clearTimeout(activeTimers[class_id]);
        }
    
        // Set up the timer to update the state when it's done
        const timer = setTimeout(async () => {
            // Update activeTimers to remove the completed timer
            setActiveTimers((prevActiveTimers) => {
                const updatedTimers = { ...prevActiveTimers };
                delete updatedTimers[class_id];
                return updatedTimers;
            });
            try {
                const updatedLesson = await updateTimeLesson(
                    specificLesson.id,
                    class_id,
                    specificLesson.duration,
                    specificLesson.school_id,
                    false, // Set active to false
                    specificLesson.lesson_number
                );
            } 
            catch (error) {
                console.error('Failed to update time lesson:', error);
            }
            

        }, duration * 1000);
    
        setActiveTimers((prevActiveTimers) => ({
            ...prevActiveTimers,
            [class_id]: {
                timer: timer,
                lesson_number: specificLesson.lesson_number,
            },
        }));
    }

    function setTimeDataHandler(data_time) {
        // Takes in an object data_time with class_id, lesson_number, and data
        setTimeData((prevTimeData) => {
            // Check if an object with the same class_id and lesson_number exists in prevTimeData
            const index = prevTimeData.findIndex(
                (item) =>
                    item.class_id === data_time.class_id && item.lesson_number === data_time.lesson_number
            );
    
            let updatedTimeData;
    
            // If an object with the same class_id and lesson_number is found, update it
            if (index !== -1) {
                updatedTimeData = [...prevTimeData];
                updatedTimeData[index] = data_time;
            } else {
                // If no matching object is found, add the new data_time object
                updatedTimeData = [...prevTimeData, data_time];
            }

            if (updatedTimeData[0].length === 0) {
                console.log('length is 0 of updatedTimeData')
                return {
                    "active": false,
                    "class_id": -1,
                    "created_at": '',
                    "duration": -1,
                    "id": -1,
                    "lesson_number": -1,
                    "school_id": -1,
                };
            }

            updatedTimeData.map((item) => {
                return item.data.map(timeItem => {
                    if (timeItem.active === true){
                        globalClock(timeItem);
                    }
                })
            })
    
            return updatedTimeData;
        });
    }
    
    function clearTimeDataHandler(){
        // Clear all active timers
        for (const timerObj of Object.values(activeTimers)) {
            clearTimeout(timerObj.timer);
        }
        setTimeData([]);
    }

    function filterActiveTimers(class_id) {
        const timerObj = activeTimers[class_id];
        return timerObj ? timerObj.lesson_number : null;
    }

    function filterSpecificLesson(class_id) {
        if (timeData.length === 0) {
            console.log('length is 0 of timedata')
            return false;
        }
        return timeData[0].data.find((item) => {
            if (item.class_id === class_id && item.active === true) {
                return item;
            }
            return false;
        });
    }

    function filterTimeDataClass(class_id) {
        return timeData[0].data.find((item) => {
            if (item.class_id === class_id) {
                return item;
            }
            return false;
        });
    }

    const calculateTimeLeft = (currentActiveLessonData) => {
        if (currentActiveLessonData) {
          const createdAt = new Date(currentActiveLessonData.created_at);
          const durationInMilliseconds = currentActiveLessonData.duration * 60 * 1000;
          const endTime = createdAt.getTime() + durationInMilliseconds;
          const timeLeftInMilliseconds = endTime - Date.now();
          const timeLeftInSeconds = timeLeftInMilliseconds / 1000;
          return timeLeftInSeconds;
        } 
        else {
          return 0;
        }
    };


    const formatTimeLeft = (timeLeftInSeconds) => {
        const minutes = Math.floor(timeLeftInSeconds / 60);
        const seconds = Math.floor(timeLeftInSeconds % 60);
        return `${minutes} min ${seconds} sec`;
    };

    function toggleTimeModal() {
        setShowTimeModal(!showTimeModal);
    }

    const values = {
        socket, 
        showTimeModal,
        timeData,
        changedTimeData,
        filterActiveTimers,
        filterTimeDataClass,
        setChangedTimeData,
        setTimeDataHandler,
        toggleTimeModal,
        filterSpecificLesson,
        calculateTimeLeft,
        formatTimeLeft,
        clearTimeDataHandler
    }
    return <TimeContext.Provider value={values}>{children}</TimeContext.Provider>;
};