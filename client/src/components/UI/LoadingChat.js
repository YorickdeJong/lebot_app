import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ColorsBlue } from '../../constants/palet';

function LoadingChat({ message, extraStyles }) {
  return (
      <View style={styles.rootContainer}>
        <Text style={[styles.message, extraStyles]}>{message}</Text>
        <ActivityIndicator size="large" />
      </View>
  );
}

export default LoadingChat;

const styles = StyleSheet.create({
  rootContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1
  },
  message: {
    fontSize: 20,
    color: ColorsBlue.blue200,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
});

