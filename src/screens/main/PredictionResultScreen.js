import React, { useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomNavbar from '../../components/BottomNavbar';
import PrimaryButton from '../../components/PrimaryButton'; // Import PrimaryButton
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS, PLACEHOLDER_AVATAR, PLACEHOLDER_ICON } from '../../theme/styles';


const PredictionResultScreen = ({ navigation, route }) => {

    // --- MOCK/DYNAMIC DATA SETUP (Using the structure for the Prediction Detail) ---
    const predictionData = {
        label: 'Sleepy',
        confidence: 65.7, // Percentage value
        iconColor: COLORS.cardYellow,
        recommendations: [
            { title: "Slight Rocking", text: "Gentle, repetitive motion can soothe a fussy baby and encourage sleep.", iconColor: COLORS.cardPurple },
            { title: "Offer Pacifier/Bottle", text: "Sucking is a natural self-soothing mechanism that can help a tired baby settle.", iconColor: COLORS.secondaryPink },
        ]
    };

    const { label, confidence, iconColor, recommendations } = predictionData;
    const confidencePercent = `${confidence.toFixed(1)}%`;
    const progressBarWidth = `${confidence}%`;
    // --- END DATA SETUP ---

    const [currentRoute, setCurrentRoute] = useState('PredictionResult'); 
    useFocusEffect(
        useCallback(() => {
            const routeName = navigation.getState().routes[navigation.getState().index].name;
            setCurrentRoute(routeName);
        }, [navigation])
    );

    // Function to navigate to the new RemedyScreen, passing the prediction ID (mocked as '6')
    const handleGetRemedies = () => {
        // In a real app, the ID for the prediction would come from the API response
        const predictionId = '6'; 
        navigation.navigate('Remedy', { predictionId: predictionId, primaryLabel: label });
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
                
                {/* ADDED: Get Remedies Button */}
                <View style={localStyles.remedyButtonContainer}>
                    <PrimaryButton
                        title="VIEW ALL REMEDIES"
                        onPress={handleGetRemedies}
                        style={localStyles.remedyButton}
                    />
                </View>
                {/* END ADDED */}


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
        paddingHorizontal: 20, // Match the padding of the scrollContent used by PrimaryButton
        marginTop: 30,
        marginBottom: 10,
    },
    remedyButton: {
        backgroundColor: COLORS.secondaryPink, // Use a different color to distinguish
    }
});

export default PredictionResultScreen;