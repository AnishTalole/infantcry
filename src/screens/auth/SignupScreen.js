import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
// Ensure COLORS is imported from styles for the Image source
import { styles, PLACEHOLDER_AVATAR, COLORS } from '../../theme/styles'; 

const SignupScreen = ({ navigation }) => {
  // 1. Change state variables to reflect new inputs
  const [babyName, setBabyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold validation error message

  const handleSignup = () => {
    setError(''); // Clear previous error

    // --- 4. Validation Logic ---

    if (babyName.trim().length < 2) {
        setError('Please enter a valid Baby Name.');
        return;
    }

    const phoneRegex = /^\d{10}$/; 
    if (!phoneRegex.test(phoneNumber)) {
        setError('Please enter a valid 10-digit phone number.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }

    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    // If all validations pass, proceed
    console.log('Signup successful. Proceeding to Profile Setup.');
    navigation.navigate('ProfileSetup');
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScrollContent}>
        <Text style={styles.authTitle}>Create Account</Text>
        <Text style={styles.authSubtitle}>Join the community of caring parents.</Text>

        <Image
          source={{ uri: PLACEHOLDER_AVATAR(COLORS.secondaryPink) }}
          style={styles.authImage}
        />

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.textInput}
            placeholder="Baby's Name" // Changed placeholder
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={babyName}
            onChangeText={setBabyName}
          />
          {/* 2. Added phone number input */}
          <TextInput
            style={styles.textInput}
            placeholder="Phone Number"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad" // Set keyboard type for numbers
            maxLength={10} // Limit to 10 digits
          />
          <TextInput
            style={styles.textInput}
            placeholder="Email Address"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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

        {/* 3. Display Error Message */}
        {error ? (
          <Text style={{ color: 'red', marginBottom: 15, fontSize: 14, alignSelf: 'flex-start' }}>
            {error}
          </Text>
        ) : null}

        <PrimaryButton
          title="CREATE ACCOUNT"
          // Updated onPress to use the validation function
          onPress={handleSignup} 
          style={{ marginTop: error ? 5 : 30 }} // Adjust margin based on if error is present
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;