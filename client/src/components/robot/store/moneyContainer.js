import { useContext } from "react"
import { StyleSheet, Text, View } from "react-native"
import { ColorsBlue, ColorsGreen, ColorsLighterGold } from "../../../constants/palet"
import { CarContext } from "../../../store/car-context"
import Icon from "../../Icon"
import {scale , verticalScale} from 'react-native-size-matters'


function MoneyContainer() {
    const carCtx = useContext(CarContext);
    return (
        <View style = {styles.moneyContainer}>
            <Text style = {styles.text} > € {carCtx.carProperties.money}</Text>
        </View>
    )
}

export default MoneyContainer

const styles = StyleSheet.create({
    moneyContainer: {
        flexDirection: 'row',
        position: 'absolute',
        top: Platform.OS === 'ios' ? verticalScale(36) : verticalScale(32),
        left: "42%",
        backgroundColor: 'transparent',
        marginBottom: Platform.OS === 'ios' ? verticalScale(8) : verticalScale(3),
    },
    text: {
        color: "white",
        fontSize: 20,
        marginTop: 5,
        color: ColorsBlue.blue200,
    },
})