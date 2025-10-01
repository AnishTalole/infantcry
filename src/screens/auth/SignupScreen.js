import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { styles, PLACEHOLDER_AVATAR, COLORS } from '../../theme/styles';

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
            placeholder="Full Name"
            placeholderTextColor={styles.textInputPlaceholder.color}
            value={name}
            onChangeText={setName}
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

        <PrimaryButton
          title="CREATE ACCOUNT"
          onPress={() => navigation.navigate('ProfileSetup')}
          style={{ marginTop: 30 }}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;
