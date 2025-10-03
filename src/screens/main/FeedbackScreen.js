import React, { useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import PrimaryButton from '../../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; // RE-ADDED: For star rating
import BottomNavbar from '../../components/BottomNavbar';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, PLACEHOLDER_AVATAR } from '../../theme/styles';

const FeedbackScreen = ({ navigation }) => {
  // RE-ADDED: State for 5-star rating
  const [rating, setRating] = useState(0); 
  // Existing state for binary usefulness and comment
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
    console.log('Feedback submitted:', { rating, usefulness, comment });
    
    // Simple validation (can be adjusted: require usefulness OR rating, etc.)
    if (!usefulness && rating === 0) {
        Alert.alert("Required", "Please select if the result was useful or provide a star rating.");
        return;
    }

    // Pop-up alert after successful submission
    Alert.alert(
      "Thank You!",
      "Your response has been recorded.",
      [
        { 
          text: "OK", 
          onPress: () => navigation.navigate('Home') 
        }
      ]
    );
  };

  // Helper component for the Useful/Not Useful buttons
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

          {/* Section 1: Binary Usefulness Check */}
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

          {/* Section 2: 5-Star Rating (RE-ADDED) */}
          <Text style={styles.feedbackQuestion}>Rate the accuracy of the result:</Text>
          <View style={styles.starRatingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <FontAwesome
                  name={star <= rating ? 'star' : 'star-o'}
                  size={40}
                  color={COLORS.cardOrange}
                  style={{ marginHorizontal: 5 }}
                />
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Section 3: Comment Input */}
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

// Local styles (Adjusted margins/layout slightly for the new content arrangement)
const localStyles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 90,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 40, // Reduced space here since star rating is next
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
