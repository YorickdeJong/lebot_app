import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ColorsBlue } from "../../../constants/palet";




function Border({text, extraStyle}) {
    const borderRef = useRef(null);

    // console.log(borderRef)
    return(
        <View
        ref={borderRef}
        style={[
        styles.border,
        {...extraStyle},
        ]}
        >
            <Text style={[styles.text]}>
            {text}
            </Text>
        </View>
    )
}

export default Border;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: ColorsBlue.blue100,
  },
  border: {
    width: 140,
    height: 60,
    borderColor: ColorsBlue.blue1100,
    backgroundColor: ColorsBlue.blue1000,
    borderWidth: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 15,
    marginTop: 5
  }
});