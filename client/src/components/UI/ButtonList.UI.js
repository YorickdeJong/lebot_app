import { BlurView } from 'expo-blur';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import { ColorsBlue } from '../../constants/palet';
import BlurWrapper from './BlurViewWrapper';


function ButtonList({firstButtonHandler, secondButtonHandler, thirdButtonHandler, textButtonOne, textButtonTwo, textButtonThree, addStyle}) {
    return (
        <View style = {[styles.buttonOuterContainer, addStyle]}>
            <View style={styles.button}>

                <TouchableOpacity 
                style={styles.buttonContainer}
                onPress = {firstButtonHandler}>
                    <BlurWrapper intensity={8} style={{ flex: 1, borderRadius: 20, overflow: 'hidden', justifyContent: 'center' }}>
                        
                        <Text style={styles.buttonText}>{textButtonOne}</Text>
                    </BlurWrapper>
                </TouchableOpacity>
                    
                <TouchableOpacity 
                style={styles.buttonContainer}
                onPress = {secondButtonHandler}>
                    <BlurWrapper intensity={8} style={{ flex: 1, borderRadius: 20, overflow: 'hidden', justifyContent: 'center' }}>
                        
                        <Text style={styles.buttonText}>{textButtonTwo}</Text>
                    </BlurWrapper>
                </TouchableOpacity>
                    
                <TouchableOpacity 
                style={styles.buttonContainer}
                onPress = {thirdButtonHandler}>
                    <BlurWrapper intensity={8} style={{ flex: 1, borderRadius: 20, overflow: 'hidden', justifyContent: 'center' }}>
                        
                        <Text style={styles.buttonText}>{textButtonThree}</Text>
                    </BlurWrapper>
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
        borderRadius: 20,
        borderColor: ColorsBlue.blue700,
        backgroundColor: ColorsBlue.blue1390,
        borderWidth: 0.6,
        justifyContent: 'center',
        shadowColor:  'rgba(0, 0, 0, 1)', // Change shadow color to 'black' for better visibility
        shadowOffset: { width: 1, height: 3 }, // Increase the height offset
        shadowOpacity: 1, // Lower the shadow opacity to make it more subtle
        shadowRadius: 4,
        elevation: 2,
        backgroundColor: Platform.OS === 'android' && 'rgba(0,0,0, 0.95)',
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
        height: 65
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 30,
        marginBottom: 10,
        borderRadius: 20,
    },
})