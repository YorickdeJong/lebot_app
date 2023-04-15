import { BlurView } from "expo-blur";
import { StyleSheet, Text, View } from "react-native";
import { ColorsBlue } from "../../../../constants/palet";



export const Legend = ({ items }) => {
  return (
    <View style={styles.container}>
      <View style={styles.legendItems}>
        {items.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendIcon, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    paddingHorizontal: 8,
  },
  legendItems: {
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 11,
    color: 'white',
  },
});