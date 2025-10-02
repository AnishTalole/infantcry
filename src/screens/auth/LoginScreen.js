import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { styles, PLACEHOLDER_AVATAR } from '../../theme/styles';

const LoginScreen = ({ navigation }) => {
  // 1. Change state from email to phoneNumber
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold validation error message

  const handleLogin = () => {
    setError(''); // Clear previous error

    // --- 4. Simple Validation Logic ---

    // Simple Phone Number Validation (e.g., must be 10 digits)
    const phoneRegex = /^\d{10}$/; 
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      // You can also use React Native's built-in Alert for a more immediate feedback:
      // Alert.alert('Login Failed', 'Please enter a valid 10-digit phone number.');
      return;
    }

    // Simple Password Validation (e.g., must be at least 6 characters)
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      // Alert.alert('Login Failed', 'Password must be at least 6 characters long.');
      return;
    }

    // If validation passes, navigate to Home
    // In a real app, you would call your API for authentication here
    console.log('Login successful with:', phoneNumber);
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScrollContent}>
        <Text style={styles.authTitle}>Welcome Back</Text>
        <Text style={styles.authSubtitle}>Sign in to your Baby Translator account.</Text>

        <Image
          source={{ uri: PLACEHOLDER_AVATAR('FF9F4F') }}
          style={styles.authImage}
        />

        <View style={styles.inputGroup}>
          {/* 2. Change input for phone number */}
          <TextInput
            style={styles.textInput}
            placeholder="Phone Number" 
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad" // Use phone-pad keyboard
            maxLength={10} // Optional: Limit input to 10 characters
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* 4. Display Error Message */}
        {error ? (
          <Text style={{ color: 'red', marginBottom: 15, fontSize: 14 }}>
            {error}
          </Text>
        ) : null}

        <PrimaryButton
          title="LOG IN"
          // 3. Update onPress to use the new validation function
          onPress={handleLogin}
          style={{ marginTop: 15 }} // Reduced margin since error text is above
        />

        <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Forgot Password?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;                                 