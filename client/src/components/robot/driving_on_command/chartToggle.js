import { StyleSheet, View, Text, TouchableOpacity} from "react-native"
import { ColorsBlue, ColorsGreen, ColorsRed } from "../../../constants/palet";


function ChartToggle({ graphName, toggleChart, toggleChartSettings, extraStyle, notShowBorder }) {
    return (
        <View>
            <View style={[styles.textContainer, { ...extraStyle }]}>
                <View style={styles.textWrapper}>
                <Text style={styles.text}>{graphName}</Text>
                </View>
                <TouchableOpacity onPress={toggleChartSettings} style={{ marginRight: 10 }}>
                <View style={[styles.stopContainer, {borderColor: !toggleChart ? ColorsRed.red600 : ColorsGreen.green700 }]}>
                    <View
                    style={[
                        styles.stopCircle,
                        {backgroundColor: !toggleChart ? ColorsRed.red600 : ColorsGreen.green700 },
                        toggleChart ? styles.stopCircleActive : {},
                    ]}
                    />
                </View>
                </TouchableOpacity>
            </View>
            {!notShowBorder && <View style = {styles.border}/>}
        </View>
    );
  }
export default ChartToggle;

const styles = StyleSheet.create({
    border: {
        borderBottomWidth: 1,
        borderBottomColor: ColorsBlue.blue200,
    },
    text: {
        color: ColorsBlue.blue400,
        fontSize: 18,
    },
    textWrapper: {
        width: 120, // Set a fixed width according to your needs
      },
    textContainer: {
        padding: 5,
        marginVertical: 10,
        marginLeft: 5,
        flexDirection: 'row',
        height: 33,
        justifyContent: 'center',
    },
    stopContainer: {
        width: 40,
        height: 20,
        borderRadius: 20,
        borderWidth: 2,
        marginLeft: 30,
        
    },
    stopCircle: {
        width: 16,
        height: 16,
        borderRadius: 16,
        marginRight: 2,
    },
    stopCircleActive: {
        transform: [{ translateX: 20 }],
    },
})