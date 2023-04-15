import { useContext } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { ColorsBlue, ColorsGreen } from "../../constants/palet";
import { ColorContext } from "../../store/color-context";


function ChangeButton({children, onPress}) {
    const colorCtx = useContext(ColorContext);

    const button = [styles.button, {backgroundColor: ColorsBlue.blue1150,
     shadowColor: ColorsBlue.blue1200}]

    return(
        <View>
            <Pressable
            onPress = {onPress}
            style = {({pressed}) => [button, pressed && styles.pressed]}>
                <Text style={[styles.text, {color: ColorsBlue.blue100}]}>{children}</Text>
            </Pressable>
        </View>
    ) 
}

export default ChangeButton

const styles = StyleSheet.create({
    pressed: {
        opacity: 0.5
    },
    button: {
        borderRadius: 6,
        shadowOffset: {height:1, width:0 },
        shadowRadius: 3,
        shadowOpacity: 0.5,
        marginTop: 15,
        marginHorizontal: 60,
        height: 35,
        justifyContent: 'center',
        borderColor: ColorsBlue.blue700,
        borderWidth: 0.9,
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '400'
    }
})