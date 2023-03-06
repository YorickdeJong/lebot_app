import { ImageBackground, StyleSheet, View } from "react-native"
import Icon from "../../Icon"
import { ColorsBlue } from "../../../constants/palet"
import { LinearGradient } from "expo-linear-gradient"
import DriveCommandIcon from "../../UI/driveCommandIcon"

function DriveLayout({moveHandler, powerHandler, power, disconnectHandle}) {
    return (

        <View style={{backgroundColor: ColorsBlue.blue1200, flex: 1}}>
        <ImageBackground
            source={require('./../../../../assets/grid.jpg')} 
            style= {styles.background}
            imageStyle={{opacity: 0.4}}
            >
                <View style = {styles.upperContainer}>
                    <View style = {styles.upperIcons}>
                        <Icon 
                        icon = "stop-circle"
                        size={60}
                        color={ColorsBlue.blue500}
                        onPress = {moveHandler.bind(this, 'stop')}
                        differentDir={true}/>
                        
                        <Icon 
                        icon = {power ? "power-off" : "power"}
                        size={60}
                        color={ColorsBlue.blue500}
                        onPress = {powerHandler}
                        differentDir={true}/>

                        <Icon 
                        icon = "lan-disconnect"
                        size={60}
                        color={ColorsBlue.blue500}
                        onPress = {disconnectHandle}
                        differentDir={true}/>
                    </View>
                </View>
                    <View style = {[styles.arrow, {marginTop: 30}]}>      
                        <DriveCommandIcon
                        icon='arrow-up-circle'
                        size={120}
                        color={ColorsBlue.blue500}
                        onPressIn = {moveHandler.bind(this, "up", true)}
                        onPressOut = {moveHandler.bind(this, "up", false)}
                        />
                    </View>
                    <View style = {styles.middleContainer}>
                        <View style = {styles.middleLeftContainer}> 
                            <DriveCommandIcon 
                            icon='arrow-back-circle'
                            size={120}
                            color={ColorsBlue.blue500}
                            onPressIn = {moveHandler.bind(this, "left", true)}
                            onPressOut = {moveHandler.bind(this, "left", false)}
                            />
                        </View> 
                    <View>
                            <DriveCommandIcon
                            icon='arrow-forward-circle'
                            size={120}
                            color={ColorsBlue.blue500}
                        onPressIn = {moveHandler.bind(this, "right", true)}
                        onPressOut = {moveHandler.bind(this, "right", false)}
                            />
                        </View> 
                    </View>
                    <View style = {styles.arrow}>
                        <DriveCommandIcon 
                        icon= 'arrow-down-circle'
                        size={120}
                        color={ColorsBlue.blue500}
                        onPressIn = {moveHandler.bind(this, "down", true)}
                        onPressOut = {moveHandler.bind(this, "down", false)}
                        />
                    </View>
        </ImageBackground>
    </View>
   
    )
}

export default DriveLayout


const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        paddingLeft:20
    },
    upperIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    middleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    upperContainer: {
        marginTop: 10,
        marginRight: 20,
        marginBottom: 50, 
        borderBottomColor: ColorsBlue.blue700,
        borderBottomWidth: "2%"
    },
    middleLeftContainer: {
        marginRight: 90
    },
    arrow: {
        alignItems: 'center'
    },
    background: {
        flex: 1,
        paddingLeft: 20
    }
})