// src/screens/main/HomeScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '../../components/BottomNavbar';
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

// --- Waveform ---
const DynamicWave = ({ isRecording }) => {
  const barCount = 30;
  const initialHeights = useRef(
    Array.from({ length: barCount }).map((_, i) => {
      const heightFactor = Math.abs(Math.sin((i / barCount) * Math.PI * 2.5));
      return Math.min(30, 5 + heightFactor * 25);
    })
  ).current;

  const [barHeights, setBarHeights] = useState(initialHeights);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setBarHeights(prev =>
          prev.map(h => {
            const delta = Math.random() * 8 - 4;
            return Math.max(5, Math.min(30, h + delta));
          })
        );
      }, 100);
    } else {
      setBarHeights(initialHeights);
    }
    return () => clearInterval(interval);
  }, [isRecording, initialHeights]);

  return (
    <View style={styles.waveformContainer}>
      <Text style={styles.timeText}>{isRecording ? '0:00' : '2:33'}</Text>
      {barHeights.map((h, i) => (
        <View
          key={i}
          style={[styles.waveBar, { height: h, backgroundColor: i % 2 === 0 ? COLORS.textDark : COLORS.textGray, opacity: isRecording ? 1 : 0.7 }]}
        />
      ))}
      <Text style={styles.timeText}>{isRecording ? '0:06' : '4:47'}</Text>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [sound, setSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const stopTimer = useRef(null);
  const [currentRoute, setCurrentRoute] = useState('Home');

  // Permissions
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone access to record audio.');
      }
    })();
  }, []);

  // Cleanup
  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setCurrentRoute(routeName);

      return () => {
        if (sound) sound.unloadAsync();
        if (recording) stopRecording();
        if (stopTimer.current) clearTimeout(stopTimer.current);
      };
    }, [navigation, sound, recording])
  );

  // Recording
  const startRecording = async () => {
    if (isRecording) return;
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      setRecordingUri(null);

      const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(newRecording);
      setIsRecording(true);

      stopTimer.current = setTimeout(() => stopRecording(true), 6000);
    } catch (err) {
      console.error('Start recording error', err);
      Alert.alert('Error', 'Could not start recording.');
    }
  };

  const stopRecording = useCallback(async (autoStop = false) => {
    if (!recording) return;
    if (stopTimer.current) clearTimeout(stopTimer.current);

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
      console.log('Recording saved:', uri);

      if (autoStop) Alert.alert('Stopped', 'Recording stopped after 6 seconds.');
    } catch (err) {
      console.error('Stop recording error', err);
    }
  }, [recording]);

  // Playback
  const playRecording = async () => {
    if (!recordingUri || isPlaying) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true },
        status => {
          if (status.didJustFinish) setIsPlaying(false);
        }
      );
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
    } catch (err) {
      console.error('Playback error', err);
      Alert.alert('Playback Error', 'Cannot play audio.');
    }
  };

  const stopPlayback = async () => {
    if (sound && isPlaying) {
      await sound.stopAsync();
      setIsPlaying(false);
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
    Alert.alert('Recording Deleted', 'Your recording has been removed.');
  };

  const handleRecordPress = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const micIcon = isRecording ? 'stop' : 'microphone';
  const buttonText = isRecording ? 'Tap to Stop (Auto-stop in 6s)' : 'Tap to Record';
  const playbackIcon = isPlaying ? 'pause-circle-outline' : 'play-circle-outline';
  const playbackText = isPlaying ? 'Stop Playback' : 'Listen to Recording';
  const showGetResults = recordingUri && !isRecording && !isPlaying;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Record Button */}
        <TouchableOpacity style={styles.recordButtonContainer} onPress={handleRecordPress} activeOpacity={0.8}>
          <View style={[styles.micCircle, isRecording && styles.micCircleRecording]}>
            <MaterialCommunityIcons name={micIcon} size={width * 0.15} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        <Text style={styles.recordText}>{buttonText}</Text>
        <Text style={styles.freeCountText}>{isRecording ? 'Recording...' : '5 Free for Today'}</Text>

        {/* Waveform and Playback */}
        <View style={styles.waveformWrapper}>
          <DynamicWave isRecording={isRecording || isPlaying} />
          {recordingUri && !isRecording && (
            <View style={styles.playbackControls}>
              <TouchableOpacity onPress={playRecording} disabled={isRecording}>
                <MaterialCommunityIcons name={playbackIcon} size={48} color={isRecording ? COLORS.textGray : COLORS.primaryOrange} />
              </TouchableOpacity>
              <Text style={styles.playbackButtonText}>{playbackText}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteRecording}>
                <Ionicons name="close-circle-sharp" size={30} color="#D90000" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Get Results Button */}
        {showGetResults && (
          <TouchableOpacity style={styles.getResultsButton} onPress={handleGetResults} activeOpacity={0.8}>
            <Text style={styles.getResultsText}>Get Results</Text>
          </TouchableOpacity>
        )}

        {/* Bottom Navigation */}
        <BottomNavbar navigation={navigation} currentRoute={currentRoute} />
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  recordButtonContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: 'rgba(255, 159, 79, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  freeCountText: { fontSize: 16, color: COLORS.textGray },
  waveformWrapper: { height: 100, justifyContent: 'center', alignItems: 'center', marginVertical: 40, width: '100%' },
  waveformContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 60, width: width * 0.85, marginBottom: 20 },
  waveBar: { width: 3, marginHorizontal: 0.5, borderRadius: 1 },
  timeText: { fontSize: 12, color: COLORS.textGray, marginHorizontal: 10 },
  playbackControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: width * 0.85, position: 'relative' },
  playbackButtonText: { marginLeft: 10, fontSize: 16, color: COLORS.textDark, fontWeight: '600' },
  deleteButton: { position: 'absolute', right: 0, padding: 5 },
  getResultsButton: {
    position: 'absolute',
    bottom: 90,
    width: width * 0.85,
    height: 55,
    borderRadius: 30,
    backgroundColor: COLORS.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  getResultsText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
});

export default HomeScreen;
