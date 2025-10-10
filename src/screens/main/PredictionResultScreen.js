import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '../../components/BottomNavbar';
import PrimaryButton from '../../components/PrimaryButton';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, PLACEHOLDER_AVATAR, PLACEHOLDER_ICON } from '../../theme/styles';

// Helper component to render a single prediction bar
const PredictionBar = ({ label, percentage, iconColor }) => {
  const safePercentage = Math.min(100, Math.max(0, percentage));
  const progressBarWidth = `${safePercentage}%`;

  return (
    <View style={localStyles.predictionBarContainer}>
      <View style={localStyles.predictionBarHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: PLACEHOLDER_ICON(iconColor) }} style={styles.smallIcon} />
          <Text style={localStyles.barLabel}>{label}</Text>
        </View>
        <Text style={[localStyles.barPercent, { color: iconColor }]}>{safePercentage.toFixed(1)}%</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: progressBarWidth, backgroundColor: iconColor }]} />
      </View>
    </View>
  );
};

const getColorForReason = (reason) => {
  const map = {
    hunger: COLORS.primaryOrange,
    discomfort: COLORS.secondaryPink,
    tired: COLORS.cardYellow,
    bellypain: COLORS.cardPurple,
    burping: COLORS.cardGreen,
  };
  return map[reason.toLowerCase()] || COLORS.cardYellow;
};

const PredictionResultScreen = ({ navigation, route }) => {
  const { prediction } = route.params; // API response from HomeScreen

  const fullBreakdown = [
    { label: 'Hunger', percentage: prediction.hungerPercentage || 0, color: getColorForReason('hunger') },
    { label: 'Discomfort', percentage: prediction.discomfortPercentage || 0, color: getColorForReason('discomfort') },
    { label: 'Tired', percentage: prediction.tiredPercentage || 0, color: getColorForReason('tired') },
    { label: 'Belly Pain', percentage: prediction.bellyPainPercentage || 0, color: getColorForReason('bellypain') },
    { label: 'Burping', percentage: prediction.burpingPercentage || 0, color: getColorForReason('burping') },
  ];

  const mainReason = prediction.mainReason || fullBreakdown[0].label;
  const primaryPrediction = fullBreakdown.find(p => p.label.toLowerCase() === mainReason.toLowerCase()) || fullBreakdown[0];
  const confidencePercent = `${primaryPrediction.percentage.toFixed(1)}%`;
  const progressBarWidth = `${primaryPrediction.percentage}%`;

  const [currentRoute, setCurrentRoute] = useState('PredictionResult');

  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setCurrentRoute(routeName);
    }, [navigation])
  );

  // Save predictionId in AsyncStorage
  useEffect(() => {
    const savePredictionId = async () => {
      try {
        await AsyncStorage.setItem('predictionId', prediction.predictionId.toString());
      } catch (error) {
        console.log('Error saving predictionId:', error);
      }
    };
    savePredictionId();
  }, [prediction.predictionId]);

  const handleGetRemedies = () => {
    navigation.navigate('RemedyScreen', {
      primaryLabel: mainReason,
    });
  };

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
          <View style={localStyles.resultHeader}>
            <Image source={{ uri: PLACEHOLDER_AVATAR('8F8F8F') }} style={styles.resultImage} />
            <View style={localStyles.actionButtons}>
              <TouchableOpacity
                style={[styles.resultActionBtn, { backgroundColor: COLORS.cardGreen }]}
                onPress={() => navigation.navigate('Feedback')}
              >
                <Ionicons name="checkmark-sharp" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.resultActionBtn, { backgroundColor: COLORS.secondaryPink, marginLeft: 20 }]}
                onPress={() => navigation.navigate('Feedback')}
              >
                <Ionicons name="close-sharp" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary Prediction */}
          <Card style={styles.predictionDetailCard}>
            <View style={localStyles.predictionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: PLACEHOLDER_ICON(primaryPrediction.color) }} style={styles.smallIcon} />
                <Text style={styles.predictionText}>{mainReason}</Text>
              </View>
              <Text style={styles.predictionPercent}>{confidencePercent}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: progressBarWidth, backgroundColor: primaryPrediction.color }]} />
            </View>
          </Card>
        </Card>

        {/* Full Breakdown */}
        <View style={localStyles.breakdownContainer}>
          <Text style={localStyles.breakdownTitle}>Full Prediction Breakdown</Text>
          {fullBreakdown.map((item, index) => (
            <PredictionBar key={index} label={item.label} percentage={item.percentage} iconColor={item.color} />
          ))}
        </View>

        {/* Remedies Button */}
        <View style={localStyles.remedyButtonContainer}>
          <PrimaryButton title="VIEW ALL REMEDIES" onPress={handleGetRemedies} style={localStyles.remedyButton} />
        </View>
      </ScrollView>

      <BottomNavbar navigation={navigation} currentRoute={currentRoute} />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  resultHeader: { alignItems: 'center', marginBottom: 20 },
  actionButtons: { flexDirection: 'row', marginTop: 20 },
  predictionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  remedyButtonContainer: { paddingHorizontal: 20, marginTop: 30, marginBottom: 10 },
  remedyButton: { backgroundColor: COLORS.secondaryPink },
  breakdownContainer: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 10, backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0', marginTop: 10 },
  breakdownTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, marginBottom: 15 },
  predictionBarContainer: { marginBottom: 15 },
  predictionBarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  barLabel: { fontSize: 16, fontWeight: '600', color: COLORS.textDark },
  barPercent: { fontSize: 16, fontWeight: '700' },
});

export default PredictionResultScreen;
