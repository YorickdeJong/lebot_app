import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ImageBackground, View, Text, StyleSheet, ImageBackgroundBase } from "react-native"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import PartsButton from "../../../components/robot/store/partsButton";
import PartsContainer from "../../../components/robot/store/partsContainer";
import UpgradeContainer from "../../../components/robot/store/upgradeContainer";
import { ColorsBlue, ColorsDarkerBlue, ColorsDarkestBlue, ColorsGreen, ColorsLighterGold, ColorsOrange, ColorsPurple, ColorsRed, ColorsTile} from "../../../constants/palet"
import { accelData, handlingData, speedData, wheelsData } from "../../../data/storeData";
import ButtonList from "../../../components/UI/ButtonList.UI";

function RobotStore() {
    const [type, setType] = useState("afstand")
    
    console.log(`CHECK SCREEN ROBOT STORE`)

    //TODO add function to select tiles
    function selectUpgrade(upgradeType){
        switch(upgradeType) {
            case 'speed':
                setType("speed")
                break;
            case 'acceleration':
                setType("acceleration")
                break;
            case 'afstand':
                setType("afstand")
                break;
        }
    }

    return (
    <View style = {styles.outerContainer}>
        <LinearGradient
                colors={[ColorsBlue.blue1300, ColorsBlue.blue1100]}
                style={{ flex: 1 }}
                // locations={locations}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
            <ImageBackground
                source={require('./../../../../assets/planets/robot_screen3.png')} 
                style={
                {flex: 1, resizeMode: 'contain'}
                }
                imageStyle={{opacity: 1}}
            >
                <ScrollView style = {{flex: 1}}
                showsVerticalScrollIndicator={false}>

                    <View style = {styles.backgroundImage}>
                        {type === "speed" && 
                            <UpgradeContainer 
                            upgradeType = "Snelheid"
                            textColor = {ColorsRed.red300}
                            data = {speedData}
                            Completed = {true}
                            backgroundColors = 'rgba(255, 255, 255, 0.05)'
                            borderColors = {ColorsBlue.blue1400}
                            />
                        }
                    
                        {type === "acceleration" &&
                            <UpgradeContainer 
                            upgradeType = "Versnelling"
                            textColor = {ColorsPurple.purple300}
                            data = {accelData}
                            Completed = {false}
                            backgroundColors = 'rgba(255, 255, 255, 0.05)'
                            borderColors = {ColorsBlue.blue1400}
                            />
                        }

                        {type ===  "afstand" &&
                            <UpgradeContainer 
                            upgradeType = "Afstand"
                            textColor = {ColorsOrange.orange300}
                            data = {handlingData}
                            Completed = {true}
                            backgroundColors = 'rgba(255, 255, 255, 0.05)'
                            borderColors = {ColorsBlue.blue1400}
                            />
                        }

                        {/* {type === 
                            <UpgradeContainer 
                            upgradeType = "Wheels"
                            data = {wheelsData}
                            Completed = {false}
                            backgroundColors = 'rgba(140, 75, 45, 0.45)'
                            borderColors = {ColorsOrange.orange700}
                            />
                        } */}
                    </View>
                </ScrollView>
                <ButtonList 
                    firstButtonHandler={selectUpgrade.bind(this, "afstand")}
                    secondButtonHandler={selectUpgrade.bind(this, "speed")}
                    thirdButtonHandler = {selectUpgrade.bind(this, "acceleration")}
                    textButtonOne= "Afstand"
                    textButtonTwo= "Snelheid"
                    textButtonThree= "Acc."
                />
            </ImageBackground>
        </LinearGradient>
    </View>
    )
}

export default RobotStore

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain',
        marginTop: 15
    },

    outerContainer: {
        flex: 1,
    }
})