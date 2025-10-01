import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from '../theme/styles';

const PrimaryButton = ({ title, onPress, style }) => (
  <TouchableOpacity style={[styles.primaryButton, style]} onPress={onPress}>
    <Text style={styles.primaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

export default PrimaryButton;
