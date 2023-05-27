
import {View, Text, StyleSheet} from 'react-native'
import { ColorsBlue } from '../../constants/palet'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
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
        height: verticalScale(40),
        backgroundColor: ColorsBlue.blue700,
        justifyContent: 'flex-end',
        borderBottomWidth: Platform.OS === 'ios' ? "1%" : 0.8,
        borderBottomColor: ColorsBlue.blue800,
        elevation: 2, 
        shadowColor: ColorsBlue.blue1300,
        shadowOpacity: 0.7,
        shadowRadius: 4,
        shadowOffset: {height: 3, width: 1},
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },

    text: {
        marginLeft: 20,
        marginBottom: 10,
        fontSize: 16,
        color: ColorsBlue.blue200
    }   
})