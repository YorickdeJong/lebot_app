import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import { ColorsBlue } from '../../constants/palet'
import { BlurView } from 'expo-blur'


function TeacherOptionTiles({tileName, onPress}) {
    return (
        <TouchableOpacity style = {styles.tiles}
        onPress={onPress}>
            <BlurView 
            style = {styles.colorGradient}
            tint = 'light'
            intensity = {6}
             >
                <Text style = {[styles.text]}>{tileName}</Text>
            </BlurView>
        </TouchableOpacity>
    )
}

export default TeacherOptionTiles



const styles = StyleSheet.create({
    tiles: {
        width: 170,
        marginTop: 10, 
        margin: 10,
        height: 125,
        borderRadius: 20, 
        elevation: 4, 
        shadowColor: ColorsBlue.blue1000,
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 2,
        shadowOpacity: 1,
        borderWidth: 0.2,
        borderColor: ColorsBlue.blue1000,
        backgroundColor: ColorsBlue.blue1000
    },
    colorGradient: { 
        justifyContent: 'center',
        borderRadius: 7, 
        flex: 1,
        overflow: 'hidden'
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        textShadowColor: ColorsBlue.blue1400, // set text shadow color
        textShadowOffset: { width: 0, height: 3 }, // set text shadow offset
        textShadowRadius: 2, // set text shadow radius
        color: ColorsBlue.blue50
    },
})