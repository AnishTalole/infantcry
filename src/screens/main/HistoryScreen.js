import React, { useState, useCallback, useMemo } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavbar from '../../components/BottomNavbar';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, PLACEHOLDER_ICON } from '../../theme/styles';

const { width } = Dimensions.get('window');

// --- MOCK DATA SIMULATION ---
// Ensure all 5 categories are represented in the data for the chart calculation to work.
const MOCK_HISTORY_DATA = [
  { id: 1, reason: "Discomfort", time: "Today, 15:30", color: COLORS.secondaryPink, confidence: 69.29, predictionId: 'pid_1', count: 5 },
  { id: 2, reason: "Hunger", time: "Today, 10:15", color: COLORS.primaryOrange, confidence: 75.12, predictionId: 'pid_2', count: 12 },
  { id: 3, reason: "Tired", time: "Yesterday, 20:00", color: COLORS.cardYellow, confidence: 88.05, predictionId: 'pid_3', count: 23 },
  { id: 4, reason: "Discomfort", time: "12 May. 13:24PM", color: COLORS.secondaryPink, confidence: 55.60, predictionId: 'pid_4', count: 15 },
  { id: 5, reason: "Burping", time: "11 May. 09:00AM", color: COLORS.cardGreen, confidence: 62.40, predictionId: 'pid_5', count: 1 },
  // Adding one for Belly Pain to ensure it's included in the distribution
  { id: 6, reason: "Belly Pain", time: "11 May. 10:00AM", color: COLORS.cardPurple, confidence: 91.00, predictionId: 'pid_6', count: 3 },
];

// UPDATED: Now defines all 5 cry types with their respective colors
const CRY_TYPES = {
    "Discomfort": COLORS.secondaryPink,
    "Hunger": COLORS.primaryOrange,
    "Tired": COLORS.cardYellow,
    "Belly Pain": COLORS.cardPurple, // Using COLORS.cardPurple for Belly Pain
    "Burping": COLORS.cardGreen,      // Using COLORS.cardGreen for Burping
};

const HistoryScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [historyItems, setHistoryItems] = useState(MOCK_HISTORY_DATA); 

  const [currentRoute, setCurrentRoute] = useState('History'); 
  
  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setCurrentRoute(routeName);
    }, [navigation])
  );
  
  // Memoized function to calculate chart data based on the full 5 CRY_TYPES map
  const chartData = useMemo(() => {
    // 1. Count occurrences of each cry type present in the history
    const counts = historyItems.reduce((acc, item) => {
        acc[item.reason] = (acc[item.reason] || 0) + 1;
        return acc;
    }, {});

    const totalCount = historyItems.length;

    // 2. Create the data structure, including all 5 CRY_TYPES, even if count is 0
    return Object.entries(CRY_TYPES).map(([reason, color]) => {
        const count = counts[reason] || 0;
        const percentage = totalCount > 0 ? (count / totalCount) : 0;
        
        return {
            label: reason,
            count: count,
            percentage: percentage, // value between 0 and 1
            iconColor: color,
        };
    }).sort((a, b) => b.count - a.count); // Sort to show most frequent first
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
        <Text style={{ fontSize: 16, fontWeight: '700', color: iconColor }}>
            {confidence.toFixed(0)}%
        </Text>
        <Ionicons name="arrow-forward" size={20} color={COLORS.textGray} style={{ marginTop: 5 }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="History" navigation={navigation} />
      <ScrollView contentContainerStyle={localStyles.scrollContent}>
        
        {/* Period Selector */}
        <Card style={styles.periodSelectorCard}>
          {['Week', 'Month', 'All'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Charts/Graphs (Now dynamic for all 5 types) */}
        <Card style={styles.chartCard}>
          <Text style={localStyles.chartTitle}>Cry Distribution ({selectedPeriod})</Text>
          <View style={styles.barChartContainer}>
            {chartData.map((item, index) => (
              // RENDER: Show all 5 bars, regardless of count, but only show count label if > 0
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barOuter}>
                  <View style={[styles.barInner, { 
                      // Ensure minimum height for visual clarity, otherwise 0% height
                      height: `${item.percentage > 0 ? Math.max(5, item.percentage * 100) : 0}%`, 
                      backgroundColor: item.iconColor 
                  }]} />
                </View>
                {/* Only show the count label if the count is greater than 0 */}
                <Text style={styles.barLabel}>{item.count > 0 ? item.count : ''}</Text>
                {/* Icon represents the cry reason */}
                <Image source={{ uri: PLACEHOLDER_ICON(item.iconColor) }} style={styles.barIcon} />
              </View>
            ))}
          </View>
        </Card>

        <Text style={styles.sectionHeader}>Translates</Text>
        
        {/* History List */}
        <View>
          {historyItems.map((item) => (
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
      <BottomNavbar navigation={navigation} currentRoute={currentRoute} />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 90, 
    paddingHorizontal: 20,
  },
  chartTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.textDark,
      marginBottom: 10,
      paddingHorizontal: 10,
  }
});

export default HistoryScreen;
