
import {TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { ColorsBlue } from '../../constants/palet';
import { LinearGradient } from 'expo-linear-gradient';



function InformationButton({text, onPress, headerHeight, marginBottom}) {
    return (
        <TouchableOpacity style = {[styles.shadow, { marginTop: headerHeight, marginBottom: marginBottom }]}
        onPress={onPress}>
                    <Text style = {styles.text}>
                        {text}
                    </Text>
        </TouchableOpacity>
    )
}


export default InformationButton;


const styles = StyleSheet.create({
    shadow: {
        alignSelf: 'center',
        marginVertical: 10,
        shadowOffset: {height:2, width:1 },
        shadowRadius: 3,
        shadowOpacity: 1,
        shadowColor: 'rgba(0,0,0,1)',
        width: '80%',    
        height: 55,
        borderBottomColor: 'rgba(77, 77, 77, 0.2)',
        borderWidth: 2.1,
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(15, 15, 70, 1)'
    },
    text: {
        textAlign: 'center',
        fontSize: 21,
        fontWeight: '400',
        color: ColorsBlue.blue100

    }
})