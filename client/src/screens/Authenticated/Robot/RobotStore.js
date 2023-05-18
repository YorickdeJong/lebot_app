import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ImageBackground, View, Text, StyleSheet, ImageBackgroundBase } from "react-native"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import PartsButton from "../../../components/robot/store/partsButton";
import PartsContainer from "../../../components/robot/store/partsContainer";
import UpgradeContainer from "../../../components/robot/store/upgradeContainer";
import { ColorsBlue, ColorsDarkerBlue, ColorsDarkestBlue, ColorsGreen, ColorsLighterGold, ColorsOrange, ColorsPurple, ColorsRed, ColorsTile} from "../../../constants/palet"
import { accelData, handlingData, speedData, wheelsData } from "../../../data/storeData";
import ButtonList from "../../../components/UI/ButtonList.UI";
import ConnectRobotModal from "../../../components/robot/ConnectRobotModal.robot";
import InstructionModalRobotStore from "../../../components/UI/InstructionModalRobotStore";
import { useIsFocused, useNavigation } from "@react-navigation/native";

function RobotStore() {
    const [type, setType] = useState("afstand")
    const [showModalTemp, setShowModalTemp] = useState(true)
    const isFocused = useIsFocused();


    useEffect(() => {
        if (isFocused) {
            setShowModalTemp(true)
        }
    }, [isFocused])
    console.log(`showModalTemp: ${showModalTemp}`)

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
    const upgradeData = [
        {
          type: "speed",
          upgradeType: "Snelheid",
          textColor: ColorsRed.red300,
          data: speedData,
          Completed: true,
          backgroundColors: "rgba(255, 255, 255, 0.05)",
          borderColors: ColorsBlue.blue1400,
        },
        {
          type: "acceleration",
          upgradeType: "Versnelling",
          textColor: ColorsPurple.purple300,
          data: accelData,
          Completed: false,
          backgroundColors: "rgba(255, 255, 255, 0.05)",
          borderColors: ColorsBlue.blue1400,
        },
        {
          type: "afstand",
          upgradeType: "Afstand",
          textColor: ColorsOrange.orange300,
          data: handlingData,
          Completed: true,
          backgroundColors: "rgba(255, 255, 255, 0.05)",
          borderColors: ColorsBlue.blue1400,
        },
    ];

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
                            Completed = {false}
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
                            Completed = {false}
                            backgroundColors = 'rgba(255, 255, 255, 0.05)'
                            borderColors = {ColorsBlue.blue1400}
                            />
                        }

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
        <ConnectRobotModal />
        <InstructionModalRobotStore 
            setShowModalTemp = {setShowModalTemp}
            showModalTemp = {showModalTemp}
        />
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