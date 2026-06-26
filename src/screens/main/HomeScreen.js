// src/screens/main/HomeScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions, SafeAreaView, Platform, ScrollView, BackHandler } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '../../components/BottomNavbar';
import CustomHeader from '../../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { uploadRecording } from '../../api/audioApi';

const { width } = Dimensions.get('window');

const COLORS = {
  primaryOrange: '#FF9F4F',
  textDark: '#333333',
  textGray: '#777777',
  white: '#FFFFFF',
  background: '#FBF8F5',
};

const formatDuration = (millis) => {
  const seconds = Math.min(6, Math.round(millis / 1000));
  const padded = seconds.toString().padStart(2, '0');
  return `0:${padded}`;
};

// --- Waveform ---
const DynamicWave = ({ active, progress = 0 }) => {
  const barCount = 28;
  const initialHeights = useRef(
    Array.from({ length: barCount }).map((_, i) => {
      const phase = (i / barCount) * Math.PI * 2;
      return 12 + Math.sin(phase) * 10 + Math.cos(phase * 1.4) * 5;
    })
  ).current;

  const [barHeights, setBarHeights] = useState(initialHeights);
  const progressWidth = `${Math.min(1, Math.max(0, progress)) * 100}%`;

  useEffect(() => {
    let interval;
    if (active) {
      interval = setInterval(() => {
        setBarHeights(prev =>
          prev.map((h, i) => {
            const base = initialHeights[i];
            const wobble = Math.sin(Date.now() / 250 + i) * 6;
            const jitter = (Math.random() * 4 - 2) * (active ? 1 : 0.4);
            return Math.max(10, Math.min(36, base + wobble + jitter));
          })
        );
      }, 120);
    } else {
      setBarHeights(initialHeights);
    }
    return () => clearInterval(interval);
  }, [active, initialHeights]);

  return (
    <View style={styles.waveformContainer}>
      <Text style={styles.timeText}>{formatDuration(progress * 6000)}</Text>
      <View style={styles.waveformProgressWrapper}>
        <View style={[styles.waveProgressOverlay, { width: progressWidth }]} />
        <View style={styles.waveBarsRow}>
          {barHeights.map((h, i) => (
            <View
              key={i}
              style={[
                styles.waveBar,
                { height: h, backgroundColor: i % 2 === 0 ? COLORS.primaryOrange : COLORS.textGray, opacity: active ? 1 : 0.6 },
              ]}
            />
          ))}
        </View>
      </View>
      <Text style={styles.timeText}>0:06</Text>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [sound, setSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const preparingRef = useRef(false);

  const stopTimer = useRef(null);
  const [currentRoute, setCurrentRoute] = useState('Home');
  const backHandlerRef = useRef(null);

  // Permissions
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone access to record audio.');
      } else {
        // Enable audio recording on iOS
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpiece: false,
          });
        } catch (error) {
          console.error('Failed to set audio mode:', error);
        }
      }
    })();
  }, []);

  // Cleanup
  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setCurrentRoute(routeName);

      // Handle cleanup and prevent hardware back from leaving Home
      const onHardwareBack = () => {
        // If we're on Home, keep user on Home (consume event)
        if (routeName === 'Home') {
          navigation.navigate('Home');
          return true;
        }
        return false;
      };

      backHandlerRef.current = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);

      return () => {
        if (backHandlerRef.current) {
          backHandlerRef.current.remove();
        }
        if (sound) sound.unloadAsync();
        if (recording) stopRecording();
        if (stopTimer.current) clearTimeout(stopTimer.current);
      };
    }, [navigation, sound, recording])
  );

  // Recording
  const startRecording = async () => {
    if (isRecording || preparingRef.current) return;
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      if (recording) {
        try {
          await recording.stopAndUnloadAsync();
        } catch (stopError) {
          console.warn('Existing recording cleanup error', stopError);
        }
        setRecording(null);
      }
      setRecordingUri(null);
      setRecordingDuration(0);
      setRecordingProgress(0);

      preparingRef.current = true;
      // Attempt to create a new Recording; if native reports an existing prepared Recording,
      // try to stop any leftover recording and retry once.
      let newRecording;
      try {
        const result = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        newRecording = result.recording;
      } catch (createErr) {
        const msg = (createErr && (createErr.message || createErr.toString())) || '';
        if (msg.includes('Only one Recording object can be prepared') || msg.includes('Only one recording object can be prepared')) {
          // try to clean up any existing recording and retry
          try {
            if (recording) {
              await recording.stopAndUnloadAsync();
            }
          } catch (cleanupErr) {
            console.warn('Cleanup before retry failed', cleanupErr);
          }
          // small delay then retry
          await new Promise(res => setTimeout(res, 250));
          const retryResult = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
          newRecording = retryResult.recording;
        } else {
          throw createErr;
        }
      }
      newRecording.setOnRecordingStatusUpdate(status => {
        if (!status.isLoaded) return;
        setRecordingDuration(status.durationMillis);
        setRecordingProgress(Math.min(1, status.durationMillis / 6000));
      });
      // Use global Audio progress interval (Recording may not expose setProgressUpdateIntervalMillis on all SDKs)
      try {
        Audio.setProgressUpdateIntervalMillis && Audio.setProgressUpdateIntervalMillis(100);
      } catch (e) {
        // ignore if not supported
      }

      setRecording(newRecording);
      setIsRecording(true);

      stopTimer.current = setTimeout(() => stopRecording(true), 6000);
      preparingRef.current = false;
    } catch (err) {
      preparingRef.current = false;
      console.error('Start recording error', err);
      Alert.alert('Error', 'Could not start recording.');
    }
  };

  const stopRecording = useCallback(async (autoStop = false) => {
    if (stopTimer.current) {
      clearTimeout(stopTimer.current);
      stopTimer.current = null;
    }
    if (!recording) return;

    try {
      if (isRecording) {
        setIsRecording(false);
      }
      await recording.stopAndUnloadAsync();
      const status = await recording.getStatusAsync();
      const uri = recording.getURI();
      setRecordingDuration(status.durationMillis);
      setRecordingProgress(Math.min(1, status.durationMillis / 6000));
      setRecordingUri(uri);
      setRecording(null);
      preparingRef.current = false;
      console.log('Recording saved:', uri);
      if (autoStop) Alert.alert('Stopped', 'Recording stopped after 6 seconds.');
    } catch (err) {
      preparingRef.current = false;
      console.error('Stop recording error', err);
    }
  }, [recording, isRecording]);

  const playPauseRecording = async () => {
    if (!recordingUri) return;

    try {
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
            setIsPaused(true);
            return;
          }

          if (status.durationMillis > 0 && status.positionMillis >= status.durationMillis - 100) {
            await sound.setPositionAsync(0);
            await sound.playAsync();
            setIsPlaying(true);
            setIsPaused(false);
            return;
          }

          await sound.playAsync();
          setIsPlaying(true);
          setIsPaused(false);
          return;
        }
      }

      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true },
        status => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            setIsPaused(false);
          }
        }
      );
      setSound(newSound);
      setIsPlaying(true);
      setIsPaused(false);
    } catch (err) {
      console.error('Playback error', err);
      Alert.alert('Playback Error', 'Cannot play audio.');
    }
  };

  const stopPlayback = async () => {
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound.pauseAsync();
      }
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setIsPaused(false);
    } catch (err) {
      console.error('Stop playback error', err);
    }
  };

  // Upload & Get Results
  const handleGetResults = async () => {
    if (!recordingUri) {
      Alert.alert("No Recording", "Please record audio first.");
      return;
    }

    try {
      const result = await uploadRecording(recordingUri); // Removed deviceToken

      // Navigate to PredictionResultScreen with API response
      navigation.navigate("PredictionResult", { prediction: result });

      setRecordingUri(null);
    } catch (err) {
      Alert.alert("Upload Failed", "Could not upload audio. Please try again.");
    }
  };

  const handleDeleteRecording = () => {
    if (isPlaying) stopPlayback();
    setRecordingUri(null);
    setRecordingDuration(0);
    setRecordingProgress(0);
    Alert.alert('Recording Deleted', 'Your recording has been removed.');
  };

  const handleRecordPress = () => {
    if (isRecording) stopRecording(true);
    else startRecording();
  };

  const micIcon = isRecording ? 'stop' : 'microphone';
  const buttonText = isRecording ? 'Stop Recording' : 'Start Recording';
  const playbackIcon = isPlaying ? 'pause-circle-outline' : 'play-circle-outline';
  const playbackText = isPlaying ? 'Pause Playback' : isPaused ? 'Resume Playback' : 'Play Recorded Audio';
  const recordedSeconds = Math.max(0, Math.floor(recordingDuration / 1000));
  const freeCountText = isRecording
    ? `Recording in progress (${formatDuration(recordingDuration)})`
    : recordingUri
      ? `Recorded ${recordedSeconds} second${recordedSeconds === 1 ? '' : 's'}`
      : 'Tap to start a new recording';
  const showGetResults = recordingUri && !isRecording;

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader
        title="Home"
        navigation={navigation}
        showBackButton={false}
        showRightButton={true}
        rightIcon="log-out-outline"
        onRightPress={async () => {
          Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: async () => {
              try {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('userId');
              } catch (e) {
                console.warn('Logout storage clear failed', e);
              }
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } }
          ]);
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>

        <TouchableOpacity style={styles.recordButtonContainer} onPress={handleRecordPress} activeOpacity={0.8}>
          <View style={[styles.micCircle, isRecording && styles.micCircleRecording]}>
            <MaterialCommunityIcons name={micIcon} size={width * 0.15} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        <Text style={styles.recordText}>{buttonText}</Text>
        <Text style={styles.freeCountText}>{freeCountText}</Text>

        <View style={styles.recordingCard}>
          <View style={styles.recordStatusRow}>
            <View style={styles.recordBadge}>
              <Text style={styles.recordBadgeText}>{isRecording ? 'LIVE' : 'REC'}</Text>
            </View>
            <Text style={styles.recordSubtitle}>{recordingUri ? 'Audio ready to play' : 'Ready to record'}</Text>
          </View>

          <DynamicWave active={isRecording || isPlaying} progress={recordingProgress} />

          {recordingUri && (
            <View style={styles.playbackControls}>
              <TouchableOpacity onPress={playPauseRecording} style={styles.playbackButton} disabled={isRecording}>
                <MaterialCommunityIcons name={playbackIcon} size={32} color={COLORS.white} />
              </TouchableOpacity>
              <Text style={styles.playbackButtonText}>{playbackText}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteRecording}>
                <Ionicons name="close-circle-sharp" size={28} color="#D90000" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {showGetResults && (
          <TouchableOpacity style={styles.getResultsButton} onPress={handleGetResults} activeOpacity={0.8}>
            <Ionicons name="analytics" size={20} color={COLORS.white} style={{ marginRight: 10 }} />
            <Text style={styles.getResultsText}>Get Results</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <BottomNavbar navigation={navigation} currentRoute={currentRoute} />
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },
  containerContent: { alignItems: 'center', paddingTop: 24, paddingBottom: 140 },
  recordButtonContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: 'rgba(255, 159, 79, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26,
  },
  micCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    backgroundColor: COLORS.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micCircleRecording: { backgroundColor: '#D90000' },
  recordText: { fontSize: 24, fontWeight: '700', color: COLORS.textDark, marginBottom: 5 },
  freeCountText: { fontSize: 16, color: COLORS.textGray, marginBottom: 28 },
  headerRow: { width: width * 0.92, marginBottom: 14 },
  backButton: { width: 42, height: 42, justifyContent: 'center', alignItems: 'center', borderRadius: 12, backgroundColor: 'rgba(255,159,79,0.12)' },
  waveformWrapper: { width: '100%', alignItems: 'center', marginBottom: 20 },
  waveformContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 60, width: width * 0.85, marginBottom: 18 },
  waveformProgressWrapper: { position: 'relative', flex: 1, marginHorizontal: 12, height: 60, justifyContent: 'center' },
  waveProgressOverlay: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: 'rgba(255, 159, 79, 0.15)' },
  waveBarsRow: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  waveBar: { width: 5, borderRadius: 4, marginHorizontal: 1 },
  timeText: { fontSize: 12, color: COLORS.textGray },
  playbackControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: width * 0.85, marginTop: 10 },
  playbackButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playbackButtonText: { marginLeft: 16, fontSize: 16, color: COLORS.textDark, fontWeight: '700' },
  deleteButton: { padding: 5 },
  getResultsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.85,
    height: 55,
    borderRadius: 30,
    backgroundColor: COLORS.primaryOrange,
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  getResultsText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  recordingCard: {
    width: width * 0.92,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    padding: 22,
    marginTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  recordStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  recordBadge: {
    backgroundColor: COLORS.primaryOrange,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  recordBadgeText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
  },
  recordSubtitle: {
    fontSize: 14,
    color: COLORS.textGray,
  },
});

export default HomeScreen;
