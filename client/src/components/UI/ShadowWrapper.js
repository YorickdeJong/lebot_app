import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

const ShadowWrapper = () => {
  return (
    <Shadow
      sides={['top']}
      corners={['topLeft', 'topRight']}
      radius={RADIUS}
      viewStyle={styles.shadowContainer}>

        <View style={styles.handleContainer}>
            <View style={styles.handle} />
        </View>
        
    </Shadow>
  );
};


export default ShadowWrapper;



const styles = StyleSheet.create({
  shadowContainer: {
    width: '100%',
  },
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 30,
    height: 4,
    backgroundColor: 'gray',
    borderRadius: 4,
  },
});

