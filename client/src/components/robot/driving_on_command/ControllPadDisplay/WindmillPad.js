import { useState } from "react";
import { StyleSheet, View, } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import { ColorsBlue } from "../../../../constants/palet";



function WindmillPad(){
    const [toggle, setToggle] = useState(false)

    function toggleOnOff(){
        setToggle(!toggle)

        if (toggle){
            return;
        }

        
    }

    return(
        <View style = {styles.outerContainer}>
            <TouchableOpacity onPress={toggleOnOff}
            >
                    <View style={styles.stopContainer}>
                        <View
                        style={[
                            styles.stopCircle,
                            toggle ? styles.stopCircleActive : {},
                        ]}
                        />
                    </View>
            </TouchableOpacity> 

        </View>
    )
}

export default WindmillPad

const styles = StyleSheet.create({
    stopContainer: {
        width: 100,
        height: 50,
        borderRadius: 50,
        borderWidth: 2,
        marginLeft: 20,
        borderColor: ColorsBlue.blue100,
        justifyContent: "center",
        alignItems: "flex-start",
        alignSelf: 'center',
    },
    stopCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: ColorsBlue.blue200,
    },
    stopCircleActive: {
        transform: [{ translateX: 48 }],
    },
    outerContainer: {
        marginTop: 20
    }
})