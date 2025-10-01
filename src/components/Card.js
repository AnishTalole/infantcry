import React from 'react';
import { View } from 'react-native';
import { styles } from '../theme/styles';

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export default Card;
