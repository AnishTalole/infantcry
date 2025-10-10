import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import { styles, PLACEHOLDER_AVATAR } from "../../theme/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../../api/auth";

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
      const mobileWithCode = `+91${phoneNumber}`; // Add country code
      console.log("Sending login request with:", mobileWithCode, password);

      const data = await login(mobileWithCode, password);

      // Save token for future authenticated requests
      await AsyncStorage.setItem("token", data.token);

      Alert.alert("Login Successful");
      console.log("Token received:", data.token);

      navigation.navigate("Home");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScrollContent}>
        <Text style={styles.authTitle}>Welcome Back</Text>
        <Text style={styles.authSubtitle}>Sign in to your Baby Translator account.</Text>

        <Image
          source={{ uri: PLACEHOLDER_AVATAR("FF9F4F") }}
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
          <Text style={{ color: "red", marginBottom: 15, fontSize: 14 }}>
            {error}
          </Text>
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
  );
};

export default LoginScreen;
