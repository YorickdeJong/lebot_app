import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet, Text, View } from "react-native"
import { ColorsBlue } from "../../../constants/palet"


function PartsButton({part, color}) {

    const locations = color.map(
        (_, index) => index / (color.length - 1)
    );
    return (
        <LinearGradient 
            colors={color} 
            style = {styles.partsbutton}
            locations={locations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            >
            <Text style ={styles.text}>{part}</Text>
        </LinearGradient>
    )
}


export default PartsButton

const styles = StyleSheet.create({
    partsbutton: {
        marginTop: 20,
        margin: 10,
        height: 80,
        width: 160,
        justifyContent: 'center',
        borderRadius: 6
    },    
    text: {
        color: "white",
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    }, 
})