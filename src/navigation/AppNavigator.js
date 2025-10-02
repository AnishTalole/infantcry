// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- 1. IMPORT SCREENS ---
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import WelcomeScreen from '../screens/main/WelcomeScreen';
import ProfileSetupScreen from '../screens/main/ProfileSetupScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import MilestoneScreen from '../screens/main/MilestoneScreen'; // Corrected component name to MilestonesScreen
import PredictionResultScreen from '../screens/main/PredictionResultScreen';
import FeedbackScreen from '../screens/main/FeedbackScreen';
import HomeScreen from '../screens/main/HomeScreen'; 

// --- 2. IMPORT THEME/COLORS ---
const COLORS = {
  primaryOrange: '#FF9F4F',
  background: '#FAF5EC',
}; 

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    // NOTE: Removed all whitespace, comments, and empty lines inside the Navigator
    // to avoid the "found ' '" error.
    <Stack.Navigator
      initialRouteName={'Welcome'}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Milestone" component={MilestoneScreen} />
      <Stack.Screen name="PredictionResult" component={PredictionResultScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => (
    <NavigationContainer>
        <MainStack />
    </NavigationContainer>
);

export default AppNavigator;
