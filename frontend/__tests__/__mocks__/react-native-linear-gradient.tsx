/**
 * Jest stub for react-native-linear-gradient.
 * Renders children inside a plain View so component trees still render.
 */
import React from 'react';
import { View } from 'react-native';

const LinearGradient = ({ children, style }: any) => (
  <View style={style}>{children}</View>
);

export default LinearGradient;
