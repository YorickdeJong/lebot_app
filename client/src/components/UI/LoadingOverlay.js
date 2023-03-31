import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../../store/socket-context';
import { ColorsBlue } from '../../constants/palet';

function LoadingOverlay({ message }) {
  const socketCtx = useContext(SocketContext)

  return (
    <View>
        {socketCtx.isLoading && (
      <View style={styles.rootContainer}>
        <Text style={styles.message}>{message}</Text>
        <ActivityIndicator size="large" />
      </View>
      )}
    </View>
  );
}

export default React.memo(LoadingOverlay);

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  message: {
    fontSize: 20,
    color: ColorsBlue.blue200,
    textAlign: 'center',
    marginBottom: 12,
  },
});

