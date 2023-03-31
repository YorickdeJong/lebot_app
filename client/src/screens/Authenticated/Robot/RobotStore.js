import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ImageBackground, View, Text, StyleSheet, ImageBackgroundBase } from "react-native"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import PartsButton from "../../../components/robot/store/partsButton";
import PartsContainer from "../../../components/robot/store/partsContainer";
import UpgradeContainer from "../../../components/robot/store/upgradeContainer";
import { ColorsBlue, ColorsDarkerBlue, ColorsDarkestBlue, ColorsGreen, ColorsLighterGold, ColorsOrange, ColorsPurple, ColorsRed, ColorsTile} from "../../../constants/palet"
import { accelData, handlingData, speedData, wheelsData } from "../../../data/storeData";

function RobotStore() {
    const colors = [
        ColorsDarkestBlue.blue1000, ColorsDarkestBlue.blue900,
        ColorsDarkestBlue.blue800, ColorsDarkestBlue.blue700,
        ColorsDarkestBlue.blue700, ColorsDarkestBlue.blue700,
        ColorsDarkestBlue.blue800, ColorsDarkestBlue.blue900,
        ColorsDarkestBlue.blue1000
    ];
    
    const locations = colors.map(
        (_, index) => index / (colors.length - 1)
    );


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
                source={require('./../../../../assets/carBluePrint2.jpg')} 
                style={
                {flex: 1, resizeMode: 'contain'}
                }
                imageStyle={{opacity: 0.1}}
            >
            <ScrollView style = {{flex: 1}}
            showsVerticalScrollIndicator={false}>

            <View style = {styles.backgroundImage}>
                <UpgradeContainer 
                upgradeType = "Speed"
                data = {speedData}
                Completed = {true}
                backgroundColors = 'rgba(49, 82, 143, 0.3)'
                borderColors = {ColorsTile.blue700}
                />
            
                <UpgradeContainer 
                upgradeType = "Acc"
                data = {accelData}
                Completed = {false}
                backgroundColors = 'rgba(105, 45, 105, 0.45)'
                borderColors = {ColorsPurple.purple700}
                />

                <UpgradeContainer 
                upgradeType = "Handling"
                data = {handlingData}
                Completed = {true}
                backgroundColors = 'rgba(150, 49, 49, 0.4)'
                borderColors = {ColorsRed.red700}
                />

                <UpgradeContainer 
                upgradeType = "Wheels"
                data = {wheelsData}
                Completed = {false}
                backgroundColors = 'rgba(140, 75, 45, 0.45)'
                borderColors = {ColorsOrange.orange700}
                />

                <PartsContainer 
                backgroundColors = 'rgba(42, 77, 12, 0.35)'
                borderColors = {ColorsGreen.green700}
                />

            </View>
            </ScrollView>
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
        borderTopColor: ColorsBlue.blue900,
        borderTopWidth: 1,
    }
})