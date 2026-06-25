import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, Image, Alert, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from "../../components/PrimaryButton";
import CustomHeader from '../../components/CustomHeader';
import { styles, COLORS } from "../../theme/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../../api/auth";
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

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    // --- Validation ---
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // --- API Call ---
    try {
      const mobileWithCode = `+91${phoneNumber}`;
      const data = await login(mobileWithCode, password);
      if (!data || !data.token) {
        throw new Error('Invalid login response');
      }
      
      await AsyncStorage.setItem("token", data.token);

      const decodedToken = safeJwtDecode(data.token);
      const userId = decodedToken.sub || '';
      await AsyncStorage.setItem("userId", userId);

      Alert.alert("Login Successful");
      navigation.navigate("Home");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      const apiError = err.response?.data?.message || err.response?.data?.error || (typeof err.response?.data === 'string' ? err.response.data : null);
      setError(apiError || "Login failed. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.authContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.authContainer}>
          <CustomHeader title="Login" navigation={navigation} />
          <ScrollView contentContainerStyle={styles.authScrollContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.authTitle}>Welcome Back</Text>
            <Text style={styles.authSubtitle}>Sign in to your Baby Translator account.</Text>

            <Image
              source={require('../../../assets/babyimg.png')}
              style={styles.authImage}
            />

            <View style={styles.inputGroup}>
          <TextInput
            style={styles.textInput}
            placeholder="Phone Number"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
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

        <PrimaryButton title="LOG IN" onPress={handleLogin} style={{ marginTop: 15 }} />

        <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Forgot Password?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  </TouchableWithoutFeedback>
</KeyboardAvoidingView>
  );
};

// --- 3. ADD LOCAL STYLES FOR THE ERROR MESSAGE ---
const localStyles = StyleSheet.create({
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDEDED', // A light pink/red background
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.secondaryPink,
  },
  errorText: {
    color: COLORS.secondaryPink,
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '600',
  },
});

export default LoginScreen;