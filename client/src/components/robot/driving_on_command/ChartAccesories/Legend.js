import { BlurView } from "expo-blur";
import { StyleSheet, Text, View } from "react-native";
import { ColorsBlue } from "../../../../constants/palet";



export const Legend = ({ items }) => {
    return (
        <View>
            {items.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendIcon, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.label}</Text>
                </View>
            ))}
        </View>
    );
};



const styles = StyleSheet.create({
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  legendIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: ColorsBlue.blue200,
    // textAlign: 'center'
},
})