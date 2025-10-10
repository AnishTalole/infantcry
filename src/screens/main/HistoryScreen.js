import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '../../components/BottomNavbar';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, PLACEHOLDER_ICON } from '../../theme/styles';

const { width } = Dimensions.get('window');

const CRY_TYPES = {
    "Discomfort": COLORS.secondaryPink,
    "Hunger": COLORS.primaryOrange,
    "Tired": COLORS.cardYellow,
    "Belly Pain": COLORS.cardPurple,
    "Burping": COLORS.cardGreen,
};

const HistoryScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [historyItems, setHistoryItems] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId'); // Ensure userId is stored

        if (!token || !userId) {
          Alert.alert('Error', 'Missing token or user ID');
          setLoading(false);
          return;
        }

        const response = await fetch(`https://grand-prosperity-production.up.railway.app/api/predictions/history/${userId}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch history');

        const data = await response.json();
        const historyData = data[0]?.history || [];
        const statsData = data[0]?.stats || {};

        // Map API response to match current UI structure
        const processedHistory = historyData.map((item, index) => ({
          id: index + 1,
          reason: item.predictedReason.charAt(0).toUpperCase() + item.predictedReason.slice(1),
          time: new Date(item.dateTime).toLocaleString(),
          color: CRY_TYPES[item.predictedReason.charAt(0).toUpperCase() + item.predictedReason.slice(1)] || COLORS.cardYellow,
          confidence: item.confidenceScore,
          predictionId: item.predictionId || null, // if API provides
        }));

        setHistoryItems(processedHistory);
        setStats(statsData);
      } catch (error) {
        console.log('Error fetching history:', error);
        Alert.alert('Error', 'Could not fetch history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const chartData = useMemo(() => {
    const counts = historyItems.reduce((acc, item) => {
        acc[item.reason] = (acc[item.reason] || 0) + 1;
        return acc;
    }, {});

    const totalCount = historyItems.length;

    return Object.entries(CRY_TYPES).map(([reason, color]) => {
        const count = counts[reason] || 0;
        const rawPercentage = totalCount > 0 ? (count / totalCount) : 0;
        return { label: reason, count, percentage: rawPercentage * 100, iconColor: color };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [historyItems]);

  const HistoryItem = ({ label, time, iconColor, confidence, itemData }) => (
    <TouchableOpacity 
      style={styles.historyItem} 
      onPress={() => navigation.navigate('Remedy', { predictionId: itemData.predictionId, primaryLabel: label })} 
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: PLACEHOLDER_ICON(iconColor) }} style={styles.smallIcon} />
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
      <CustomHeader title="History" navigation={navigation} />
      <ScrollView contentContainerStyle={localStyles.scrollContent}>
        
        {/* Period Selector */}
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

        {/* Charts */}
        <Card style={styles.chartCard}>
          <Text style={localStyles.chartTitle}>Cry Distribution ({selectedPeriod})</Text>
          <View style={styles.barChartContainer}>
            {chartData.filter(item => item.count > 0).map((item, index) => (
              <View key={index} style={localStyles.barWrapper}>
                <View style={styles.barOuter}>
                  <View style={[styles.barInner, { height: `${Math.max(5, item.percentage)}%`, backgroundColor: item.iconColor }]} />
                </View>
                <Text style={styles.barLabel}>{item.percentage.toFixed(0)}%</Text>
                <Text style={[localStyles.reasonLabel, { color: item.iconColor, fontSize: item.label.length > 10 ? 9 : 10 }]}>{item.label}</Text>
                <Image source={{ uri: PLACEHOLDER_ICON(item.iconColor) }} style={styles.barIcon} />
              </View>
            ))}
          </View>
        </Card>

        <Text style={styles.sectionHeader}>Translates</Text>
        
        <View>
          {historyItems.map(item => (
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

const localStyles = StyleSheet.create({
  scrollContent: { paddingBottom: 90, paddingHorizontal: 20 },
  chartTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textDark, marginBottom: 10, paddingHorizontal: 10 },
  barWrapper: { alignItems: 'center', height: '100%', justifyContent: 'flex-end', width: (width - 40 - 20) / 6 },
  reasonLabel: { textAlign: 'center', fontWeight: '600', marginTop: 2, marginBottom: 5, width: '100%' },
});

export default HistoryScreen;
