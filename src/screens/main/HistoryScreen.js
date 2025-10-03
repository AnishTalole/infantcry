import React, { useState, useCallback, useMemo } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '../../components/BottomNavbar';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, PLACEHOLDER_ICON } from '../../theme/styles';

const { width } = Dimensions.get('window');

// --- MOCK DATA SIMULATION ---
const MOCK_HISTORY_DATA = [
  { id: 1, reason: "Discomfort", time: "Today, 15:30", color: COLORS.secondaryPink, confidence: 69.29, predictionId: 'pid_1', count: 5 },
  { id: 2, reason: "Hunger", time: "Today, 10:15", color: COLORS.primaryOrange, confidence: 75.12, predictionId: 'pid_2', count: 12 },
  { id: 3, reason: "Tired", time: "Yesterday, 20:00", color: COLORS.cardYellow, confidence: 88.05, predictionId: 'pid_3', count: 23 },
  { id: 4, reason: "Discomfort", time: "12 May. 13:24PM", color: COLORS.secondaryPink, confidence: 55.60, predictionId: 'pid_4', count: 15 },
  { id: 5, reason: "Burping", time: "11 May. 09:00AM", color: COLORS.cardGreen, confidence: 62.40, predictionId: 'pid_5', count: 1 },
  { id: 6, reason: "Belly Pain", time: "11 May. 10:00AM", color: COLORS.cardPurple, confidence: 91.00, predictionId: 'pid_6', count: 3 },
];

// All 5 cry types defined
const CRY_TYPES = {
    "Discomfort": COLORS.secondaryPink,
    "Hunger": COLORS.primaryOrange,
    "Tired": COLORS.cardYellow,
    "Belly Pain": COLORS.cardPurple,
    "Burping": COLORS.cardGreen,
};

const HistoryScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [historyItems, setHistoryItems] = useState(MOCK_HISTORY_DATA); 

  // UPDATED: Calculation now creates a percentage distribution of cry types
  const chartData = useMemo(() => {
    // 1. Count occurrences of each cry type
    const counts = historyItems.reduce((acc, item) => {
        acc[item.reason] = (acc[item.reason] || 0) + 1;
        return acc;
    }, {});

    const totalCount = historyItems.length;

    // 2. Create the data structure, calculating the percentage for each type
    return Object.entries(CRY_TYPES).map(([reason, color]) => {
        const count = counts[reason] || 0;
        // Percentage of total occurrences (0 to 1)
        const rawPercentage = totalCount > 0 ? (count / totalCount) : 0;
        
        return {
            label: reason,
            count: count,
            percentage: rawPercentage * 100, // Storing 0 to 100 for easy use in UI
            iconColor: color,
        };
    }).sort((a, b) => b.percentage - a.percentage); // Sort by percentage descending
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

        {/* Charts/Graphs (Now showing percentage and label) */}
        <Card style={styles.chartCard}>
          <Text style={localStyles.chartTitle}>Cry Distribution ({selectedPeriod})</Text>
          <View style={styles.barChartContainer}>
            {/* Filter to only show cry types that occurred at least once for cleaner visualization */}
            {chartData.filter(item => item.count > 0).map((item, index) => (
              <View key={index} style={localStyles.barWrapper}>
                <View style={styles.barOuter}>
                  <View style={[styles.barInner, { 
                      // Bar height is based on percentage (0-100)
                      height: `${Math.max(5, item.percentage)}%`, 
                      backgroundColor: item.iconColor 
                  }]} />
                </View>
                
                {/* Show Percentage as Label */}
                <Text style={styles.barLabel}>{item.percentage.toFixed(0)}%</Text>
                
                {/* NEW: Show the cry reason label below the percentage */}
                <Text 
                    style={[
                        localStyles.reasonLabel, 
                        { color: item.iconColor, fontSize: item.label.length > 10 ? 9 : 10 } // Shrink font for long labels like 'Belly Pain'
                    ]}
                >
                    {item.label}
                </Text>

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
      {/* UPDATED: Removed currentRoute prop */}
      <BottomNavbar navigation={navigation} />
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
  },
  // ADJUSTED: Replicate styles.barWrapper to add space for the new label
  barWrapper: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    width: (width - 40 - 20) / 6, // Distribute width evenly for all bars
  },
  reasonLabel: {
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 5, // Push icon down slightly
    width: '100%',
  }
});

export default HistoryScreen;
