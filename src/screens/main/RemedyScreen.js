import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { styles, COLORS } from '../../theme/styles';

// Helper component for each remedy
const RemedyDetailCard = ({ label, confidence, immediate, preventive, comfortTip, color }) => (
  <Card style={[localRemedyStyles.remedyCard, { borderLeftColor: color || COLORS.primaryOrange }] }>
    <View style={localRemedyStyles.headerRow}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="medkit-outline" size={22} color={color || COLORS.primaryOrange} style={{ marginRight: 10 }} />
        <Text style={[localRemedyStyles.remedyTitle, { color: color || COLORS.primaryOrange }]}>{label}</Text>
      </View>

      <View style={[localRemedyStyles.confidenceBadge, { backgroundColor: (color || COLORS.primaryOrange) + '20' }]}>
        <Text style={[localRemedyStyles.confidenceBadgeText, { color: color || COLORS.primaryOrange }]}>{confidence}</Text>
      </View>
    </View>

    <RemedySection title="Immediate Action" text={immediate} color={COLORS.secondaryPink} icon="flash-outline" />
    <RemedySection title="Preventive Measure" text={preventive} color={COLORS.cardGreen} icon="shield-checkmark-outline" />
    <RemedySection title="Comfort Tip" text={comfortTip} color={COLORS.cardPurple} icon="heart-outline" />
  </Card>
);

const RemedySection = ({ title, text, color, icon }) => (
  <View style={[localRemedyStyles.sectionContainer, { borderColor: color + '20' }]}> 
    <View style={localRemedyStyles.sectionHeader}> 
      <Ionicons name={icon || 'information-circle-outline'} size={18} color={color} style={{ marginRight: 8 }} />
      <Text style={[localRemedyStyles.sectionTitle, { color }]}>{title}</Text>
    </View>
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
          The initial cry was analyzed as <Text style={localRemedyStyles.highlight}>{primaryLabel}</Text>. Here are the detailed remedies.
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
  highlight: { fontWeight: '800', color: COLORS.primaryOrange },
  remedyCard: { padding: 18, marginBottom: 18, borderLeftWidth: 6, borderRadius: 12, backgroundColor: COLORS.white, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  remedyTitle: { fontSize: 20, fontWeight: '800' },
  confidenceText: { fontSize: 14, fontWeight: '700', color: COLORS.textGray },
  confidenceBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  confidenceBadgeText: { fontSize: 13, fontWeight: '700' },
  sectionContainer: { marginBottom: 14, padding: 12, borderRadius: 10, borderWidth: 1, backgroundColor: '#FAFAFB' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  sectionText: { fontSize: 14, color: COLORS.textDark, lineHeight: 20 },
});

export default RemedyScreen;
