
import {TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { ColorsBlue } from '../../constants/palet';
import { LinearGradient } from 'expo-linear-gradient';



function InformationButton({text, onPress, headerHeight, marginBottom}) {
    return (
        <TouchableOpacity style = {[styles.shadow, { marginTop: headerHeight, marginBottom: marginBottom }]}
        onPress={onPress}>
            <LinearGradient      
            style = {[styles.button, ]}
            colors={[ColorsBlue.blue1400, ColorsBlue.blue1000]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
                    <Text style = {styles.text}>
                        {text}
                    </Text>
            </LinearGradient>

        </TouchableOpacity>
    )
}


export default InformationButton;


const styles = StyleSheet.create({
    button: {
        borderRadius: 15,
        justifyContent: 'center',
        borderColor: ColorsBlue.blue1100,
        borderWidth: 0.9,
        width: '100%',    
        height: 60
    },
    shadow: {
        alignSelf: 'center',
        marginVertical: 10,
        shadowOffset: {height:2, width:0 },
        shadowRadius: 3,
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,1)',
        width: '80%',    
        height: 60,
        
    },
    text: {
        textAlign: 'center',
        fontSize: 21,
        fontWeight: '400',
        color: ColorsBlue.blue100

    }
})