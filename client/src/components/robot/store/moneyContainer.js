import { useContext } from "react"
import { StyleSheet, Text, View } from "react-native"
import { ColorsLighterGold } from "../../../constants/palet"
import { CarContext } from "../../../store/car-context"
import Icon from "../../Icon"



function MoneyContainer() {
    const carCtx = useContext(CarContext);
    return (
        <View style = {styles.moneyContainer}>
            <Icon 
            icon = "cash-multiple"
            differentDir={true}
            size = {36}
            color={ColorsLighterGold.gold800}/>
            <Text style = {styles.textGold} > :  € {carCtx.carProperties.money}</Text>
        </View>
    )
}

export default MoneyContainer

const styles = StyleSheet.create({
    moneyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginBottom: 15
    },
    textGold: {
        color: "white",
        fontSize: 24,
        marginTop: 2
    },
})