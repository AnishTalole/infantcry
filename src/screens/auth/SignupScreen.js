import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader';
import { styles, PLACEHOLDER_AVATAR, COLORS } from '../../theme/styles';
import { signup } from "../../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

const safeJwtDecode = (token) => {
  if (!token) return {};
  try {
    return jwtDecode(token);
  } catch (e) {
    try {
      return jwtDecode.default ? jwtDecode.default(token) : {};
    } catch (e2) {
      try {
        const parts = token.split('.');
        if (parts.length < 2) return {};
        const payload = parts[1];
        const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
        const decoded = (typeof atob === 'function')
          ? atob(b64 + pad)
          : (typeof Buffer !== 'undefined' ? Buffer.from(b64 + pad, 'base64').toString('utf8') : null);
        if (!decoded) return {};
        try { return JSON.parse(decodeURIComponent(escape(decoded))); } catch (e3) { return {} }
      } catch (err) {
        return {};
      }
    }
  }
};

const SignupScreen = ({ navigation }) => {
  const [parentName, setParentName] = useState('');
  const [babyName, setBabyName] = useState('');
  const [babyDOB, setBabyDOB] = useState('');
  const [babyGender, setBabyGender] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // --- 1. NEW FUNCTION TO AUTO-FORMAT DATE INPUT ---
  const handleDOBChange = (text) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;

    // Add slashes after the day and month
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${formatted.slice(0, 5)}/${formatted.slice(5, 9)}`;
    }

    setBabyDOB(formatted);
  };

  const handleSignup = async () => {
    setError(""); // Clear previous errors

    // --- Validation ---
    if (parentName.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (babyName.trim().length < 2) {
      setError("Please enter a valid Baby Name.");
      return;
    }

    const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dobRegex.test(babyDOB)) {
      setError("Please enter Baby's Date of Birth in DD/MM/YYYY format.");
      return;
    }
    const [day, month, year] = babyDOB.split("/");
    const formattedDOB = `${year}-${month}-${day}`;

    if (!babyGender) {
      setError("Please select your baby's gender.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // --- API Call ---
    try {
      const payload = {
        name: parentName,
        babyName: babyName,
        babyDOB: formattedDOB,
        babyGender: babyGender,
        mobile: `+91${phoneNumber}`,
        email: email,
        password: password,
      };

      const data = await signup(payload);

      await AsyncStorage.setItem("token", data.token);
      const decodedToken = safeJwtDecode(data.token);
      const userId = decodedToken.sub || decodedToken.userId || decodedToken.id || '';
      if (userId) {
        await AsyncStorage.setItem("userId", userId);
      }

      alert("Signup successful!");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      const apiError = error.response?.data?.message || error.response?.data?.error || (typeof error.response?.data === 'string' ? error.response.data : null);
      setError(apiError || "Signup failed. Try again.");
    }
  };

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
    <KeyboardAvoidingView
      style={styles.authContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.authContainer}>
          <CustomHeader title="Sign Up" navigation={navigation} />
          <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.authScrollContent, { paddingBottom: 80 }]} keyboardShouldPersistTaps="handled">

            <Image
              source={{ uri: PLACEHOLDER_AVATAR(COLORS.secondaryPink) }}
              style={styles.authImage}
            />

            <View style={styles.inputGroup}>
          <TextInput
            style={styles.textInput}
            placeholder="Your Name (Parent)"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={parentName}
            onChangeText={setParentName}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Baby's Name"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={babyName}
            onChangeText={setBabyName}
          />
          
          {/* --- 2. UPDATED DOB TEXTINPUT --- */}
          <TextInput
            style={styles.textInput}
            placeholder="Baby's DOB (DD/MM/YYYY)"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={babyDOB}
            onChangeText={handleDOBChange}
            keyboardType="number-pad"
            maxLength={10}
          />

          <Text style={localStyles.genderLabel}>Baby's Gender</Text>
          <View style={localStyles.genderRow}>
            <GenderButton gender="Male" iconName="male" label="Boy" />
            <GenderButton gender="Female" iconName="female" label="Girl" />
            <GenderButton gender="Other" iconName="transgender" label="Other" />
          </View>

          <TextInput
            style={[styles.textInput, { marginTop: 15 }]}
            placeholder="Phone Number"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
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

        {error ? (
          <View style={localStyles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={20} color={COLORS.secondaryPink} />
            <Text style={localStyles.errorText}>{error}</Text>
          </View>
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
  </TouchableWithoutFeedback>
</KeyboardAvoidingView>
  );
};

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
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDEDED',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.secondaryPink,
    width: '100%',
  },
  errorText: {
    color: COLORS.secondaryPink,
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '600',
    flex: 1,
  },
});

export default SignupScreen;