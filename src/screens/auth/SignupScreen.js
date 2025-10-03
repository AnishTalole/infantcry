import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native'; // ADDED: StyleSheet for local styles
import PrimaryButton from '../../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
// Ensure COLORS is imported from styles for the Image source
import { styles, PLACEHOLDER_AVATAR, COLORS } from '../../theme/styles'; 

const SignupScreen = ({ navigation }) => {
  // UPDATED: Added parentName state
  const [parentName, setParentName] = useState(''); 
  const [babyName, setBabyName] = useState('');
  // NEW: Added babyDOB state
  const [babyDOB, setBabyDOB] = useState(''); 
  // NEW: Added babyGender state
  const [babyGender, setBabyGender] = useState(null); // 'Boy' or 'Girl'
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
    const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/; 
    if (!dobRegex.test(babyDOB)) {
        setError('Please enter Baby\'s Date of Birth in DD/MM/YYYY format.');
        return;
    }
    
    // 4. Validate Baby Gender
    if (!babyGender) {
        setError('Please select your baby\'s gender.');
        return;
    }

    // 5. Validate Phone Number
    const phoneRegex = /^\d{10}$/; 
    if (!phoneRegex.test(phoneNumber)) {
        setError('Please enter a valid 10-digit phone number.');
        return;
    }

    // 6. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }

    // 7. Validate Password
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    // If all validations pass, proceed
    console.log('Signup successful. Proceeding to Profile Setup.');
    // Navigating to Home, as ProfileSetup might not be fully configured yet.
    navigation.navigate('Home'); 
  };
  
  // Helper Component for Gender Buttons
  const GenderButton = ({ gender, iconName, label }) => (
    <TouchableOpacity
      style={[
        localStyles.genderButton,
        babyGender === gender && localStyles.genderButtonSelected,
      ]}
      onPress={() => setBabyGender(gender)}
    >
      <Ionicons
        name={iconName}
        size={24}
        color={babyGender === gender ? COLORS.white : COLORS.textGray}
      />
      <Text
        style={[
          localStyles.genderText,
          babyGender === gender && localStyles.genderTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

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
          {/* Parent Name Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Your Name (Parent)"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={parentName}
            onChangeText={setParentName}
          />
          {/* Baby Name Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Baby's Name"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={babyName}
            onChangeText={setBabyName}
          />
          {/* Baby DOB Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Baby's DOB (DD/MM/YYYY)"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={babyDOB}
            onChangeText={setBabyDOB}
            keyboardType="numeric" 
            maxLength={10}
          />
          
          {/* NEW: Baby Gender Selection */}
          <Text style={localStyles.genderLabel}>Baby's Gender</Text>
          <View style={localStyles.genderRow}>
            <GenderButton gender="Boy" iconName="male" label="Boy" />
            <GenderButton gender="Girl" iconName="female" label="Girl" />
            <GenderButton gender="Other" iconName="transgender" label="Other" />
          </View>
          
          {/* Existing Phone Number Input */}
          <TextInput
            style={[styles.textInput, { marginTop: 15 }]} // Add margin to separate from gender buttons
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

// Local styles for Gender component
const localStyles = StyleSheet.create({
    genderLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textDark,
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginLeft: 5,
    },
    genderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    genderButton: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    genderButtonSelected: {
        backgroundColor: COLORS.primaryOrange,
        borderColor: COLORS.primaryOrange,
        shadowColor: COLORS.primaryOrange,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    genderText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textGray,
        marginTop: 5,
    },
    genderTextSelected: {
        color: COLORS.white,
    }
});

export default SignupScreen;
