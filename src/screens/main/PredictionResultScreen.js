import React, { useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '../../components/BottomNavbar';
import PrimaryButton from '../../components/PrimaryButton'; // Import PrimaryButton
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, PLACEHOLDER_AVATAR, PLACEHOLDER_ICON } from '../../theme/styles';


// Helper component to render a single prediction bar
const PredictionBar = ({ label, percentage, iconColor }) => {
    // Ensure percentage is between 0 and 100
    const safePercentage = Math.min(100, Math.max(0, percentage));
    const progressBarWidth = `${safePercentage}%`;

    return (
        <View style={localStyles.predictionBarContainer}>
            <View style={localStyles.predictionBarHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: PLACEHOLDER_ICON(iconColor) }} style={styles.smallIcon} />
                    <Text style={localStyles.barLabel}>{label}</Text>
                </View>
                <Text style={[localStyles.barPercent, { color: iconColor }]}>{safePercentage.toFixed(1)}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: progressBarWidth, backgroundColor: iconColor }]} />
            </View>
        </View>
    );
};


const PredictionResultScreen = ({ navigation, route }) => {

    // --- MOCK/DYNAMIC DATA SETUP ---
    const predictionData = {
        label: 'Sleepy',
        confidence: 65.7, // Primary confidence score
        iconColor: COLORS.cardYellow,
        // NEW: Full breakdown based on API structure
        fullBreakdown: [
            { label: 'Tired', percentage: 65.7, color: COLORS.cardYellow, isMain: true },
            { label: 'Hunger', percentage: 19.1, color: COLORS.primaryOrange },
            { label: 'Discomfort', percentage: 10.5, color: COLORS.secondaryPink },
            { label: 'Belly Pain', percentage: 3.7, color: COLORS.cardPurple },
            { label: 'Burping', percentage: 1.0, color: COLORS.cardGreen },
        ],
        recommendations: [
            { title: "Slight Rocking", text: "Gentle, repetitive motion can soothe a fussy baby and encourage sleep.", iconColor: COLORS.cardPurple },
            { title: "Offer Pacifier/Bottle", text: "Sucking is a natural self-soothing mechanism that can help a tired baby settle.", iconColor: COLORS.secondaryPink },
        ]
    };

    // Derived values from the main prediction (Tired in this mock)
    const primaryPrediction = predictionData.fullBreakdown.find(p => p.isMain) || predictionData.fullBreakdown[0];
    const { label, confidence, iconColor, recommendations, fullBreakdown } = predictionData;
    const confidencePercent = `${primaryPrediction.percentage.toFixed(1)}%`;
    const progressBarWidth = `${primaryPrediction.percentage}%`;
    // --- END DATA SETUP ---

    const [currentRoute, setCurrentRoute] = useState('PredictionResult'); 
    useFocusEffect(
        useCallback(() => {
            const routeName = navigation.getState().routes[navigation.getState().index].name;
            setCurrentRoute(routeName);
        }, [navigation])
    );

    // Function to navigate to the new RemedyScreen
    const handleGetRemedies = () => {
        // Mock prediction ID used for lookup in RemedyScreen
        const predictionId = '6'; 
        navigation.navigate('RemedyScreen', { predictionId: predictionId, primaryLabel: label });
    };

    const RecommendationCard = ({ title, text, iconColor }) => (
        <Card style={localStyles.recommendationCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: PLACEHOLDER_ICON(iconColor) }} style={styles.smallIcon} />
                <Text style={styles.recommendationTitle}>{title}</Text>
            </View>
            <Text style={styles.recommendationText}>{text}</Text>

            <View style={localStyles.feedbackRow}>
                <Text style={localStyles.feedbackText}>Did it help you?</Text>
                <TouchableOpacity 
                    style={styles.feedbackBtn} 
                    onPress={() => navigation.navigate('Milestones')}
                >
                    <Text style={styles.feedbackBtnText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.feedbackBtn, { backgroundColor: COLORS.textGray }]} 
                    onPress={() => navigation.navigate('Feedback')}
                >
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
                    <View style={localStyles.resultHeader}>
                        <Image
                            source={{ uri: PLACEHOLDER_AVATAR('8F8F8F') }}
                            style={styles.resultImage}
                        />
                        <View style={localStyles.actionButtons}> 
                            <TouchableOpacity style={[styles.resultActionBtn, { backgroundColor: COLORS.cardGreen }]} onPress={() => navigation.navigate('Feedback')}>
                                <Ionicons name="checkmark-sharp" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.resultActionBtn, { backgroundColor: COLORS.secondaryPink, marginLeft: 20 }]} onPress={() => navigation.navigate('Feedback')}>
                                <Ionicons name="close-sharp" size={24} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {/* Primary Prediction Detail */}
                    <Card style={styles.predictionDetailCard}>
                        <View style={localStyles.predictionHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={{ uri: PLACEHOLDER_ICON(iconColor) }} style={styles.smallIcon} />
                                <Text style={styles.predictionText}>{label}</Text>
                            </View>
                            <Text style={styles.predictionPercent}>{confidencePercent}</Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBar, { width: progressBarWidth }]} />
                        </View>
                    </Card>
                </Card>
                
                {/* Full Percentage Breakdown (NEW SECTION) */}
                <View style={localStyles.breakdownContainer}>
                    <Text style={localStyles.breakdownTitle}>Full Prediction Breakdown</Text>
                    {fullBreakdown.map((item, index) => (
                        <PredictionBar
                            key={index}
                            label={item.label}
                            percentage={item.percentage}
                            iconColor={item.color}
                        />
                    ))}
                </View>
                {/* END NEW SECTION */}

                {/* Get Remedies Button */}
                <View style={localStyles.remedyButtonContainer}>
                    <PrimaryButton
                        title="VIEW ALL REMEDIES"
                        onPress={handleGetRemedies}
                        style={localStyles.remedyButton}
                    />
                </View>

            </ScrollView>
            <BottomNavbar navigation={navigation} currentRoute={currentRoute} />
        </SafeAreaView>
    );
};

const localStyles = StyleSheet.create({
    resultHeader: {
        alignItems: 'center', 
        marginBottom: 20,
    },
    actionButtons: {
        flexDirection: 'row', 
        marginTop: 20,
    },
    predictionHeader: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
    },
    recommendationCard: {
        padding: 20, 
        marginBottom: 15,
    },
    feedbackRow: {
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        marginTop: 15,
        alignItems: 'center',
    },
    feedbackText: {
        fontSize: 14, 
        color: COLORS.textGray, 
        marginRight: 10,
    },
    remedyButtonContainer: {
        paddingHorizontal: 20, 
        marginTop: 30,
        marginBottom: 10,
    },
    remedyButton: {
        backgroundColor: COLORS.secondaryPink, 
    },
    // Styles for the NEW Prediction Breakdown
    breakdownContainer: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 10,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // Use a subtle shadow/border to separate it visually from the scroll container
        borderTopWidth: 1, 
        borderTopColor: '#F0F0F0',
        marginTop: 10,
    },
    breakdownTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textDark,
        marginBottom: 15,
    },
    predictionBarContainer: {
        marginBottom: 15,
    },
    predictionBarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    barLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textDark,
    },
    barPercent: {
        fontSize: 16,
        fontWeight: '700',
    }
});

export default PredictionResultScreen;
