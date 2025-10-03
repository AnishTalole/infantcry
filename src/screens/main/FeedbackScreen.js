import React, { useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native'; // ADDED: Alert
import CustomHeader from '../../components/CustomHeader';
import PrimaryButton from '../../components/PrimaryButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavbar from '../../components/BottomNavbar';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, PLACEHOLDER_AVATAR } from '../../theme/styles';

const FeedbackScreen = ({ navigation }) => {
  const [usefulness, setUsefulness] = useState(null); // 'useful', 'not_useful', or null
  const [comment, setComment] = useState('');
  
  const [currentRoute, setCurrentRoute] = useState('Feedback'); 
  
  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setCurrentRoute(routeName);
    }, [navigation])
  );

  const handleSubmit = () => {
    console.log('Feedback submitted:', { usefulness, comment });
    
    // Simple validation
    if (!usefulness) {
        Alert.alert("Required", "Please select if the result was useful or not useful.");
        return;
    }

    // --- ADDED: Pop-up alert after successful submission ---
    Alert.alert(
      "Thank You!",
      "Your response has been recorded.",
      [
        { 
          text: "OK", 
          // Navigate only after the user dismisses the alert
          onPress: () => navigation.navigate('Home') 
        }
      ]
    );
    // --- END ADDED ---
  };

  // Helper component for the Useful/Not Useful buttons (Unchanged)
  const SelectionButton = ({ label, value, iconName, color }) => (
    <TouchableOpacity 
      style={[
        localStyles.selectionButton,
        usefulness === value && { 
            borderColor: color, 
            borderWidth: 2, 
            backgroundColor: `${color}20`,
        } 
      ]} 
      onPress={() => setUsefulness(value)}
    >
      <Ionicons 
        name={iconName} 
        size={24} 
        color={usefulness === value ? color : COLORS.textGray} 
      />
      <Text style={[localStyles.selectionButtonText, { color: usefulness === value ? color : COLORS.textDark }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Feedback" navigation={navigation} />
      <ScrollView contentContainerStyle={localStyles.scrollContent}>
        <View style={styles.feedbackContainer}>
          
          <Image
            source={{ uri: PLACEHOLDER_AVATAR(COLORS.cardPurple) }}
            style={styles.feedbackImage}
          />

          <Text style={styles.feedbackQuestion}>Was this prediction useful?</Text> 
          <Text style={styles.feedbackAppName}>Infant Cry Detector</Text>
          
          <View style={localStyles.selectionContainer}>
            <SelectionButton 
              label="Useful" 
              value="useful" 
              iconName="checkmark-circle-sharp" 
              color={COLORS.cardGreen} 
            />
            <SelectionButton 
              label="Not Useful" 
              value="not_useful" 
              iconName="close-circle-sharp" 
              color={COLORS.secondaryPink} 
            />
          </View>
          
          <Text style={styles.commentHeader}>Comment (Optional)</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Help us improve by providing details..."
            placeholderTextColor={COLORS.textGray}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />
          
          <PrimaryButton
            title="SUBMIT"
            onPress={handleSubmit}
            style={{ marginTop: 40 }}
          />

        </View>
      </ScrollView>
      <BottomNavbar navigation={navigation} currentRoute={currentRoute} />
    </SafeAreaView>
  );
};

// Local styles (Unchanged)
const localStyles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 90,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 40,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    width: '48%',
    backgroundColor: COLORS.white,
    borderColor: '#EEEEEE', 
    borderWidth: 1,
  },
  selectionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  }
});

export default FeedbackScreen;