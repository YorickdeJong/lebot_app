import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { changeUserCarDetails } from "../hooks/carDetails";
import { UserProfileContext } from "./userProfile-context";

//--------------------- DEFINES STATEWIDE PROPERTIES FOR CAR UPGRADES -------------------------//

export const CarContext = createContext({
    carProperties: {
        speed: 20,
        acceleration: 0,
        wheels: 0,
        handling: 0,
        money: 700,
    },
    upgradeLog: {
        Speed: [false, false, false, false, false],
        Acc: [false, false, false, false, false],
        Handling:  [false, false, false, false, false],
        Wheels: [false, false, false, false, false],
    },

    editSpeed: (speedIncrease) => {},
    editAcceleration: (accelerationIncrease) => {},
    editHandling: (wheelsIncrease) => {},
    editWheels: (handlingIncrease) => {},
    editMoney: (moneyIncreasIncreasee) => {},
    editUnlock: (upgradeType, id) => {},
    initializeCarDetails: (carDetails) => {},

})


function CarContextProvider({children}) {
    const userCtx = useContext(UserProfileContext)
    const [upgradeLog, setUpgradeLog] = useState({
        Speed: [false, false, false, false, false],
        Acc: [false, false, false, false, false],
        Handling:  [false, false, false, false, false],
        Wheels: [false, false, false, false, false],
    })

    const [carProperties, setCarProperties] = useState({
        money: 7000,
        speed: 20,
        acceleration: 0,
        wheels: 0,
        handling: 0,

    })

    useEffect(() => {
        loadCarDataFromStorage();
         loadCarUnlockFromStorage();
    }, []);


    async function loadCarDataFromStorage() {
        try {
            const carJSON = await AsyncStorage.getItem("car");
            if (carJSON !== null) {
                setCarProperties(JSON.parse(carJSON));
            }
        } 
        catch (error) {
            console.error("Error loading car data from storage:", error);
        }
    }

    async function loadCarInStorage(carData) {
        try {
            const carJSON = JSON.stringify(carData);
            await AsyncStorage.setItem("car", carJSON);
            console.log('saved car data in storage')
        }
        catch (error){
            console.error("Error saving car data to storage:", error);
        }
    }

    async function loadCarUnlockFromStorage() {
        try {
            const carUnlockJSON = await AsyncStorage.getItem("carUnlock");
            if (carUnlockJSON !== null) {
                setUpgradeLog(JSON.parse(carUnlockJSON));
            }
        } 
        catch (error) {
            console.error("Error loading car data from storage:", error);
        }
    }

    async function loadCarUnlockInStorage(carUnlockData) {
        try {
            const carUnlockJSON = JSON.stringify(carUnlockData);
            await AsyncStorage.setItem("carUnlock", carUnlockJSON);
            console.log('saved car data in storage')
        }
        catch (error){
            console.error("Error saving car data to storage:", error);
        }
    }

    function initializeCarDetails(carDetails) {
        const { money, speed, acceleration, wheels, handling } = carDetails[0];
        const { upgrade_log } = carDetails[0];
        const carProperties = { money, speed, acceleration, wheels, handling };
        const upgradeLog = { ...upgrade_log };
        
        console.log(`carData ${carProperties}`)
        setCarProperties(carProperties);
        loadCarInStorage(carProperties);

        console.log(`upgradelog: ${upgradeLog}`)
        setUpgradeLog(upgradeLog);
        loadCarUnlockInStorage(upgradeLog);
    }
    

    //--------------------- SET CAR UPGRADES AND SAVE INTO LOCAL STORAGE OF PHONE -------------------------//

    useEffect(() => {
        const user_profile_id = userCtx.userprofile.id
        const upgrade_log = upgradeLog
        const updatedCarProperties = {
            ...carProperties, upgrade_log, user_profile_id //add user_id here
        }
        changeUserCarDetails(updatedCarProperties)
    }, [carProperties, upgradeLog])


    function editMoney(moneyChange) {
        setCarProperties(prevCarProperty => { 
            const updatedCarProperty = {...prevCarProperty, money: parseInt(prevCarProperty.money) + Number(moneyChange) }
            loadCarInStorage(updatedCarProperty);
            return updatedCarProperty;
        });
    }

    function editAcceleration(accelerationIncrease, moneyChange) {
        setCarProperties(prevCarProperty => { 
            const updatedCarProperty = {...prevCarProperty, acceleration: prevCarProperty.acceleration + accelerationIncrease,
            money: parseInt(prevCarProperty.money) + Number(moneyChange) }
            loadCarInStorage(updatedCarProperty);
            return updatedCarProperty;
        });

    }
    
    function editSpeed(speedIncrease, moneyChange) {
        setCarProperties(prevCarProperty => { 
            const updatedCarProperty = {...prevCarProperty, speed: prevCarProperty.speed + speedIncrease,
            money: parseInt(prevCarProperty.money) + Number(moneyChange) }
            loadCarInStorage(updatedCarProperty);
            return updatedCarProperty;
        });

    }
    
    function editHandling(handlingIncrease, moneyChange) {
        setCarProperties(prevCarProperty => { 
            const updatedCarProperty = {...prevCarProperty, handling: prevCarProperty.handling + handlingIncrease,
            money: parseInt(prevCarProperty.money) + Number(moneyChange) }
            loadCarInStorage(updatedCarProperty);
            return updatedCarProperty;
        });

        
    }
    
    function editWheels(wheelIncrease, moneyChange) {
        setCarProperties(prevCarProperty => { 
            const updatedCarProperty = {...prevCarProperty, wheels: prevCarProperty.wheels + wheelIncrease,
            money: parseInt(prevCarProperty.money) + Number(moneyChange) }
            loadCarInStorage(updatedCarProperty);
            return updatedCarProperty;
        });

        loadCarInStorage(carProperties)
    }

    //--------------------- SET CAR UPGRADE LOG AND SAVE INTO LOCAL STORAGE OF PHONE -------------------------//


    function editUnlock(upgradeType, id, item) {
        let index = 0;
        console.log(id)
        switch(upgradeType){
            case 'Snelheid':
                index = upgradeLog.Speed.findIndex((value) => value === false);
                console.log(`index ${index}`)
                if (index === id - 1)
                {
                    console.log('purchased')
                    const newSpeed = [...upgradeLog.Speed];
                    newSpeed[index] = true
                    setUpgradeLog(prevUpgradeLog => {
                        const updatedUpgradeLog = {...prevUpgradeLog, Speed: newSpeed};
                        loadCarUnlockInStorage(updatedUpgradeLog);
                        return updatedUpgradeLog;
                    });
                    Alert.alert(`Purchased ${item}`);
                    return true;
                }
                break;
            case 'Versnelling': 
                index = upgradeLog.Acc.findIndex((value) => value === false);
                if (index === id - 1) {
                    const newAcc = [...upgradeLog.Acc];
                    newAcc[index] = true
                    setUpgradeLog(prevUpgradeLog => {
                        const updatedUpgradeLog = {...prevUpgradeLog, Acc: newAcc};
                        loadCarUnlockInStorage(updatedUpgradeLog);
                        return updatedUpgradeLog;
                    });
                    Alert.alert(`Purchased ${item}`);
                    return true;
                }
                break;

            case 'Afstand':
                index = upgradeLog.Handling.findIndex((value) => value === false);
                if (index === id - 1) {
                    const newHandling = [...upgradeLog.Handling];
                    newHandling[index] = true
                    setUpgradeLog(prevUpgradeLog => {
                        const updatedUpgradeLog = {...prevUpgradeLog, Handling: newHandling};
                        loadCarUnlockInStorage(updatedUpgradeLog);
                        return updatedUpgradeLog;
                    });
                    Alert.alert(`Purchased ${item}`);
                    return true;
                }
                break;
            case 'Wheels':
                index = upgradeLog.Wheels.findIndex((value) => value === false);
                if (index === id - 1) {
                    const newWheel = [...upgradeLog.Wheels];
                    newWheel[index] = true
                    setUpgradeLog(prevUpgradeLog => {
                        const updatedUpgradeLog = {...prevUpgradeLog, Wheels: newWheel};
                        loadCarUnlockInStorage(updatedUpgradeLog);
                        return updatedUpgradeLog;
                    });
                    Alert.alert(`Purchased ${item}`);
                    return true;
                }
                break;
            }
        Alert.alert("Previous items are not yet unlocked, buy these first!")
        return false;
    }

    const value = {
        carProperties: carProperties,
        upgradeLog: upgradeLog,
        editSpeed: editSpeed,
        editAcceleration: editAcceleration,
        editHandling: editHandling, 
        editWheels: editWheels,
        editMoney: editMoney,
        editUnlock: editUnlock,
        initializeCarDetails: initializeCarDetails
    }

    return <CarContext.Provider value = {value}>{children}</CarContext.Provider>
}

export default CarContextProvider