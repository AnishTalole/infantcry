import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import { styles, COLORS } from '../../theme/styles';

// Helper component for each remedy
const RemedyDetailCard = ({ label, confidence, immediate, preventive, comfortTip, color }) => (
  <Card style={localRemedyStyles.remedyCard}>
    <View style={localRemedyStyles.headerRow}>
      <Text style={[localRemedyStyles.remedyTitle, { color: color || COLORS.primaryOrange }]}>{label}</Text>
      <Text style={localRemedyStyles.confidenceText}>{confidence}</Text>
    </View>

    <RemedySection title="Immediate Action" text={immediate} color={COLORS.secondaryPink} />
    <RemedySection title="Preventive Measure" text={preventive} color={COLORS.cardGreen} />
    <RemedySection title="Comfort Tip" text={comfortTip} color={COLORS.cardPurple} />
  </Card>
);

const RemedySection = ({ title, text, color }) => (
  <View style={localRemedyStyles.sectionContainer}>
    <Text style={[localRemedyStyles.sectionTitle, { color }]}>{title}</Text>
    <Text style={localRemedyStyles.sectionText}>{text}</Text>
  </View>
);

const RemedyScreen = ({ navigation, route }) => {
  const { primaryLabel } = route.params || { primaryLabel: 'Crying' };
  const [remedies, setRemedies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRemedies = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // User JWT token
        const predictionId = await AsyncStorage.getItem('predictionId'); // Saved ID

        if (!predictionId || !token) {
          Alert.alert('Error', 'Missing token or predictionId');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`https://infant-cry-production.up.railway.app/api/predictions/${predictionId}/remedy`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch remedies');

        const data = await response.json();
        const suggestions = data.suggestions.split('\n\n').slice(1); // Split sections

        const processedRemedies = suggestions.map(section => {
          const lines = section.split('\n');
          const labelMatch = lines[0].match(/(\d+\.\s)(.+?)\s+\(Confidence:\s([\d\.]+)%\)/);

          return {
            label: labelMatch ? labelMatch[2] : 'Unknown',
            confidence: labelMatch ? `${parseFloat(labelMatch[3]).toFixed(2)}%` : '0%',
            immediate: lines.find(l => l.startsWith('Immediate:'))?.replace('Immediate: ', '').trim() || 'N/A',
            preventive: lines.find(l => l.startsWith('Preventive:'))?.replace('Preventive: ', '').trim() || 'N/A',
            comfortTip: lines.find(l => l.startsWith('Comfort tip:'))?.replace('Comfort tip: ', '').trim() || 'N/A',
          };
        }).filter(r => r.confidence !== '0%');

        setRemedies(processedRemedies);
      } catch (error) {
        console.log('Error fetching remedies:', error);
        Alert.alert('Error', 'Could not fetch remedies');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRemedies();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Detailed Remedies"
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
      <ScrollView contentContainerStyle={localRemedyStyles.scrollContent}>
        <Text style={styles.sectionHeader}>Top Cry Analysis</Text>
        <Text style={localRemedyStyles.introText}>
          The initial cry was analyzed as **{primaryLabel}**. Here are the detailed remedies.
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primaryOrange} style={{ marginTop: 50 }} />
        ) : (
          remedies.map((remedy, index) => (
            <RemedyDetailCard
              key={index}
              label={remedy.label}
              confidence={remedy.confidence}
              immediate={remedy.immediate}
              preventive={remedy.preventive}
              comfortTip={remedy.comfortTip}
              color={index === 0 ? COLORS.primaryOrange : COLORS.textDark}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const localRemedyStyles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingBottom: 90 },
  introText: { fontSize: 16, color: COLORS.textGray, marginBottom: 20, paddingHorizontal: 5 },
  remedyCard: { padding: 20, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: COLORS.secondaryPink },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  remedyTitle: { fontSize: 22, fontWeight: '800' },
  confidenceText: { fontSize: 18, fontWeight: '700', color: COLORS.textGray },
  sectionContainer: { marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 5 },
  sectionText: { fontSize: 14, color: COLORS.textDark, lineHeight: 20 },
});

export default RemedyScreen;
