import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import BottomNavbar from '../../components/BottomNavbar';
import PrimaryButton from '../../components/PrimaryButton';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, PLACEHOLDER_AVATAR, PLACEHOLDER_ICON } from '../../theme/styles';
import FallbackImage from '../../components/FallbackImage';

// Helper component to render a single prediction bar
const PredictionBar = ({ label, percentage, iconColor }) => {
  const safePercentage = Math.min(100, Math.max(0, percentage));
  const progressBarWidth = `${safePercentage}%`;

  return (
    <View style={localStyles.predictionBarContainer}>
      <View style={localStyles.predictionBarHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FallbackImage source={{ uri: PLACEHOLDER_ICON(iconColor) }} style={styles.smallIcon} />
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
  const raw = route?.params?.prediction || route?.params?.apiResponse || route?.params || {};

  const cryDetected = typeof raw.cryDetected !== 'undefined'
    ? Number(raw.cryDetected) === 1
    : typeof raw.cry_detected !== 'undefined'
      ? Number(raw.cry_detected) === 1
      : true;

  const mainReason = raw.mainReason ?? raw.main_reason ?? raw.prediction ?? (cryDetected ? 'Discomfort' : 'Noise Detected');
  const confidenceScore = Number(raw.confidenceScore ?? raw.confidence_score ?? 0);
  const confidencePercent = `${Math.min(100, Math.max(0, confidenceScore)).toFixed(1)}%`;
  const progressBarWidth = `${Math.min(100, Math.max(0, confidenceScore))}%`;

  const fullBreakdown = [
    { label: 'Hunger', percentage: Number(raw.hungerPercentage ?? raw.hunger_percentage ?? 0), color: getColorForReason('hunger') },
    { label: 'Discomfort', percentage: Number(raw.discomfortPercentage ?? raw.discomfort_percentage ?? 0), color: getColorForReason('discomfort') },
    { label: 'Tired', percentage: Number(raw.tiredPercentage ?? raw.tired_percentage ?? 0), color: getColorForReason('tired') },
    { label: 'Belly Pain', percentage: Number(raw.bellyPainPercentage ?? raw.bellyPain_percentage ?? 0), color: getColorForReason('bellypain') },
    { label: 'Burping', percentage: Number(raw.burpingPercentage ?? raw.burping_percentage ?? 0), color: getColorForReason('burping') },
  ];

  const topNoises = raw.topNoises ?? raw.top_noises ?? {};
  const noiseEntries = Object.entries(topNoises);
  const noiseMessage = raw.message ?? 'No baby cry detected in uploaded audio.';

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
            showRightButton={true}
            rightIcon="log-out-outline"
            onRightPress={async () => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: async () => {
                  try { await AsyncStorage.removeItem('token'); await AsyncStorage.removeItem('userId'); } catch (e) { console.warn(e); }
                  navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                } }
              ]);
            }}
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
                    <FallbackImage source={{ uri: PLACEHOLDER_ICON(getColorForReason(mainReason)) }} style={styles.smallIcon} />
                    <Text style={styles.predictionText}>{mainReason}</Text>
                  </View>
                  <Text style={styles.predictionPercent}>{confidencePercent}</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: progressBarWidth, backgroundColor: getColorForReason(mainReason) }]} />
                </View>
                <Text style={localStyles.summaryText}>Prediction confidence and reason for the detected baby cry.</Text>
              </>
            ) : (
              <View style={localStyles.noiseContainer}>
                <View style={localStyles.noiseHeader}>
                  <Text style={styles.predictionText}>{mainReason}</Text>
                  <Text style={localStyles.noiseSubtitle}>{noiseMessage}</Text>
                </View>
                <Text style={localStyles.noiseSectionTitle}>Top Noises Detected</Text>
                {noiseEntries.length > 0 ? (
                  noiseEntries.map(([label, pct], idx) => (
                    <View key={idx} style={localStyles.noiseRow}>
                      <Text style={localStyles.noiseLabel}>{label}</Text>
                      <Text style={localStyles.noisePercent}>{typeof pct === 'number' ? pct.toFixed(1) : pct}%</Text>
                    </View>
                  ))
                ) : (
                  <Text style={localStyles.emptyText}>No top noise breakdown is available for this recording.</Text>
                )}
              </View>
            )}
          </Card>
        </Card>

        <View style={localStyles.remedyButtonContainer}>
          {cryDetected ? (
            <PrimaryButton title="VIEW ALL REMEDIES" onPress={handleGetRemedies} style={localStyles.remedyButton} />
          ) : (
            <PrimaryButton
              title="TRY AGAIN"
              onPress={() => navigation.navigate('Home')}
              style={[localStyles.remedyButton, localStyles.retryButton]}
            />
          )}
        </View>

        {cryDetected && (
          <View style={localStyles.breakdownContainer}>
            <Text style={localStyles.breakdownTitle}>Full Prediction Breakdown</Text>
            {fullBreakdown.map((item, index) => (
              <PredictionBar key={index} label={item.label} percentage={item.percentage} iconColor={item.color} />
            ))}
          </View>
        )}
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
  retryButton: { backgroundColor: COLORS.primaryOrange },
  breakdownContainer: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 10, backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0', marginTop: 10 },
  breakdownTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, marginBottom: 15 },
  predictionBarContainer: { marginBottom: 15 },
  predictionBarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  barLabel: { fontSize: 16, fontWeight: '600', color: COLORS.textDark, flexShrink: 1 },
  barPercent: { fontSize: 16, fontWeight: '700' },
  emptyText: { color: COLORS.textGray, fontSize: 14, paddingVertical: 20 },
  summaryText: { fontSize: 14, color: COLORS.textGray, marginTop: 12 },
  noiseContainer: { paddingVertical: 10 },
  noiseHeader: { marginBottom: 16 },
  noiseSubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 6, marginBottom: 10 },
  noiseSectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark, marginBottom: 12 },
  noiseRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  noiseLabel: { fontSize: 16, color: COLORS.textDark },
  noisePercent: { fontSize: 16, fontWeight: '700', color: COLORS.primaryOrange },
});

export default PredictionResultScreen;