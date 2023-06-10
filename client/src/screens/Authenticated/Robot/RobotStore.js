import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { ImageBackground, View, Text, StyleSheet, Dimensions, Animated } from "react-native"
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
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');
function RobotStore() {
    const [type, setType] = useState("afstand")
    const [showModalTemp, setShowModalTemp] = useState(true)
    const isFocused = useIsFocused();
    const animationRef = useRef(new Animated.Value(-30)).current;  // Initial value for animation

    useEffect(() => {
        Animated.sequence([
            Animated.timing(animationRef, {
                toValue: -270,
                duration: 700,  // Duration of animation
                useNativeDriver: false,  // You need to set this as false as layout props aren't supported on the native thread
            }),
            Animated.timing(animationRef, {
                toValue: 30,
                duration: 1000,  // Duration of animation
                useNativeDriver: false,  // You need to set this as false as layout props aren't supported on the native thread
            }),
            Animated.timing(animationRef, {
                toValue: 0,
                duration: 500,  // Duration of animation
                useNativeDriver: false,  // You need to set this as false as layout props aren't supported on the native thread
            })
        ]).start();
    }, []);


    useEffect(() => {
        if (isFocused) {
            setShowModalTemp(true)
        }
    }, [isFocused])

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
                style={{ flex: 1, opacity: 0.95 }}
                // locations={locations}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
            <ImageBackground
                source={require('./../../../../assets/planets/robot_screen3.png')} 
                style={
                {   
                    flex: 1,         
                }
                }
                resizeMode="cover"
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
                            animationRef = {animationRef}
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
                    selectFase = {type}
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
        backgroundColor:'rgba(50, 50, 70, 1)',
    }
})