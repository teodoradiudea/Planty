/**
 * Jest stub for react-native-vector-icons.
 * Matches the wildcard pattern 'react-native-vector-icons/(.*)'.
 * Returns a Text component so icon renders as its name string in tests.
 */
import React from 'react';
import { Text } from 'react-native';

const Icon = ({ name, size, color, style }: any) => (
  <Text style={[{ fontSize: size, color }, style]}>{name}</Text>
);

export default Icon;
