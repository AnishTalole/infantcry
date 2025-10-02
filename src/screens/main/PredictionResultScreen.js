import React, { useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavbar from '../../components/BottomNavbar';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, PLACEHOLDER_AVATAR, PLACEHOLDER_ICON } from '../../theme/styles';


const PredictionResultScreen = ({ navigation }) => {

  const [currentRoute, setCurrentRoute] = useState('PredictionResult'); 
  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setCurrentRoute(routeName);
    }, [navigation])
  );

  const RecommendationCard = ({ title, text, iconColor }) => (
    <Card style={{ padding: 20, marginBottom: 15 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: PLACEHOLDER_ICON(iconColor) }} style={styles.smallIcon} />
        <Text style={styles.recommendationTitle}>{title}</Text>
      </View>
      <Text style={styles.recommendationText}>{text}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 }}>
        <Text style={{ fontSize: 14, color: COLORS.textGray, marginRight: 10 }}>Did it help you?</Text>
        <TouchableOpacity style={styles.feedbackBtn} onPress={() => navigation.navigate('Milestones')}>
          <Text style={styles.feedbackBtnText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.feedbackBtn, { backgroundColor: COLORS.textGray }]} onPress={() => navigation.navigate('Feedback')}>
          <Text style={styles.feedbackBtnText}>Not Really</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Result"
        navigation={navigation}
        showRightButton
        rightIcon="share-outline"
        onRightPress={() => console.log('Share result')}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.resultCard}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Image
              source={{ uri: PLACEHOLDER_AVATAR('8F8F8F') }}
              style={styles.resultImage}
            />
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity style={[styles.resultActionBtn, { backgroundColor: COLORS.cardGreen }]}>
                <Ionicons name="checkmark-sharp" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.resultActionBtn, { backgroundColor: COLORS.secondaryPink, marginLeft: 20 }]} onPress={() => navigation.navigate('Feedback')}>
                <Ionicons name="close-sharp" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Prediction Detail */}
          <Card style={styles.predictionDetailCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: PLACEHOLDER_ICON(COLORS.cardYellow) }} style={styles.smallIcon} />
                <Text style={styles.predictionText}>Sleepy</Text>
              </View>
              <Text style={styles.predictionPercent}>65.7%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '65.7%' }]} />
            </View>
          </Card>
        </Card>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.sectionHeader}>Recommendations</Text>
          <Text style={styles.recommendationsIntro}>
            These tips might help ease your baby! Start with the first one and proceed through the list.
          </Text>
          <RecommendationCard
            title="Kangaroo Care"
            text="Skin-to-skin contact could be beneficial in calming your baby when they're hurting."
            iconColor={COLORS.secondaryPink}
          />
          <RecommendationCard
            title="Slight Rocking"
            text="Gentle, repetitive motion can soothe a fussy baby and encourage sleep."
            iconColor={COLORS.cardPurple}
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

export default PredictionResultScreen;
