// src/screens/main/RemedyScreen.js (You will need to import/export this in index.js and add it to AppNavigator)

import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import Card from '../../components/Card';
import { useFocusEffect } from '@react-navigation/native';
import { styles, COLORS } from '../../theme/styles';

// Helper component to render each prediction/remedy
const RemedyDetailCard = ({ label, confidence, immediate, preventive, comfortTip, color }) => (
    <Card style={localRemedyStyles.remedyCard}>
        {/* Prediction Label and Confidence */}
        <View style={localRemedyStyles.headerRow}>
            <Text style={[localRemedyStyles.remedyTitle, { color: color || COLORS.primaryOrange }]}>
                {label}
            </Text>
            <Text style={localRemedyStyles.confidenceText}>{confidence}</Text>
        </View>

        {/* Remedy Sections */}
        <RemedySection title="Immediate Action" text={immediate} color={COLORS.secondaryPink} />
        <RemedySection title="Preventive Measure" text={preventive} color={COLORS.cardGreen} />
        <RemedySection title="Comfort Tip" text={comfortTip} color={COLORS.cardPurple} />
    </Card>
);

// Helper component for styled sections
const RemedySection = ({ title, text, color }) => (
    <View style={localRemedyStyles.sectionContainer}>
        <Text style={[localRemedyStyles.sectionTitle, { color: color }]}>{title}</Text>
        <Text style={localRemedyStyles.sectionText}>{text}</Text>
    </View>
);


const RemedyScreen = ({ navigation, route }) => {
    // Expected parameters: { predictionId: '6', primaryLabel: 'Sleepy' }
    const { primaryLabel } = route.params || { primaryLabel: 'Crying' }; 
    const [remedies, setRemedies] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- MOCK API DATA PROCESSING ---
    const mockApiResponse = {
        "suggestions": "Analysis for your baby:\n\n1. tired (Confidence: 47.07%)\nImmediate: Reduce stimulation and hold your baby quietly.\nPreventive: Avoid overstimulating the baby before naps.\nComfort tip: Swaddle gently or use a rocking motion to soothe.\n\n2. hungry (Confidence: 41.18%)\nImmediate: Offer a small feeding shortly after the cry begins.\nPreventive: Keep a feeding schedule and monitor hunger cues.\nComfort tip: Hold your baby close to maintain warmth and calm.\n\n3. discomfort (Confidence: 11.75%)\nImmediate: Check diaper, clothing, and temperature. Ensure no tags are scratching.\nPreventive: Use breathable fabrics and avoid too many layers.\nComfort tip: Change baby's position frequently.",
    };

    useEffect(() => {
        // Mocking the API call delay
        const fetchRemedies = setTimeout(() => {
            // Processing the raw string response from the API log
            const sections = mockApiResponse.suggestions.split('\n\n').slice(1); // Split into sections and skip the initial "Analysis..." header

            const processedRemedies = sections.map(section => {
                const lines = section.split('\n');
                
                // Example: "1. tired (Confidence: 47.07%)"
                const labelMatch = lines[0].match(/(\d+\.\s)(.+?)\s+\(Confidence:\s([\d\.]+)%\)/);
                
                // Extracting details using keys in the string
                const immediate = lines.find(l => l.startsWith('Immediate:'))?.replace('Immediate: ', '').trim() || 'N/A';
                const preventive = lines.find(l => l.startsWith('Preventive:'))?.replace('Preventive: ', '').trim() || 'N/A';
                const comfortTip = lines.find(l => l.startsWith('Comfort tip:'))?.replace('Comfort tip: ', '').trim() || 'N/A';

                return {
                    label: labelMatch ? labelMatch[2] : 'Unknown',
                    confidence: labelMatch ? `${parseFloat(labelMatch[3]).toFixed(2)}%` : '0%',
                    immediate,
                    preventive,
                    comfortTip,
                };
            }).filter(r => r.confidence !== '0%'); // Filter out invalid entries

            setRemedies(processedRemedies);
            setIsLoading(false);
        }, 1500); // Simulate network latency

        return () => clearTimeout(fetchRemedies);
    }, []);
    // --- END MOCK API DATA PROCESSING ---


    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader
                title="Detailed Remedies"
                navigation={navigation}
                showRightButton={false}
            />
            <ScrollView contentContainerStyle={localRemedyStyles.scrollContent}>
                <Text style={styles.sectionHeader}>Top Cry Analysis</Text>
                <Text style={localRemedyStyles.introText}>
                    The initial cry was analyzed as **{primaryLabel}**. Here are the full detailed remedies for the top possibilities found in the audio.
                </Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color={COLORS.primaryOrange} style={{ marginTop: 50 }} />
                ) : (
                    remedies && remedies.map((remedy, index) => (
                        <RemedyDetailCard
                            key={index}
                            label={remedy.label}
                            confidence={remedy.confidence}
                            immediate={remedy.immediate}
                            preventive={remedy.preventive}
                            comfortTip={remedy.comfortTip}
                            // Use a distinct color for the primary result (first in list)
                            color={index === 0 ? COLORS.primaryOrange : COLORS.textDark} 
                        />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const localRemedyStyles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 90, // Space for BottomNavbar
    },
    introText: {
        fontSize: 16,
        color: COLORS.textGray,
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    remedyCard: {
        padding: 20,
        marginBottom: 20,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.secondaryPink, // Highlight the card
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    remedyTitle: {
        fontSize: 22,
        fontWeight: '800',
    },
    confidenceText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textGray,
    },
    sectionContainer: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 5,
    },
    sectionText: {
        fontSize: 14,
        color: COLORS.textDark,
        lineHeight: 20,
    }
});

export default RemedyScreen;