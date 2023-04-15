import { BlurView } from 'expo-blur';
import {View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ColorsBlue } from '../../constants/palet';


function ButtonList({firstButtonHandler, secondButtonHandler, thirdButtonHandler, textButtonOne, textButtonTwo, textButtonThree}) {
    return (
        <View style={styles.buttonOuterContainer}>
            <View style={styles.button}>

                <TouchableOpacity 
                style={styles.buttonContainer}
                onPress = {firstButtonHandler}>
                    <BlurView intensity={8} style={{ flex: 1, borderRadius: 5, overflow: 'hidden', justifyContent: 'center' }}>
                        
                        <Text style={styles.buttonText}>{textButtonOne}</Text>
                    </BlurView>
                </TouchableOpacity>
                    
                <TouchableOpacity 
                style={styles.buttonContainer}
                onPress = {secondButtonHandler}>
                    <BlurView intensity={8} style={{ flex: 1, borderRadius: 5, overflow: 'hidden', justifyContent: 'center' }}>
                        
                        <Text style={styles.buttonText}>{textButtonTwo}</Text>
                    </BlurView>
                </TouchableOpacity>
                    
                <TouchableOpacity 
                style={styles.buttonContainer}
                onPress = {thirdButtonHandler}>
                    <BlurView intensity={8} style={{ flex: 1, borderRadius: 5, overflow: 'hidden', justifyContent: 'center' }}>
                        
                        <Text style={styles.buttonText}>{textButtonThree}</Text>
                    </BlurView>
                </TouchableOpacity>
            </View>
        </View>
    )
}


export default ButtonList

const styles = StyleSheet.create({
    buttonContainer: {
        width: 100,
        height: 55,
        paddingVertical: 0.4,
        borderRadius: 5,
        borderColor: ColorsBlue.blue700,
        borderWidth: 0.6,
        justifyContent: 'center',
        shadowColor: 'black', // Change shadow color to 'black' for better visibility
        shadowOffset: { width: 0, height: 2 }, // Increase the height offset
        shadowOpacity: 1, // Lower the shadow opacity to make it more subtle
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        color: ColorsBlue.blue50,
        fontSize: 22,
        textAlign: 'center',
        fontWeight: '400',
    },
    buttonOuterContainer: {
        position: 'absolute',
        bottom: '0%',
        width: "100%",
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 30,
        marginBottom: 10,

    },
})