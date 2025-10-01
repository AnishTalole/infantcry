import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import Feather from 'react-native-vector-icons/Feather';
import { styles, COLORS, PLACEHOLDER_AVATAR } from '../../theme/styles';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bubble Shapes (Simplified) */}
      <View style={{ position: 'absolute', top: 50, left: 20, width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.secondaryPink, opacity: 0.3 }} />
      <View style={{ position: 'absolute', top: 150, right: 40, width: 15, height: 15, borderRadius: 7.5, backgroundColor: COLORS.primaryOrange, opacity: 0.5 }} />

      <View style={styles.welcomeHero}>
        {/* Central Baby Avatar and Orange Circle */}
        <View style={styles.welcomeCircle}>
          <Image
            source={{ uri: PLACEHOLDER_AVATAR('FF9F4F') }}
            style={styles.welcomeAvatar}
          />
        </View>

        {/* Buttons around the circle */}
        <TouchableOpacity onPress={() => navigation.navigate('Milestones')} style={[styles.welcomeFloatingButton, { top: 30, right: 30 }]}>
          <Feather name="book-open" size={20} color={COLORS.primaryOrange} />
          <Text style={styles.welcomeFloatingButtonText}>Baby care tips</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('PredictionResult')} style={[styles.welcomeFloatingButton, { top: 100, right: -40 }]}>
          <Feather name="mic" size={20} color={COLORS.secondaryPink} />
          <Text style={styles.welcomeFloatingButtonText}>Cry Translation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('History')} style={[styles.welcomeFloatingButton, { top: 170, left: -40 }]}>
          <Feather name="bar-chart-2" size={20} color={COLORS.secondaryPink} />
          <Text style={styles.welcomeFloatingButtonText}>Cry History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeFooter}>
        <Text style={styles.welcomeTitle}>Infant Cry Detector</Text>
        <Text style={styles.welcomeSubtitle}>Your Baby Translator</Text>
        <PrimaryButton
          title="GET STARTED"
          onPress={() => navigation.navigate('PredictionResult')}
          style={{ width: '90%', marginTop: 40 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
