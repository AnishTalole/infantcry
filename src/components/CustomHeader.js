import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles, COLORS } from '../theme/styles';

const CustomHeader = ({ title, navigation, showBackButton = true, showRightButton = false, rightIcon = 'arrow-up-circle-outline', onRightPress = () => {} }) => (
  <View style={styles.headerContainer}>
    {showBackButton ? (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
        <Ionicons name="arrow-back" size={26} color={COLORS.textDark} />
      </TouchableOpacity>
    ) : (
      <View style={styles.headerButton} />
    )}
    <Text style={styles.headerTitle}>{title}</Text>
    {showRightButton ? (
      <TouchableOpacity onPress={onRightPress} style={styles.headerButton}>
        <Ionicons name={rightIcon} size={26} color={COLORS.textDark} />
      </TouchableOpacity>
    ) : (
      <View style={styles.headerButton} />
    )}
  </View>
);

export default CustomHeader;
