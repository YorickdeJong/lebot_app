import { useContext } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { ColorsBlue, ColorsGreen } from "../../constants/palet";
import { ColorContext } from "../../store/color-context";


function ChangeButton({children, onPress}) {
    const colorCtx = useContext(ColorContext);

    const button = [styles.button, {backgroundColor: colorCtx.isBlue ? ColorsGreen.green700 : ColorsBlue.blue700,
     shadowColor: colorCtx.isBlue ? ColorsGreen.green1200 : ColorsBlue.blue1200}]

    return(
        <View>
            <Pressable
            onPress = {onPress}
            style = {({pressed}) => [button, pressed && styles.pressed]}>
                <Text style={[styles.text, {color: colorCtx.isBlue ? ColorsGreen.green200 : ColorsBlue.blue200}]}>{children}</Text>
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
        marginTop: 25,
        marginHorizontal: 60,
        height: 25,
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        fontSize: 15
    }
})