import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Image, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Expo components for font loading
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Vector Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// --- THEME & UTILITIES ---

const COLORS = {
  primaryOrange: '#FF9F4F',
  secondaryPink: '#FC6C9B',
  background: '#FAF5EC', // Light Peach/Beige
  textDark: '#333333',
  textGray: '#777777',
  white: '#FFFFFF',
  cardOrange: '#FF9F4F',
  cardGreen: '#C6EF97',
  cardPurple: '#E7C8F9',
  cardYellow: '#FFDC7B',
};

const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 5,
};

// Placeholder for custom 3D image assets (Cannot be loaded directly)
const PLACEHOLDER_AVATAR = (color) => `https://placehold.co/100x100/${color}/FFFFFF?text=3D`;
const PLACEHOLDER_ICON = (color) => `https://placehold.co/40x40/${color}/FFFFFF?text=Icon`;

// --- CUSTOM COMPONENTS ---

const CustomHeader = ({ title, navigation, showBackButton = true, showRightButton = false, rightIcon = 'arrow-up-circle-outline', onRightPress = () => {} }) => (
  <View style={styles.headerContainer}>
    {showBackButton ? (
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
        <Ionicons name="arrow-back" size={26} color={COLORS.textDark} />
      </TouchableOpacity>
    ) : (
      <View style={styles.headerButton} />
    )}
    <Text style={styles.headerTitle}>{title}</Text>
    {showRightButton ? (
      <TouchableOpacity onPress={onRightPress} style={styles.headerButton}>
        <Ionicons name={rightIcon} size={26} color={COLORS.textDark} />
      </TouchableOpacity>
    ) : (
      <View style={styles.headerButton} />
    )}
  </View>
);

const PrimaryButton = ({ title, onPress, style }) => (
  <TouchableOpacity style={[styles.primaryButton, style]} onPress={onPress}>
    <Text style={styles.primaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

// --- AUTH SCREENS (Custom Design) ---

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScrollContent}>
        <Text style={styles.authTitle}>Welcome Back</Text>
        <Text style={styles.authSubtitle}>Sign in to your Baby Translator account.</Text>

        <Image
          source={{ uri: PLACEHOLDER_AVATAR('FF9F4F') }}
          style={styles.authImage}
        />

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.textInput}
            placeholder="Email Address"
            placeholderTextColor={COLORS.textGray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor={COLORS.textGray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <PrimaryButton
          title="LOG IN"
          onPress={() => navigation.navigate('Welcome')} // Navigate to the main app flow
          style={{ marginTop: 30 }}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Forgot Password?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScrollContent}>
        <Text style={styles.authTitle}>Create Account</Text>
        <Text style={styles.authSubtitle}>Join the community of caring parents.</Text>

        <Image
          source={{ uri: PLACEHOLDER_AVATAR('FC6C9B') }}
          style={styles.authImage}
        />

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.textInput}
            placeholder="Full Name"
            placeholderTextColor={COLORS.textGray}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Email Address"
            placeholderTextColor={COLORS.textGray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor={COLORS.textGray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <PrimaryButton
          title="CREATE ACCOUNT"
          onPress={() => navigation.navigate('ProfileSetup')} // Navigate to profile setup after signup
          style={{ marginTop: 30 }}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- APP FLOW SCREENS ---

// Corresponds to 'Welcome (1).jpg'
const WelcomeScreen = ({ navigation }) => {
  // Assuming this is the main screen after login/onboarding
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bubble Shapes (Simplified) */}
      <View style={{ position: 'absolute', top: 50, left: 20, width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.secondaryPink, opacity: 0.3 }} />
      <View style={{ position: 'absolute', top: 150, right: 40, width: 15, height: 15, borderRadius: 7.5, backgroundColor: COLORS.primaryOrange, opacity: 0.5 }} />

      <View style={styles.welcomeHero}>
        {/* Central Baby Avatar and Orange Circle */}
        <View style={styles.welcomeCircle}>
          <Image
            source={{ uri: PLACEHOLDER_AVATAR('FF9F4F') }} // Placeholder for the 3D baby image
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
          onPress={() => navigation.navigate('PredictionResult')} // Start the main feature
          style={{ width: '90%', marginTop: 40 }}
        />
      </View>
    </SafeAreaView>
  );
};

// Corresponds to 'First Screen.jpg'
const ProfileSetupScreen = ({ navigation }) => {
  const [selectedAvatar, setSelectedAvatar] = useState('B');
  const [selectedGender, setSelectedGender] = useState('Female');

  const AvatarItem = ({ id, color, isSelected }) => (
    <TouchableOpacity onPress={() => setSelectedAvatar(id)} style={styles.avatarItem}>
      <View style={[styles.avatarFrame, isSelected && styles.avatarSelectedFrame]}>
        <Image
          source={{ uri: PLACEHOLDER_AVATAR(color) }}
          style={styles.avatarImage}
        />
        {isSelected && (
          <View style={styles.avatarCheck}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const GenderItem = ({ gender, iconName }) => (
    <TouchableOpacity
      onPress={() => setSelectedGender(gender)}
      style={[
        styles.genderItem,
        selectedGender === gender && styles.genderSelected
      ]}
    >
      <Ionicons
        name={iconName}
        size={30}
        color={selectedGender === gender ? COLORS.white : COLORS.secondaryPink}
      />
      <Text style={[styles.genderText, selectedGender === gender && { color: COLORS.white }]}>
        {gender}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.profileScrollContent}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileTitle}>Create Your Baby's Profile</Text>
          <Text style={styles.profileSubtitle}>Setup to Continue</Text>
        </View>

        <Text style={styles.sectionHeader}>Choose Avatar</Text>
        <View style={styles.avatarRow}>
          <AvatarItem id="A" color="A0C7FF" isSelected={selectedAvatar === 'A'} />
          <AvatarItem id="B" color="FC6C9B" isSelected={selectedAvatar === 'B'} />
          <AvatarItem id="C" color="FFDC7B" isSelected={selectedAvatar === 'C'} />
        </View>

        <TextInput style={styles.textInput} placeholder="Baby Name" placeholderTextColor={COLORS.textGray} />
        
        <View style={[styles.textInput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={styles.textInputPlaceholder}>Tap to Select Baby Age</Text>
          <FontAwesome name="calendar" size={20} color={COLORS.primaryOrange} />
        </View>

        <View style={[styles.textInput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={styles.textInputPlaceholder}>Ethnicity</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color={COLORS.primaryOrange} />
        </View>

        <Text style={styles.sectionHeader}>Select Gender</Text>
        <View style={styles.genderRow}>
          <GenderItem gender="Female" iconName="female-outline" />
          <GenderItem gender="Male" iconName="male-outline" />
          <GenderItem gender="Other" iconName="transgender-outline" />
        </View>

        <PrimaryButton
          title="CONTINUE"
          onPress={() => navigation.navigate('Welcome')}
          style={{ marginTop: 40, marginBottom: 50 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};


// Corresponds to 'Prediction Result.jpg'
const PredictionResultScreen = ({ navigation }) => {
  const RecommendationCard = ({ title, text, iconColor }) => (
    <Card style={{ padding: 20, marginBottom: 15 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: PLACEHOLDER_ICON(iconColor) }} style={{ width: 40, height: 40, borderRadius: 10, marginRight: 15 }} />
        <Text style={styles.recommendationTitle}>{title}</Text>
      </View>
      <Text style={styles.recommendationText}>{text}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 }}>
        <Text style={{ fontSize: 14, color: COLORS.textGray, marginRight: 10 }}>Did it help you?</Text>
        {/* Updated 'Yes' button to navigate to Milestones/Tips, since Feedback is for 'Not Really' */}
        <TouchableOpacity style={styles.feedbackBtn} onPress={() => navigation.navigate('Milestones')}>
          <Text style={styles.feedbackBtnText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.feedbackBtn, { backgroundColor: COLORS.textGray }]} onPress={() => navigation.navigate('Feedback')}>
          <Text style={styles.feedbackBtnText}>Not Really</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Result"
        navigation={navigation}
        showRightButton
        rightIcon="share-outline"
        onRightPress={() => console.log('Share result')}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.resultCard}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Image
              source={{ uri: PLACEHOLDER_AVATAR('8F8F8F') }} // Crying baby placeholder
              style={styles.resultImage}
            />
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity style={[styles.resultActionBtn, { backgroundColor: COLORS.cardGreen }]}>
                <Ionicons name="checkmark-sharp" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.resultActionBtn, { backgroundColor: COLORS.secondaryPink, marginLeft: 20 }]} onPress={() => navigation.navigate('Feedback')}>
                <Ionicons name="close-sharp" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Prediction Detail */}
          <Card style={styles.predictionDetailCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: PLACEHOLDER_ICON('FFDC7B') }} style={styles.smallIcon} />
                <Text style={styles.predictionText}>Sleepy</Text>
              </View>
              <Text style={styles.predictionPercent}>65.7%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: '65.7%' }]} />
            </View>
          </Card>
        </Card>

        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionHeader}>Recommendations</Text>
          <Text style={styles.recommendationsIntro}>
            These tips might help ease your baby! Start with the first one and proceed through the list.
          </Text>
          <RecommendationCard
            title="Kangaroo Care"
            text="Skin-to-skin contact could be beneficial in calming your baby when they're hurting."
            iconColor="FC6C9B"
          />
          <RecommendationCard
            title="Slight Rocking"
            text="Gentle, repetitive motion can soothe a fussy baby and encourage sleep."
            iconColor="A0C7FF"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};


// Corresponds to 'History.jpg'
const HistoryScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  
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
              { value: 0.8, label: 23, iconColor: 'FC6C9B' }, // Cry
              { value: 0.3, label: 1, iconColor: 'E7C8F9' }, // Diaper
              { value: 0.7, label: 12, iconColor: 'FFDC7B' }, // Sleep
              { value: 0.9, label: 23, iconColor: 'A0C7FF' }, // Play
              { value: 0.5, label: 15, iconColor: 'C6EF97' }, // Other
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
          <HistoryItem label="Feeding" time="12 May. 13:24PM" iconColor="FF9F4F" />
          <HistoryItem label="Pain" time="12 May. 13:24PM" iconColor="FC6C9B" />
          <HistoryItem label="Sleepy" time="12 May. 13:24PM" iconColor="FFDC7B" />
          <HistoryItem label="Feeding" time="12 May. 13:24PM" iconColor="FF9F4F" />
          <HistoryItem label="Feeding" time="12 May. 13:24PM" iconColor="FF9F4F" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// Corresponds to 'Milestones General.png'
const MilestonesScreen = ({ navigation }) => {
  const [selectedAge, setSelectedAge] = useState('2-4');

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

  // Updated MilestoneCard to match the image structure better (no text prop needed)
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
        
        <View style={styles.milestoneIntro}>
          <Text style={styles.milestoneIntroTitle}>2-4 Month Baby Milestones</Text>
          <Text style={styles.milestoneIntroText}>
            During this stage, babies begin to show more social interaction, develop stronger motor skills, and start exploring their vocal abilities. Key milestones include smiling in response to familiar faces, improved head control, cooing and babbling, and the ability to reach and grasp objects.
          </Text>
        </View>

        {/* Age Selector Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ageRowScroll} contentContainerStyle={styles.ageRowContainer}>
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
            iconColor="FFDC7B"
          />
          <MilestoneCard
            title="Improved Head Control"
            color={COLORS.cardPurple}
            iconColor="FC6C9B"
          />
          <MilestoneCard
            title="Reaching and Grasping"
            color={COLORS.cardGreen}
            iconColor="FF9F4F"
          />
          <MilestoneCard
            title="Cooing and Babbling"
            color={COLORS.white}
            iconColor="A0C7FF"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


// Corresponds to 'Feedback.jpg'
const FeedbackScreen = ({ navigation }) => {
  const [rating, setRating] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Feedback" navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.feedbackContainer}>
          
          <Image
            source={{ uri: PLACEHOLDER_AVATAR('E7C8F9') }}
            style={styles.feedbackImage}
          />

          <Text style={styles.feedbackQuestion}>How helpful was this result?</Text>
          <Text style={styles.feedbackAppName}>Infant Cry Detector</Text>
          
          {/* Star Rating */}
          <View style={styles.starRatingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <FontAwesome
                  name={star <= rating ? 'star' : 'star-o'}
                  size={40}
                  color={COLORS.cardOrange}
                  style={{ marginHorizontal: 5 }}
                />
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.commentHeader}>Comment</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Add comment here"
            placeholderTextColor={COLORS.textGray}
            multiline
            numberOfLines={4}
          />
          
          <PrimaryButton
            title="SUBMIT"
            onPress={() => navigation.navigate('Welcome')}
            style={{ marginTop: 40 }}
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


// --- MAIN APP NAVIGATION WRAPPER ---

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Login'}
        screenOptions={{
          headerShown: false, 
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Milestones" component={MilestonesScreen} />
        <Stack.Screen name="PredictionResult" component={PredictionResultScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// --- FONT LOADER COMPONENT ---
const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load custom fonts (needed for Vector Icons)
        await Font.loadAsync({
          'Ionicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
          'FontAwesome': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf'),
          'Feather': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf'),
          'MaterialIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
        });
      } catch (e) {
        console.warn("Font loading error:", e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <View onLayout={onLayoutRootView} style={{ flex: 1, backgroundColor: COLORS.background }} />;
  }
  
  return <AppNavigator />;
};

// --- STYLESHEET ---

const styles = StyleSheet.create({
  // General Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 25,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 15,
    ...SHADOW,
  },
  primaryButton: {
    backgroundColor: COLORS.primaryOrange,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    ...SHADOW,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 18,
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 15,
    ...SHADOW,
    shadowOpacity: 0.05,
  },
  textInputPlaceholder: {
    fontSize: 16,
    color: COLORS.textGray,
  },
  
  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  headerButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Auth Screen Styles
  authContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  authScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 80,
    paddingBottom: 50,
  },
  authTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 5,
  },
  authSubtitle: {
    fontSize: 16,
    color: COLORS.textGray,
    marginBottom: 40,
  },
  authImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    marginBottom: 40,
    ...SHADOW,
  },
  inputGroup: {
    width: '100%',
  },
  linkButton: {
    marginTop: 15,
  },
  linkButtonText: {
    color: COLORS.primaryOrange,
    fontSize: 16,
    fontWeight: '600',
  },

  // Welcome Screen (Home) Styles
  welcomeHero: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 60,
  },
  welcomeCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.primaryOrange,
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeAvatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.white,
    position: 'absolute',
    top: 25,
    zIndex: 1,
  },
  welcomeFloatingButton: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOW,
    shadowOpacity: 0.1,
  },
  welcomeFloatingButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  welcomeFooter: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textDark,
    textAlign: 'center',
    lineHeight: 40,
    marginTop: 20,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: COLORS.textGray,
    textAlign: 'center',
    marginTop: 5,
  },
  
  // Profile Setup Styles
  profileScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileHeader: {
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  profileSubtitle: {
    fontSize: 16,
    color: COLORS.textGray,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  avatarItem: {
    alignItems: 'center',
  },
  avatarFrame: {
    padding: 5,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelectedFrame: {
    borderColor: COLORS.primaryOrange,
  },
  avatarImage: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    backgroundColor: COLORS.background,
  },
  avatarCheck: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: COLORS.primaryOrange,
    borderRadius: 12,
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  genderItem: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    width: (width - 60) / 3, // Three items with padding
    paddingVertical: 20,
    alignItems: 'center',
    ...SHADOW,
    shadowOpacity: 0.05,
  },
  genderSelected: {
    backgroundColor: COLORS.primaryOrange,
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondaryPink,
    marginTop: 5,
  },

  // Prediction Result Styles
  resultCard: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  resultImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.white,
    ...SHADOW,
    shadowOpacity: 0.1,
  },
  resultActionBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW,
    shadowOpacity: 0.3,
  },
  predictionDetailCard: {
    width: '100%',
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  smallIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 10,
  },
  predictionText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  predictionPercent: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primaryOrange,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    marginTop: 10,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primaryOrange,
    borderRadius: 4,
  },
  recommendationsSection: {
    marginTop: 10,
  },
  recommendationsIntro: {
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 10,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.textGray,
    marginTop: 5,
  },
  feedbackBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primaryOrange,
    marginLeft: 10,
  },
  feedbackBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // History Screen Styles
  periodSelectorCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primaryOrange,
    ...SHADOW,
    shadowOpacity: 0.2,
  },
  periodButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  periodButtonTextActive: {
    color: COLORS.white,
  },
  chartCard: {
    marginTop: 20,
    paddingVertical: 20,
    height: 250,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 1,
    paddingHorizontal: 10,
  },
  barWrapper: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barOuter: {
    width: 25,
    backgroundColor: '#F3E9DD', // Lighter version of background
    borderRadius: 12.5,
    overflow: 'hidden',
    height: '70%',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  barInner: {
    width: '100%',
    backgroundColor: COLORS.secondaryPink,
    borderRadius: 12.5,
  },
  barLabel: {
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 5,
  },
  barIcon: {
    width: 30,
    height: 30,
    borderRadius: 5,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  historyLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  historyTime: {
    fontSize: 14,
    color: COLORS.textGray,
  },

  // Milestones Screen Styles
  milestoneIntro: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  milestoneIntroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 5,
  },
  milestoneIntroText: {
    fontSize: 14,
    color: COLORS.textGray,
    lineHeight: 20,
  },
  ageRowScroll: {
    marginTop: 20,
    paddingLeft: 20,
  },
  ageRowContainer: {
    paddingRight: 40,
  },
  ageButton: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginRight: 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageButtonText: {
    fontSize: 20,
    fontWeight: '800',
  },
  ageButtonSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  milestoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  milestoneCard: {
    width: '48%',
    height: 150,
    marginBottom: 15,
    padding: 15,
    justifyContent: 'space-between',
    borderRadius: 20,
    ...SHADOW,
    shadowOpacity: 0.1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  milestoneImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },

  // Feedback Screen Styles
  feedbackContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  feedbackImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.white,
    ...SHADOW,
    shadowOpacity: 0.1,
    marginBottom: 30,
  },
  feedbackQuestion: {
    fontSize: 16,
    color: COLORS.textGray,
  },
  feedbackAppName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryOrange,
    marginTop: 5,
    marginBottom: 20,
  },
  starRatingContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  commentHeader: {
    alignSelf: 'flex-start',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 10,
    width: '100%',
  },
  commentInput: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 15,
    fontSize: 16,
    color: COLORS.textDark,
    textAlignVertical: 'top',
    height: 150,
    width: '100%',
    ...SHADOW,
    shadowOpacity: 0.1,
  },
});

export default App;
