import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../theme/styles';

// Import all screens
import {
  LoginScreen,
  SignupScreen,
  ProfileSetupScreen,
  WelcomeScreen,
  HistoryScreen,
  MilestonesScreen,
  PredictionResultScreen,
  FeedbackScreen,
} from '../screens';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Login'}
        screenOptions={{
          headerShown: false, 
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Milestones" component={MilestonesScreen} />
        <Stack.Screen name="PredictionResult" component={PredictionResultScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
