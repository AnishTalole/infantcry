import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const COLORS = {
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

export const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
  elevation: 5,
};

// Placeholder for custom 3D image assets (Cannot be loaded directly)
export const PLACEHOLDER_AVATAR = (color) => `https://placehold.co/100x100/${color}/FFFFFF?text=3D`;
export const PLACEHOLDER_ICON = (color) => `https://placehold.co/40x40/${color}/FFFFFF?text=Icon`;


export const styles = StyleSheet.create({
  // --- General Styles ---
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
  
  // --- Component Styles ---
  // PrimaryButton
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
  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 15,
    ...SHADOW,
  },
  // CustomHeader
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

  // --- Auth Screen Styles ---
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

  // --- Profile Setup Styles ---
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
    width: (width - 60) / 3,
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

  // --- Welcome Screen Styles ---
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
  
  // --- Prediction Result Styles ---
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

  // --- History Screen Styles ---
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
    backgroundColor: '#F3E9DD',
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

  // --- Milestones Screen Styles ---
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

  // --- Feedback Screen Styles ---
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
