    import { LinearGradient } from "expo-linear-gradient"
import { Alert, StyleSheet, View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { ColorsBlue, ColorsDarkerBlue, ColorsTile } from "../../../constants/palet"
import AssignmentTile from "../../assignments/AssignmentTile"
import UpgradeTab from "./upgradeTab"
import { BlurView } from 'expo-blur';
import { useCallback, useContext, useEffect, useState} from "react"
import React from "react"
import { CarContext } from "../../../store/car-context"
import { changeUserCarDetails } from "../../../hooks/carDetails"

const UpgradeContainer = React.memo(({upgradeType, Completed, data, backgroundColors}) => {
    const carCtx = useContext(CarContext);

    // Set colors for upgradeTab, once an item is bot the sqaure becomes 
    function convertColorObjectToArray(colorObject) {
        return Object.entries(colorObject).map(([name, hex]) => {
            return hex;

        });
    }

    const [colorsUpgrade, setColorsUpgrade] = useState([convertColorObjectToArray(ColorsDarkerBlue), 
        convertColorObjectToArray(ColorsDarkerBlue), convertColorObjectToArray(ColorsDarkerBlue),
        convertColorObjectToArray(ColorsDarkerBlue), convertColorObjectToArray(ColorsDarkerBlue)]);
    
    const renderUpgrades = useCallback((itemData) => {
        function increasePerformanceHandler () {
            if (itemData.item.status[0] > carCtx.carProperties.money){
                Alert.alert('Not enough money to buy this upgrade, complete assignments first');
                return;
            }
            Alert.alert(`Are you sure you want to buy the ${itemData.item.title} item?`, 
            '',
            [
                {
                    text: 'No',
                    onPress: () => {return}
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        try{
                            switch(upgradeType){
                                case 'Speed':
                                    if (carCtx.editUnlock(upgradeType, itemData.item.id, itemData.item.title)) {
                                        carCtx.editSpeed(itemData.item.levelUp, -itemData.item.status[0]);
                                    }
                                    break;
                                case 'Acc': 
                                    if(carCtx.editUnlock(upgradeType, itemData.item.id, itemData.item.title)){
                                        carCtx.editAcceleration(itemData.item.levelUp, -itemData.item.status[0]);
                                    }
                                    break;
                                case 'Handling':
                                    if (carCtx.editUnlock(upgradeType, itemData.item.id, itemData.item.title)){
                                        carCtx.editHandling(itemData.item.levelUp, -itemData.item.status[0]);
                                    }
                                    break;
                                case 'Wheels':
                                    if (carCtx.editUnlock(upgradeType, itemData.item.id, itemData.item.title)){
                                        carCtx.editWheels(itemData.item.levelUp, -itemData.item.status[0]);
                                    }
                                    break;
                            }
                            console.log(carCtx.carProperties.speed)
                        }
                        catch(err)
                        {
                            console.log(err)
                        }
                    }
            
                },
            ])
            return true;
        } 
        
        return (
            <AssignmentTile
            {...itemData.item}
            onPress = {increasePerformanceHandler}
            />
        )
    }, [carCtx.carProperties, carCtx.upgradeLog]) 

    useEffect(() => {

    }, [carCtx.carProperties, carCtx.upgradeLog])

    return (
            <BlurView intensity={3} style={[styles.upgradeContainer, {backgroundColor: backgroundColors}]}>
                <View style ={styles.outerContainer}>
                    <UpgradeTab
                    upgradeType={upgradeType}
                    Completed = {Completed}
                    colorsUpgrade={colorsUpgrade}
                    setColorsUpgrade={setColorsUpgrade}
                    />
                </View>
                <View style = {styles.outerFlatlist}>
                    <View style={styles.flatList}>
                    <FlatList 
                        horizontal
                        data={data}
                        keyExtractor = {(item) => item.id}
                        numColumns = {1}
                        renderItem = {renderUpgrades} 
                        showsHorizontalScrollIndicator={false}
                    />
                    </View>
                </View>
            </BlurView>
    )
},  (prevProps, nextProps) => {
  return prevProps.upgradeType === nextProps.upgradeType && 
         prevProps.Completed === nextProps.Completed && 
         prevProps.backgroundColors === nextProps.backgroundColors;
});



export default UpgradeContainer


const styles= StyleSheet.create({
    blurContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    upgradeContainer: {     
        justifyContent: 'center',
        margin: 10,
        borderRadius: 5
    },
    outerContainer: {
        justifyContent: 'center',
        height: 60,
        opacity: 1,
        marginRight: 10
    },
    flatList: {
        width: "90%",
    },
    outerFlatlist: {
        alignItems: 'center',
        marginRight: 8
    }
})

