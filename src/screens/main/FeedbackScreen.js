import React, { useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import PrimaryButton from '../../components/PrimaryButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BottomNavbar from '../../components/BottomNavbar';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, PLACEHOLDER_AVATAR } from '../../theme/styles';

const FeedbackScreen = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [currentRoute, setCurrentRoute] = useState('Feedback'); 
  
  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setCurrentRoute(routeName);
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Feedback" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.feedbackContainer}>
          
          <Image
            source={{ uri: PLACEHOLDER_AVATAR(COLORS.cardPurple) }}
            style={styles.feedbackImage}
          />

          <Text style={styles.feedbackQuestion}>How helpful was this result?</Text>
          <Text style={styles.feedbackAppName}>Infant Cry Detector</Text>
          
          {/* Star Rating */}
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
          
          <Text style={styles.commentHeader}>Comment</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Add comment here"
            placeholderTextColor={COLORS.textGray}
            multiline
            numberOfLines={4}
          />
          
          <PrimaryButton
            title="SUBMIT"
            onPress={() => navigation.navigate('Welcome')}
            style={{ marginTop: 40 }}
          />

        </View>
      </ScrollView>
      <BottomNavbar navigation={navigation} currentRoute={currentRoute} />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  scrollPadding: {
    paddingBottom: 90, // Match the height of the fixed navigation bar
  },
});

export default FeedbackScreen;
