// src/components/BottomNavBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// Import COLORS and any necessary layout utilities from your theme
import { COLORS } from '../theme/styles'; // Assuming you define COLORS in src/theme/styles.js

const { width } = Dimensions.get('window');

// Define the navigation items
const navItems = [
  { name: 'Home', route: 'Home', icon: 'home-outline' },
  { name: 'Milestone', route: 'Milestone', icon: 'trophy-outline' },
  // Placeholder for center button (Cry Detector/Record) - This will be the main entry point
  { name: 'Record', route: 'Home', icon: 'microphone', isCenter: true },
  { name: 'History', route: 'History', icon: 'history' },
  { name: 'Profile', route: 'ProfileSetup', icon: 'account-outline' },
];

const BottomNavbar = ({ navigation, currentRoute }) => {

  const navigateTo = (route) => {
    // Only navigate if we are not already on that screen
    if (currentRoute !== route) {
      navigation.navigate(route);
    }
  };

  return (
    <View style={styles.navBar}>
      {navItems.map((item) => {
        const isActive = currentRoute === item.route;
        
        if (item.isCenter) {
          // Special styling for the central recording button
          return (
            <View key={item.name} style={styles.navItemCenterWrapper}>
              <TouchableOpacity style={styles.navCenterCircle} onPress={() => navigateTo(item.route)}>
                <MaterialCommunityIcons name={item.icon} size={35} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          );
        }

        // Standard navigation items
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => navigateTo(item.route)}
          >
            <MaterialCommunityIcons 
              name={item.icon} 
              size={30} 
              color={isActive ? COLORS.primaryOrange : COLORS.textGray} 
            />
            <Text style={isActive ? styles.navTextActive : styles.navText}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// NOTE: We copy the necessary styles here, but for a real app, they should ideally
// be moved to a shared theme/styles file if they aren't already.

const styles = StyleSheet.create({
  // Assuming these colors are consistent
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingBottom: 10, // For the safe area on newer phones
    elevation: 8, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 5,
  },
  navText: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  navTextActive: {
    fontSize: 12,
    color: COLORS.primaryOrange,
    fontWeight: 'bold',
  },
  // Center item wrapper to control position
  navItemCenterWrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: -20, // Lift center item up
  },
  navCenterCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: COLORS.white, // White border to lift it off the bar
  },
});

export default BottomNavbar;
