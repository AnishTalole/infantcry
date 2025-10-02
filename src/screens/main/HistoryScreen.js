import React, { useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavbar from '../../components/BottomNavbar';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, PLACEHOLDER_ICON } from '../../theme/styles';

const HistoryScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');

  const [currentRoute, setCurrentRoute] = useState('History'); 
  
  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setCurrentRoute(routeName);
    }, [navigation])
  );
  
  const HistoryItem = ({ label, time, iconColor }) => (
    <TouchableOpacity style={styles.historyItem} onPress={() => navigation.navigate('PredictionResult')}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: PLACEHOLDER_ICON(iconColor) }} style={styles.smallIcon} />
        <View style={{ marginLeft: 15 }}>
          <Text style={styles.historyLabel}>{label}</Text>
          <Text style={styles.historyTime}>{time}</Text>
        </View>
      </View>
      <Ionicons name="arrow-forward" size={20} color={COLORS.textGray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="History" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
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

        {/* Charts/Graphs (Simplified to Colored Bars) */}
        <Card style={styles.chartCard}>
          <View style={styles.barChartContainer}>
            {[
              { value: 0.8, label: 23, iconColor: 'FC6C9B' },
              { value: 0.3, label: 1, iconColor: 'E7C8F9' },
              { value: 0.7, label: 12, iconColor: 'FFDC7B' },
              { value: 0.9, label: 23, iconColor: 'A0C7FF' },
              { value: 0.5, label: 15, iconColor: 'C6EF97' },
            ].map((item, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barOuter}>
                  <View style={[styles.barInner, { height: `${item.value * 100}%` }]} />
                </View>
                <Text style={styles.barLabel}>{item.label}</Text>
                <Image source={{ uri: PLACEHOLDER_ICON(item.iconColor) }} style={styles.barIcon} />
              </View>
            ))}
          </View>
        </Card>

        <Text style={styles.sectionHeader}>Translates</Text>
        
        {/* History List */}
        <View>
          <HistoryItem label="Feeding" time="12 May. 13:24PM" iconColor={COLORS.primaryOrange} />
          <HistoryItem label="Pain" time="12 May. 13:24PM" iconColor={COLORS.secondaryPink} />
          <HistoryItem label="Sleepy" time="12 May. 13:24PM" iconColor={COLORS.cardYellow} />
          <HistoryItem label="Feeding" time="12 May. 13:24PM" iconColor={COLORS.primaryOrange} />
          <HistoryItem label="Feeding" time="12 May. 13:24PM" iconColor={COLORS.primaryOrange} />
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

export default HistoryScreen;
