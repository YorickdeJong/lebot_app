import { useContext } from "react"
import { StyleSheet, Text, View } from "react-native"
import { ColorsLighterGold } from "../../../constants/palet"
import { CarContext } from "../../../store/car-context"
import Icon from "../../Icon"
import {scale , verticalScale} from 'react-native-size-matters'


function MoneyContainer() {
    const carCtx = useContext(CarContext);
    return (
        <View style = {styles.moneyContainer}>
            <Icon 
            icon = "cash-multiple"
            differentDir={true}
            size = {30}
            color={ColorsLighterGold.gold800}/>
            <Text style = {styles.textGold} > :  € {carCtx.carProperties.money}</Text>
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
    textGold: {
        color: "white",
        fontSize: 20,
        marginTop: 5
    },
})