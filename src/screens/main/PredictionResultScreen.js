import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
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
  // Support both the older `prediction` param shape and the new API response
  const raw = route.params.prediction || route.params.apiResponse || {};

  const isApiShape = raw && (raw.cry_detected === 0 || raw.cry_detected === 1);
  const cryDetected = isApiShape ? (raw.cry_detected === 1) : true;

  // If API shape (backend sample), derive breakdown from `breakdown` object
  const fullBreakdown = isApiShape
    ? [
        { label: 'Hunger', percentage: (raw.breakdown && raw.breakdown['Hungry']) || 0, color: getColorForReason('hunger') },
        { label: 'Discomfort', percentage: (raw.breakdown && raw.breakdown['Discomfort']) || 0, color: getColorForReason('discomfort') },
        { label: 'Tired', percentage: (raw.breakdown && raw.breakdown['Tired']) || 0, color: getColorForReason('tired') },
        { label: 'Belly Pain', percentage: (raw.breakdown && raw.breakdown['Belly Pain']) || 0, color: getColorForReason('bellypain') },
        { label: 'Burping', percentage: (raw.breakdown && raw.breakdown['Burping']) || 0, color: getColorForReason('burping') },
      ]
    : [
        { label: 'Hunger', percentage: raw.hungerPercentage || 0, color: getColorForReason('hunger') },
        { label: 'Discomfort', percentage: raw.discomfortPercentage || 0, color: getColorForReason('discomfort') },
        { label: 'Tired', percentage: raw.tiredPercentage || 0, color: getColorForReason('tired') },
        { label: 'Belly Pain', percentage: raw.bellyPainPercentage || 0, color: getColorForReason('bellypain') },
        { label: 'Burping', percentage: raw.burpingPercentage || 0, color: getColorForReason('burping') },
      ];

  const mainReason = isApiShape ? (raw.prediction || fullBreakdown[0].label) : (raw.mainReason || fullBreakdown[0].label);
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

  useEffect(() => {
    const savePredictionId = async () => {
      try {
        const id = raw.predictionId || raw.id || '';
        if (id) await AsyncStorage.setItem('predictionId', id.toString());
      } catch (error) {
        console.log('Error saving predictionId:', error);
      }
    };
    savePredictionId();
  }, [raw]);

  const handleGetRemedies = () => {
    navigation.navigate('Remedy', {
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
            <Image source={require('../../../assets/babyimg.png')} style={styles.resultImage} />
            
            {/* --- START: MODIFIED SECTION --- */}
            <PrimaryButton
              title="GIVE FEEDBACK"
              onPress={() => navigation.navigate('Feedback')}
              style={localStyles.feedbackButton}
            />
            {/* --- END: MODIFIED SECTION --- */}

          </View>

          <Card style={styles.predictionDetailCard}>
            {cryDetected ? (
              <>
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
              </>
            ) : (
              // Noise detected layout
              <View style={localStyles.noiseContainer}>
                <Text style={styles.predictionText}>Noise Detected</Text>
                <Text style={localStyles.noiseSubtitle}>Top noises detected in the audio</Text>
                {raw.top_noises && Object.entries(raw.top_noises).map(([label, pct], idx) => (
                  <View key={idx} style={localStyles.noiseRow}>
                    <Text style={localStyles.noiseLabel}>{label}</Text>
                    <Text style={localStyles.noisePercent}>{pct.toFixed ? pct.toFixed(1) : pct}%</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </Card>

        <View style={localStyles.remedyButtonContainer}>
          <PrimaryButton title="VIEW ALL REMEDIES" onPress={handleGetRemedies} style={localStyles.remedyButton} />
        </View>

        <View style={localStyles.breakdownContainer}>
          <Text style={localStyles.breakdownTitle}>Full Prediction Breakdown</Text>
          {fullBreakdown.map((item, index) => (
            <PredictionBar key={index} label={item.label} percentage={item.percentage} iconColor={item.color} />
          ))}
        </View>
      </ScrollView>

      <BottomNavbar navigation={navigation} currentRoute={currentRoute} />
    </SafeAreaView>
  );
};

// --- STYLES MODIFIED HERE ---
const localStyles = StyleSheet.create({
  resultHeader: { alignItems: 'center', marginBottom: 20 },
  feedbackButton: {
    marginTop: 20,
    width: '80%',
    backgroundColor: '#6c757d',
    paddingRight:20,
    paddingLeft:20,
  },
  predictionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  remedyButtonContainer: { paddingHorizontal: 20, marginTop: 30, marginBottom: 10 },
  remedyButton: { backgroundColor: COLORS.secondaryPink },
  breakdownContainer: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 10, backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0', marginTop: 10 },
  breakdownTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, marginBottom: 15 },
  predictionBarContainer: { marginBottom: 15 },
  predictionBarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  barLabel: { fontSize: 16, fontWeight: '600', color: COLORS.textDark },
  barPercent: { fontSize: 16, fontWeight: '700' },
  noiseContainer: { paddingVertical: 10 },
  noiseSubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 6, marginBottom: 10 },
  noiseRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  noiseLabel: { fontSize: 16, color: COLORS.textDark },
  noisePercent: { fontSize: 16, fontWeight: '700', color: COLORS.primaryOrange },
});

export default PredictionResultScreen;