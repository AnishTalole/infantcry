import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
// Ensure COLORS is imported from styles for the Image source
import { styles, PLACEHOLDER_AVATAR, COLORS } from '../../theme/styles'; 

const SignupScreen = ({ navigation }) => {
  // UPDATED: Added parentName state
  const [parentName, setParentName] = useState(''); 
  const [babyName, setBabyName] = useState('');
  // NEW: Added babyDOB state
  const [babyDOB, setBabyDOB] = useState(''); 
  const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold validation error message

  const handleSignup = () => {
    setError(''); // Clear previous error

    // --- UPDATED Validation Logic ---

    // 1. Validate Parent Name
    if (parentName.trim().length < 2) {
        setError('Please enter your name.');
        return;
    }

    // 2. Validate Baby Name
    if (babyName.trim().length < 2) {
        setError('Please enter a valid Baby Name.');
        return;
    }

    // 3. Validate Baby DOB (Simple check for non-empty string in DD/MM/YYYY format)
    // NOTE: In a real app, you would use a Date Picker component for better UX/validation.
    const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/; 
    if (!dobRegex.test(babyDOB)) {
        setError('Please enter Baby\'s Date of Birth in DD/MM/YYYY format.');
        return;
    }

    // 4. Validate Phone Number
    const phoneRegex = /^\d{10}$/; 
    if (!phoneRegex.test(phoneNumber)) {
        setError('Please enter a valid 10-digit phone number.');
        return;
    }

    // 5. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }

    // 6. Validate Password
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
          {/* NEW: Parent Name Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Your Name (Parent)"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={parentName}
            onChangeText={setParentName}
          />
          {/* Existing Baby Name Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Baby's Name"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={babyName}
            onChangeText={setBabyName}
          />
          {/* NEW: Baby DOB Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Baby's DOB (DD/MM/YYYY)"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={babyDOB}
            onChangeText={setBabyDOB}
            keyboardType="numeric" 
            maxLength={10} // DD/MM/YYYY is 10 characters
          />
          {/* Existing Phone Number Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Phone Number"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />
          {/* Existing Email Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Email Address"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {/* Existing Password Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Display Error Message */}
        {error ? (
          <Text style={{ color: 'red', marginBottom: 15, fontSize: 14, alignSelf: 'flex-start' }}>
            {error}
          </Text>
        ) : null}

        <PrimaryButton
          title="CREATE ACCOUNT"
          onPress={handleSignup} 
          style={{ marginTop: error ? 5 : 30 }}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;
