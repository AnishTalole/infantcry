import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { styles, COLORS, PLACEHOLDER_AVATAR } from '../../theme/styles';

const { width } = Dimensions.get('window');

const ProfileSetupScreen = ({ navigation }) => {
  const [selectedAvatar, setSelectedAvatar] = useState('B');
  const [selectedGender, setSelectedGender] = useState('Female');

  const AvatarItem = ({ id, color, isSelected }) => (
    <TouchableOpacity onPress={() => setSelectedAvatar(id)} style={styles.avatarItem}>
      <View style={[styles.avatarFrame, isSelected && styles.avatarSelectedFrame]}>
        <Image
          source={{ uri: PLACEHOLDER_AVATAR(color) }}
          style={styles.avatarImage}
        />
        {isSelected && (
          <View style={styles.avatarCheck}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const GenderItem = ({ gender, iconName }) => (
    <TouchableOpacity
      onPress={() => setSelectedGender(gender)}
      style={[
        styles.genderItem,
        selectedGender === gender && styles.genderSelected
      ]}
    >
      <Ionicons
        name={iconName}
        size={30}
        color={selectedGender === gender ? COLORS.white : COLORS.secondaryPink}
      />
      <Text style={[styles.genderText, selectedGender === gender && { color: COLORS.white }]}>
        {gender}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 50 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.profileTitle}>Create Your Baby's Profile</Text>
          <Text style={styles.profileSubtitle}>Setup to Continue</Text>
        </View>

        <Text style={styles.sectionHeader}>Choose Avatar</Text>
        <View style={styles.avatarRow}>
          <AvatarItem id="A" color="A0C7FF" isSelected={selectedAvatar === 'A'} />
          <AvatarItem id="B" color="FC6C9B" isSelected={selectedAvatar === 'B'} />
          <AvatarItem id="C" color="FFDC7B" isSelected={selectedAvatar === 'C'} />
        </View>

        <TextInput style={styles.textInput} placeholder="Baby Name" placeholderTextColor={styles.textInputPlaceholder.color} />
        
        <View style={[styles.textInput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={styles.textInputPlaceholder}>Tap to Select Baby Age</Text>
          <FontAwesome name="calendar" size={20} color={COLORS.primaryOrange} />
        </View>

        <View style={[styles.textInput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={styles.textInputPlaceholder}>Ethnicity</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color={COLORS.primaryOrange} />
        </View>

        <Text style={styles.sectionHeader}>Select Gender</Text>
        <View style={styles.genderRow}>
          <GenderItem gender="Female" iconName="female-outline" />
          <GenderItem gender="Male" iconName="male-outline" />
          <GenderItem gender="Other" iconName="transgender-outline" />
        </View>

        <PrimaryButton
          title="CONTINUE"
          onPress={() => navigation.navigate('Welcome')}
          style={{ marginTop: 40 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSetupScreen;
