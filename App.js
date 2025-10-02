// App.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// --- IMPORT MODULARIZED COMPONENTS ---
import AppNavigator from './src/navigation/AppNavigator'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Ensure this is imported for the icon font loading

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
        // --- LOAD FONTS ---
        // Load the fonts for the vector icons you are using.
        // We ensure MaterialCommunityIcons font is loaded since it's used heavily.
        await Font.loadAsync({
          // This path loads the MaterialCommunityIcons font file directly from the package.
          [MaterialCommunityIcons.font.fontFamily]: MaterialCommunityIcons.font.uri, 
          'Ionicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
          'FontAwesome': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf'),
          'Feather': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf'),
          'MaterialIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
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
      // Hide the splash screen once the app content has rendered (appIsReady is true)
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    // Return a blank view with the correct background color while fonts load
    return <View onLayout={onLayoutRootView} style={styles.loadingContainer} />;
  }

  // Render the main content
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