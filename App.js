// App.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// --- IMPORT MODULARIZED COMPONENTS ---
import AppNavigator from './src/navigation/AppNavigator'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 

const COLORS = {
  primaryOrange: '#FF9F4F',
  background: '#FAF5EC', 
};

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // --- LOAD ALL NECESSARY FONTS ---
        // This ensures all icon libraries used across the app (Ionicons, FontAwesome, Feather, etc.) 
        // are fully loaded before the navigator attempts to render them.
        await Font.loadAsync({
          [MaterialCommunityIcons.font.fontFamily]: MaterialCommunityIcons.font.uri, 
          'Ionicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
          'FontAwesome': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf'),
          'Feather': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf'), // Crucial for WelcomeScreen/BottomNavbar
          'MaterialIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
          
          // Add other required fonts here if needed
        });
      } catch (e) {
        console.warn("Font loading error:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <View onLayout={onLayoutRootView} style={styles.loadingContainer} />;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <AppNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background, 
  }
});

export default App;
