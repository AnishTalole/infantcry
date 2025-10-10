import React, { useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../components/CustomHeader';
import PrimaryButton from '../../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import BottomNavbar from '../../components/BottomNavbar';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS } from '../../theme/styles';

const FeedbackScreen = ({ navigation }) => {
  const [rating, setRating] = useState(0); 
  const [usefulness, setUsefulness] = useState(null); 
  const [comment, setComment] = useState('');
  const [currentRoute, setCurrentRoute] = useState('Feedback'); 

  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setCurrentRoute(routeName);
    }, [navigation])
  );

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const predictionId = await AsyncStorage.getItem('predictionId');

      if (!predictionId || !token) {
        Alert.alert('Error', 'Missing token or prediction ID');
        return;
      }

      if (!usefulness && rating === 0) {
        Alert.alert("Required", "Please select if the result was useful or provide a star rating.");
        return;
      }

      const feedbackData = {
        feedback: usefulness ? usefulness.toUpperCase() : 'USEFUL',
        comments: comment,
        rating: rating,
      };

      const response = await fetch(`https://grand-prosperity-production.up.railway.app/api/feedback/${predictionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');

      Alert.alert(
        "Thank You!",
        "Your feedback has been recorded.",
        [{ text: "OK", onPress: () => navigation.navigate('Home') }]
      );

    } catch (error) {
      console.log('Feedback error:', error);
      Alert.alert('Error', 'Could not submit feedback');
    }
  };

  const SelectionButton = ({ label, value, iconName, color }) => (
    <TouchableOpacity 
      style={[
        localStyles.selectionButton,
        usefulness === value && { borderColor: color, borderWidth: 2, backgroundColor: `${color}20` } 
      ]} 
      onPress={() => setUsefulness(value)}
    >
      <Ionicons name={iconName} size={24} color={usefulness === value ? color : COLORS.textGray} />
      <Text style={[localStyles.selectionButtonText, { color: usefulness === value ? color : COLORS.textDark }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Feedback" navigation={navigation} />
      <ScrollView contentContainerStyle={localStyles.scrollContent}>
        <Text style={styles.feedbackQuestion}>Was this prediction useful?</Text>
        <View style={localStyles.selectionContainer}>
          <SelectionButton label="Useful" value="useful" iconName="checkmark-circle-sharp" color={COLORS.cardGreen} />
          <SelectionButton label="Not Useful" value="not_useful" iconName="close-circle-sharp" color={COLORS.secondaryPink} />
        </View>

        <Text style={styles.feedbackQuestion}>Rate the accuracy of the result:</Text>
        <View style={styles.starRatingContainer}>
          {[1,2,3,4,5].map(star => (
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

        <Text style={styles.commentHeader}>Comment (Optional)</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Help us improve..."
          placeholderTextColor={COLORS.textGray}
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
        />

        <PrimaryButton title="SUBMIT" onPress={handleSubmit} style={{ marginTop: 40 }} />
      </ScrollView>
      <BottomNavbar navigation={navigation} currentRoute={currentRoute} />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  scrollContent: { paddingBottom: 90, paddingHorizontal: 20 },
  selectionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  selectionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 15, width: '48%', backgroundColor: COLORS.white, borderColor: '#EEEEEE', borderWidth: 1 },
  selectionButtonText: { marginLeft: 8, fontSize: 16, fontWeight: '600' },
});

export default FeedbackScreen;
