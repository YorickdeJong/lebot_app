
import {View, Text, StyleSheet} from 'react-native'
import { ColorsBlue } from '../../constants/palet'

function TitleContainer({text, style}) {
    return (
        <View style = {[styles.bar, style]}>
            <Text style={styles.text}>
                {text}
            </Text>
        </View>

    )
}


export default TitleContainer

const styles = StyleSheet.create({
    bar: {
        height: 55,
        backgroundColor: ColorsBlue.blue500,
        justifyContent: 'flex-end',
        borderBottomWidth: "1%",
        borderBottomColor: ColorsBlue.blue800,
        elevation: 2, 
        shadowColor: ColorsBlue.blue1000,
        shadowOpacity: 0.7,
        shadowRadius: 8,
        shadowOffset: {height: 2, width: 3}

    },
    text: {
        marginLeft: 20,
        marginBottom: 10,
        fontSize: 16,
        color: ColorsBlue.blue200
    }   
})