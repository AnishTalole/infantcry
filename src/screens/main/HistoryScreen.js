import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import FallbackImage from '../../components/FallbackImage';
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '../../components/BottomNavbar';
import { styles, COLORS, PLACEHOLDER_ICON } from '../../theme/styles';

const { width } = Dimensions.get('window');

const CRY_TYPES = {
  "Hunger": COLORS.primaryOrange,
  "Discomfort": COLORS.secondaryPink,
  "Tired": COLORS.cardYellow,
  "Belly Pain": COLORS.cardPurple,
  "Burping": COLORS.cardGreen,
};

// Helper function to check if a date is within a certain period from now
const isWithinPeriod = (date, period) => {
  const now = new Date();
  const itemDate = new Date(date);
  if (isNaN(itemDate)) return false;

  switch (period) {
    case 'Week':
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      return itemDate >= oneWeekAgo;
    case 'Month':
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      return itemDate >= oneMonthAgo;
    case 'All':
      return true;
    default:
      return true;
  }
};

const HistoryScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');

        if (!token || !userId) {
          Alert.alert('Error', 'Missing token or user ID');
          setLoading(false);
          return;
        }

        const response = await fetch(`https://infant-cry-production.up.railway.app/api/predictions/history/${userId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch history');

        const data = await response.json();
        const historyData = data[0]?.history || [];

        const processedHistory = historyData.map((item, index) => ({
          id: item.predictionId || index + 1,
          reason: item.predictedReason.charAt(0).toUpperCase() + item.predictedReason.slice(1),
          dateTime: item.dateTime,
          time: new Date(item.dateTime).toLocaleString(),
          color: CRY_TYPES[item.predictedReason.charAt(0).toUpperCase() + item.predictedReason.slice(1)] || COLORS.cardYellow,
          confidence: item.confidenceScore,
          predictionId: item.predictionId || null,
        }));
        
        processedHistory.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        setHistoryItems(processedHistory);
      } catch (error) {
        console.log('Error fetching history:', error);
        Alert.alert('Error', 'Could not fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);
  
  const filteredHistoryItems = useMemo(() => {
    if (selectedPeriod === 'All') {
      return historyItems;
    }
    return historyItems.filter(item => isWithinPeriod(item.dateTime, selectedPeriod));
  }, [historyItems, selectedPeriod]);

  const chartData = useMemo(() => {
    if (filteredHistoryItems.length === 0) {
      return [];
    }
    const counts = filteredHistoryItems.reduce((acc, item) => {
      acc[item.reason] = (acc[item.reason] || 0) + 1;
      return acc;
    }, {});
    const totalCount = filteredHistoryItems.length;
    return Object.entries(CRY_TYPES).map(([reason, color]) => {
      const count = counts[reason] || 0;
      const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
      return { 
          label: reason, 
          percentage: percentage, 
          iconColor: color 
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [filteredHistoryItems]);

  const HistoryItem = ({ label, time, iconColor, confidence, itemData }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => navigation.navigate('Remedy', { predictionId: itemData.predictionId, primaryLabel: label })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FallbackImage source={{ uri: PLACEHOLDER_ICON(iconColor) }} style={styles.smallIcon} />
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.historyLabel}>{label}</Text>
          <Text style={styles.historyTime}>{time}</Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: iconColor }}>{confidence.toFixed(0)}%</Text>
        <Ionicons name="arrow-forward" size={20} color={COLORS.textGray} style={{ marginTop: 5 }} />
      </View>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color={COLORS.primaryOrange} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="History"
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
      <ScrollView contentContainerStyle={localStyles.scrollContent}>
        
        <Card style={styles.periodSelectorCard}>
          {['Week', 'Month', 'All'].map(period => (
            <TouchableOpacity
              key={period}
              style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[styles.periodButtonText, selectedPeriod === period && styles.periodButtonTextActive]}>{period}</Text>
            </TouchableOpacity>
          ))}
        </Card>
        
        <Card style={styles.chartCard}>
          <Text style={localStyles.chartTitle}>Cry Distribution ({selectedPeriod})</Text>
          <View style={styles.barChartContainer}>
            {chartData.filter(item => item.percentage > 0).map((item, index) => (
              // --- START: MODIFIED BAR STRUCTURE ---
              <View key={index} style={localStyles.barWrapper}>
                {/* Section 1: The Bar */}
                <View style={localStyles.barContainer}>
                  <View style={[localStyles.barInner, { height: `${item.percentage}%`, backgroundColor: item.iconColor }]} />
                </View>
                {/* Section 2: The Labels */}
                <View style={localStyles.labelContainer}>
                  <Text style={localStyles.barPercentageLabel}>{item.percentage.toFixed(0)}%</Text>
                  <Text style={[localStyles.reasonLabel, { color: item.iconColor }]}>{item.label}</Text>
                  <FallbackImage source={{ uri: PLACEHOLDER_ICON(item.iconColor) }} style={localStyles.barIcon} />
                </View>
              </View>
              // --- END: MODIFIED BAR STRUCTURE ---
            ))}
            {chartData.length === 0 && <Text style={localStyles.noDataText}>No data for this period</Text>}
          </View>
        </Card>

        <Text style={styles.sectionHeader}>Translates ({selectedPeriod})</Text>
        
        <View>
          {filteredHistoryItems.map(item => (
            <HistoryItem
              key={item.id}
              label={item.reason}
              time={item.time}
              iconColor={item.color}
              confidence={item.confidence}
              itemData={item}
            />
          ))}
        </View>
      </ScrollView>
      <BottomNavbar navigation={navigation} />
    </SafeAreaView>
  );
};

// --- START: UPDATED AND NEW STYLES ---
const localStyles = StyleSheet.create({
  scrollContent: { paddingBottom: 90, paddingHorizontal: 20 },
  chartTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textDark, marginBottom: 20, paddingHorizontal: 10 },
  noDataText: { color: COLORS.textGray, fontSize: 16, textAlign: 'center', width: '100%' },

  // New structure for a single bar item
  barWrapper: {
    flex: 1, // Each bar will take equal space
    alignItems: 'center',
  },
  // New container for the visual bar, allows it to grow
  barContainer: {
    flex: 1,
    width: 25,
    backgroundColor: '#F3E9DD',
    borderRadius: 12.5,
    justifyContent: 'flex-end', // Bar grows from the bottom
    overflow: 'hidden',
  },
  // The colored bar itself
  barInner: {
    width: '100%',
  },
  // New container for all the labels below the bar
  labelContainer: {
    alignItems: 'center',
    marginTop: 8, // Space between bar and labels
  },
  barPercentageLabel: {
    fontSize: 12,
    color: COLORS.textDark,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reasonLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  barIcon: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
});
// --- END: UPDATED AND NEW STYLES ---

export default HistoryScreen;