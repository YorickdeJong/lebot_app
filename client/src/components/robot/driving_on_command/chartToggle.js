import { StyleSheet, View, Text, } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import { ColorsBlue } from "../../../constants/palet";


function ChartToggle({graphName, toggleChart, toggleChartSettings, extraStyle}){
    return(

            <View style = {[styles.textContainer, {...extraStyle}]}>
                <Text style = {styles.text}>{graphName}</Text>
                <TouchableOpacity onPress={toggleChartSettings}>
                    <View style={styles.stopContainer}>
                        <View
                        style={[
                            styles.stopCircle,
                            toggleChart ? styles.stopCircleActive : {},
                        ]}
                        />
                    </View>
                </TouchableOpacity>
            </View>
    )
}

export default ChartToggle;

const styles = StyleSheet.create({
    text: {
        color: ColorsBlue.blue400,
        fontSize: 18,
    },

    textContainer: {
        padding: 5,
        marginVertical: 10,
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    stopContainer: {
        width: 40,
        height: 20,
        borderRadius: 20,
        borderWidth: 2,
        marginLeft: 20,
        borderColor: ColorsBlue.blue100,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    stopCircle: {
        width: 16,
        height: 16,
        borderRadius: 16,
        marginRight: 2,
        backgroundColor: ColorsBlue.blue200,
    },
    stopCircleActive: {
        transform: [{ translateX: 20 }],
    },
})