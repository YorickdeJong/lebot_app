import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useContext, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native"
import { ColorsBlue, ColorsDarkerBlue, ColorsLighterGold, ColorsTile, StoreColors } from "../../../constants/palet"
import { CarContext } from "../../../store/car-context";


function UpgradeTab({upgradeType, colorsUpgrade, setColorsUpgrade}){
    const carCtx = useContext(CarContext);

    function convertColorObjectToArray(colorObject) {
        return Object.entries(colorObject).map(([name, hex]) => {
            return hex;

        });
    }
    const colorsGold = convertColorObjectToArray(ColorsLighterGold);

    useEffect(() => {
        const newColors = colorsUpgrade.slice(); //slice here to create a new array and cause a rerender
        console.log('check render')
        console.log(upgradeType)

        switch(upgradeType){
            case 'Speed':
                carCtx.upgradeLog.Speed.map((item, index) => {
                    if (item === true){
                        newColors[index] = colorsGold
                    }
                    
                })
                break;
            case 'Acc':
                carCtx.upgradeLog.Acc.map((item, index) => {
                    if (item === true){
                        newColors[index] = colorsGold;
                    }
                })
                break;
            case 'Handling':
                carCtx.upgradeLog.Handling.map((item, index) => {
                    if (item === true){
                        newColors[index] = colorsGold
                    }
                })
                break;
            case 'Wheels':
                carCtx.upgradeLog.Wheels.map((item, index) => {
                    if (item === true){
                        newColors[index] = colorsGold
                    }
                })
                break;
            }
        setColorsUpgrade(newColors)
    }, [upgradeType, carCtx.upgradeLog])

    console.log(colorsUpgrade[0])
    const locations = colorsUpgrade[0].map((_, index) => index / (colorsUpgrade[0].length - 1));
    
    return (
            <View style = {styles.upgrade}>
                <Text style ={styles.text}>{upgradeType}</Text>
                <View style={styles.progressBar}>
                    <LinearGradient 
                        style = {styles.tile}
                        colors={colorsUpgrade[0]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        locations={locations}
                        />
                    <LinearGradient 
                        style = {styles.tile}
                        colors={colorsUpgrade[1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        locations={locations}
                        />
                    <LinearGradient 
                        style = {styles.tile}
                        colors={colorsUpgrade[2]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        locations={locations}
                        />
                    <LinearGradient 
                        style = {styles.tile}
                        colors={colorsUpgrade[3]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        locations={locations}
                        />
                    <LinearGradient 
                        style = {styles.tile}
                        colors={colorsUpgrade[4]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        locations={locations}
                        />
                </View>
            </View>
           
    )
}

export default UpgradeTab


const styles = StyleSheet.create({
    upgrade: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
    },
    progressBar: {
        flexDirection: 'row',
        height: 30
    },
    tile: {
        width: 30,
        height: 30,
        borderColor: ColorsBlue.blue100,
        borderWidth: 2,
        marginRight: 5,
        borderRadius: 3
    },
    text: {
        color: "white",
        fontSize: 24,
        fontWeight: 'italic',
        marginLeft: 15,
        textAlign: 'center'
    },
    outerContainer: {
        justifyContent: 'center',
        flex: 1
    }

})