import React from 'react';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';


const BlurWrapper = ({ children, intensity, tint, style, customColor }) => {
  return Platform.OS === 'ios' ? (
    <BlurView intensity={intensity} tint = {tint} style={style}>
      {children}
    </BlurView>
  ) : (
        <View 
        style={[style, {backgroundColor: customColor}]}>
            {children}
        </View>
  );
};


export default BlurWrapper;

