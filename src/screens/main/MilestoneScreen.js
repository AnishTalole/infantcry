import React, { useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavbar from '../../components/BottomNavbar';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, SHADOW, PLACEHOLDER_ICON } from '../../theme/styles';

const MilestoneScreen = ({ navigation }) => {
  const [selectedAge, setSelectedAge] = useState('2-4');

  const [currentRoute, setCurrentRoute] = useState('Milestones'); 
  
  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setCurrentRoute(routeName);
    }, [navigation])
  );

  const AgeButton = ({ age, color }) => (
    <TouchableOpacity
      onPress={() => setSelectedAge(age)}
      style={[
        styles.ageButton,
        { backgroundColor: age === selectedAge ? color : COLORS.white },
        age === selectedAge && SHADOW,
      ]}
    >
      <Text style={[styles.ageButtonText, { color: age === selectedAge ? COLORS.white : COLORS.textDark }]}>
        {age}
      </Text>
      <Text style={[styles.ageButtonSubtitle, { color: age === selectedAge ? COLORS.white : COLORS.textGray }]}>
        Month
      </Text>
    </TouchableOpacity>
  );

  const MilestoneCard = ({ title, color, iconColor }) => (
    <Card style={[styles.milestoneCard, { backgroundColor: color }]}>
      <Text style={styles.milestoneTitle}>{title}</Text>
      <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: PLACEHOLDER_ICON(iconColor) }} style={styles.milestoneImage} />
        <Ionicons name="arrow-forward" size={24} color={COLORS.textDark} />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Milestones" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={{ paddingHorizontal: 0, paddingTop: 10, paddingBottom: 10 }}>
          <Text style={styles.milestoneIntroTitle}>2-4 Month Baby Milestones</Text>
          <Text style={styles.milestoneIntroText}>
            During this stage, babies begin to show more social interaction, develop stronger motor skills, and start exploring their vocal abilities. Key milestones include smiling in response to familiar faces, improved head control, cooing and babbling, and the ability to reach and grasp objects.
          </Text>
        </View>

        {/* Age Selector Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 40 }}>
          <AgeButton age="0-2" color={COLORS.cardOrange} />
          <AgeButton age="2-4" color={COLORS.cardPurple} />
          <AgeButton age="4-6" color={COLORS.cardYellow} />
          <AgeButton age="6-8" color={COLORS.cardGreen} />
          <AgeButton age="8-10" color={COLORS.cardOrange} />
        </ScrollView>
        
        {/* Milestones Grid (Simplified to two columns) */}
        <View style={styles.milestoneGrid}>
          <MilestoneCard
            title="Social Smiles"
            color={COLORS.white}
            iconColor={COLORS.cardYellow}
          />
          <MilestoneCard
            title="Improved Head Control"
            color={COLORS.cardPurple}
            iconColor={COLORS.secondaryPink}
          />
          <MilestoneCard
            title="Reaching and Grasping"
            color={COLORS.cardGreen}
            iconColor={COLORS.primaryOrange}
          />
          <MilestoneCard
            title="Cooing and Babbling"
            color={COLORS.white}
            iconColor={COLORS.cardPurple}
          />
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

export default MilestoneScreen;
