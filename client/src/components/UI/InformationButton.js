
import {TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { ColorsBlue } from '../../constants/palet';
import { LinearGradient } from 'expo-linear-gradient';
import { and } from 'react-native-reanimated';



function InformationButton({text, onPress, headerHeight, marginBottom}) {
    return (
        <View style = {[styles.shadow, { marginTop: headerHeight, marginBottom: marginBottom }]}>
            <TouchableOpacity style = {[styles.innercontainer]}
            onPress={onPress}>
                        <Text style = {styles.text}>
                            {text}
                        </Text>
            </TouchableOpacity>
        </View>
    )
}


export default InformationButton;


const styles = StyleSheet.create({
    shadow: {
        borderRadius: 20,
        alignSelf: 'center',
        width: '80%',    
        marginVertical: 10,
        height: 40,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0, 0, 0, 1)',
                shadowOffset: { width: 1, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 3,
            },
            android: {
                backgroundColor: 'rgba(0, 0, 0, 1)',

            }
        })
    },
    innercontainer: {
        borderColor: 'rgba(77, 77, 77, 0.2)',
        backgroundColor: 'rgba(15, 15, 70, 1)',
        justifyContent: 'center',
        borderWidth: 1,
        flex: 1,
        ...Platform.select({
            android: {
                marginRight: 3,
                marginBottom: 2,
            }
        }),
        borderRadius: 20,
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '400',
        color: ColorsBlue.blue100

    }
})