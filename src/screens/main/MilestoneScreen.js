import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import BottomNavbar from '../../components/BottomNavbar';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, SHADOW } from '../../theme/styles';

const MILESTONES_BY_AGE = {
  '0-2': {
    title: '0-2 Month Baby Milestones',
    description:
      'This early stage is all about bonding, neck control, and first social responses. Babies begin to follow faces, lift their head slightly, and make simple cooing sounds.',
    categories: [
      {
        id: 'social-smiles',
        title: 'Social Smiles',
        shortText: 'First social response',
        content:
          'Your baby starts smiling back at familiar faces and engaging with eye contact. Encourage this by talking and making gentle facial expressions.',
        color: COLORS.white,
        icon: 'heart-outline',
        iconColor: COLORS.cardOrange,
      },
      {
        id: 'head-control',
        title: 'Head Control',
        shortText: 'Strengthening neck muscles',
        content:
          'At this stage, babies gradually learn to lift and hold their head while on their tummy. Tummy time and supervised floor play support this milestone.',
        color: COLORS.cardPurple,
        icon: 'resize-outline',
        iconColor: COLORS.cardPurple,
      },
      {
        id: 'reaching',
        title: 'Reaching & Grasping',
        shortText: 'Hands begin to explore',
        content:
          'Babies start to reach toward objects and gently grasp them. Offer soft toys and contact to help build hand-eye coordination.',
        color: COLORS.cardGreen,
        icon: 'hand-left-outline',
        iconColor: COLORS.cardGreen,
      },
      {
        id: 'cooing',
        title: 'Cooing & Babbling',
        shortText: 'First vocal sounds',
        content:
          'Your baby will experiment with coos and soft babbles. Responding with words and songs helps encourage early speech development.',
        color: COLORS.cardYellow,
        icon: 'mic-outline',
        iconColor: COLORS.cardYellow,
      },
    ],
  },
  '2-4': {
    title: '2-4 Month Baby Milestones',
    description:
      'During this stage, babies begin to show more social interaction, develop stronger motor skills, and start exploring their vocal abilities.',
    categories: [
      {
        id: 'social-smiles',
        title: 'Social Smiles',
        shortText: 'Stronger social connection',
        content:
          'Your baby becomes more responsive to caregivers and may smile more purposefully. Keep playing peek-a-boo and singing to reinforce bonds.',
        color: COLORS.white,
        icon: 'heart-outline',
        iconColor: COLORS.cardOrange,
      },
      {
        id: 'head-control',
        title: 'Improved Head Control',
        shortText: 'More stable posture',
        content:
          'Babies can lift their head higher and hold it for longer periods. Supported sitting and supervised tummy time help strengthen their upper body.',
        color: COLORS.cardPurple,
        icon: 'resize-outline',
        iconColor: COLORS.secondaryPink,
      },
      {
        id: 'reaching',
        title: 'Reaching & Grasping',
        shortText: 'Improved hand use',
        content:
          'Your baby reaches for objects more accurately and may begin to transfer items between hands, which builds coordination and focus.',
        color: COLORS.cardGreen,
        icon: 'hand-left-outline',
        iconColor: COLORS.primaryOrange,
      },
      {
        id: 'babbling',
        title: 'Cooing & Babbling',
        shortText: 'Expressive sounds',
        content:
          'Babbling becomes more frequent and varied. Respond to your baby’s sounds with simple words to reinforce early language skills.',
        color: COLORS.white,
        icon: 'mic-outline',
        iconColor: COLORS.cardPurple,
      },
    ],
  },
  '4-6': {
    title: '4-6 Month Baby Milestones',
    description:
      'Babies now interact more actively, begin rolling, and use their hands to explore textures. This is a major period of motor and vocal growth.',
    categories: [
      {
        id: 'rolling',
        title: 'Rolling Over',
        shortText: 'New movement skills',
        content:
          'Your baby may roll from tummy to back and back to tummy. Keep playtime supervised and encourage movement with toys placed just out of reach.',
        color: COLORS.cardOrange,
        icon: 'repeat-outline',
        iconColor: COLORS.cardOrange,
      },
      {
        id: 'sitting',
        title: 'Sitting With Support',
        shortText: 'Stronger core control',
        content:
          'Babies can sit with support and begin practicing balance. Use cushions and gentle support to build their sitting strength.',
        color: COLORS.cardPurple,
        icon: 'ellipse-outline',
        iconColor: COLORS.secondaryPink,
      },
      {
        id: 'grasping',
        title: 'Grasp & Transfer',
        shortText: 'Hands are more capable',
        content:
          'Your baby will pick up toys and move them between hands. Offer items with different textures to keep their attention.',
        color: COLORS.cardGreen,
        icon: 'cube-outline',
        iconColor: COLORS.cardGreen,
      },
      {
        id: 'babbling',
        title: 'Babbling More',
        shortText: 'Sound play increases',
        content:
          'Babbling becomes richer with lip and tongue movements. Imitate their sounds to encourage more vocal play.',
        color: COLORS.cardYellow,
        icon: 'mic-outline',
        iconColor: COLORS.cardYellow,
      },
    ],
  },
  '6-8': {
    title: '6-8 Month Baby Milestones',
    description:
      'Babies begin exploring their environment with more intention, using sounds and gestures to communicate, and preparing for more advanced movement.',
    categories: [
      {
        id: 'crawling',
        title: 'Crawling Prep',
        shortText: 'Moving more freely',
        content:
          'Your baby may rock on hands and knees and may begin to crawl. Provide safe floor space and encourage reaching for favorite toys.',
        color: COLORS.cardGreen,
        icon: 'walk-outline',
        iconColor: COLORS.cardGreen,
      },
      {
        id: 'exploring',
        title: 'Object Exploration',
        shortText: 'Touches and studies toys',
        content:
          'Babies enjoy exploring toys with hands and mouth. Offer safe objects that encourage grasping and sensory curiosity.',
        color: COLORS.cardOrange,
        icon: 'search-outline',
        iconColor: COLORS.cardOrange,
      },
      {
        id: 'babbling',
        title: 'Babbling Words',
        shortText: 'More speech-like sounds',
        content:
          'Your baby may match sounds to routine words like “mama” or “baba.” Repeat simple phrases and names often to build recognition.',
        color: COLORS.cardPurple,
        icon: 'mic-outline',
        iconColor: COLORS.secondaryPink,
      },
      {
        id: 'interaction',
        title: 'Social Interaction',
        shortText: 'Plays with people',
        content:
          'Babies enjoy games like peek-a-boo and respond to conversations. Make time for face-to-face play to support social growth.',
        color: COLORS.cardYellow,
        icon: 'people-outline',
        iconColor: COLORS.cardYellow,
      },
    ],
  },
  '8-10': {
    title: '8-10 Month Baby Milestones',
    description:
      'Babies become more mobile, curious, and communicative. They may pull to stand, explore independently, and use gestures to express their needs.',
    categories: [
      {
        id: 'standing',
        title: 'Standing Support',
        shortText: 'Leg strength improves',
        content:
          'Your baby may pull up to stand and cruise along furniture. Provide stable support and soft landing spaces for practice.',
        color: COLORS.cardPurple,
        icon: 'barbell-outline',
        iconColor: COLORS.secondaryPink,
      },
      {
        id: 'fine-motor',
        title: 'Fine Motor Play',
        shortText: 'Small hand skills',
        content:
          'Babies use fingers to pick up small toys and explore details. Offer stacking toys and textured objects for finger practice.',
        color: COLORS.cardGreen,
        icon: 'hand-left-outline',
        iconColor: COLORS.cardGreen,
      },
      {
        id: 'response',
        title: 'Responds to Name',
        shortText: 'Listening to language',
        content:
          'Your baby begins to recognize their name and respond to it. Say their name clearly and use it in playful phrases.',
        color: COLORS.cardOrange,
        icon: 'volume-medium-outline',
        iconColor: COLORS.cardOrange,
      },
      {
        id: 'first-words',
        title: 'First Words',
        shortText: 'Early speech appears',
        content:
          'Babies may say simple words or copy sounds. Encourage speech by naming objects and responding to their attempts to talk.',
        color: COLORS.white,
        icon: 'chatbubble-ellipses-outline',
        iconColor: COLORS.cardYellow,
      },
    ],
  },
};

const MilestoneScreen = ({ navigation }) => {
  const [selectedAge, setSelectedAge] = useState('2-4');
  const [selectedCategory, setSelectedCategory] = useState(MILESTONES_BY_AGE['2-4'].categories[0].id);
  const [currentRoute, setCurrentRoute] = useState('Milestones');

  const activeAgeData = MILESTONES_BY_AGE[selectedAge];
  const activeCategory =
    activeAgeData.categories.find((category) => category.id === selectedCategory) ||
    activeAgeData.categories[0];

  useEffect(() => {
    setSelectedCategory(activeAgeData.categories[0].id);
  }, [selectedAge]);

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
      <Text style={[styles.ageButtonText, { color: age === selectedAge ? COLORS.white : COLORS.textDark }]}> {age}</Text>
      <Text style={[styles.ageButtonSubtitle, { color: age === selectedAge ? COLORS.white : COLORS.textGray }]}> Month</Text>
    </TouchableOpacity>
  );

  const CategoryCard = ({ category, active }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(category.id)}
      style={[
        styles.milestoneCard,
        styles.categoryCard,
        active && styles.categoryCardActive,
        { backgroundColor: category.color },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.milestoneTitle}>{category.title}</Text>
        <Text style={styles.categorySubtitle}>{category.shortText}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Milestones" navigation={navigation} />
      <ScrollView contentContainerStyle={[styles.scrollContent, localStyles.scrollContentWithPadding]}>
        <View style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Text style={styles.milestoneIntroTitle}>{activeAgeData.title}</Text>
          <Text style={styles.milestoneIntroText}>{activeAgeData.description}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 40, paddingVertical: 10 }}>
          <AgeButton age="0-2" color={COLORS.cardOrange} />
          <AgeButton age="2-4" color={COLORS.cardPurple} />
          <AgeButton age="4-6" color={COLORS.cardYellow} />
          <AgeButton age="6-8" color={COLORS.cardGreen} />
          <AgeButton age="8-10" color={COLORS.cardOrange} />
        </ScrollView>

        <View style={styles.milestoneGrid}>
          {activeAgeData.categories.map((category) => (
            <CategoryCard key={category.id} category={category} active={category.id === selectedCategory} />
          ))}
        </View>

        <View style={styles.categoryDetailCard}>
          <Text style={styles.categoryDetailTitle}>{activeCategory.title}</Text>
          <Text style={styles.categoryDetailText}>{activeCategory.content}</Text>
        </View>
      </ScrollView>
      <BottomNavbar navigation={navigation} currentRoute={currentRoute} />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  headerWrapper: {
    marginTop: Platform.OS === 'android' ? 20 : 0,
  },
  scrollContentWithPadding: {
    paddingBottom: 90,
    paddingHorizontal: 20,
  },
});

export default MilestoneScreen;
