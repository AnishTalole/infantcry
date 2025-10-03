// src/screens/main/HomeScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions, SafeAreaView, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '../../components/BottomNavbar';
import { useFocusEffect } from '@react-navigation/native';

// Get screen width for responsive sizing
const { width } = Dimensions.get('window');

// --- THEME COLORS (must match global theme) ---
const COLORS = {
  primaryOrange: '#FF9F4F',
  textDark: '#333333',
  textGray: '#777777',
  white: '#FFFFFF',
  background: '#FBF8F5', 
};


// Component for the Dynamic Waveform visualization (Unchanged)
const DynamicWave = ({ isRecording }) => {
  const barCount = 30;
  const initialHeights = useRef(
    Array.from({ length: barCount }).map((_, index) => {
      const heightFactor = Math.abs(Math.sin((index / barCount) * Math.PI * 2.5));
      return Math.min(30, 5 + heightFactor * 25);
    })
  ).current;

  const [barHeights, setBarHeights] = useState(initialHeights);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setBarHeights(prevHeights =>
          prevHeights.map(height => {
            const randomDelta = Math.random() * 8 - 4;
            const newHeight = Math.max(5, Math.min(30, height + randomDelta));
            return newHeight;
          })
        );
      }, 100);
    } else {
      setBarHeights(initialHeights);
    }

    return () => clearInterval(interval);
  }, [isRecording, initialHeights]);

  const bars = barHeights.map((height, index) => {
    const color = index % 2 === 0 ? COLORS.textDark : COLORS.textGray;

    return (
      <View
        key={index}
        style={[
          styles.waveBar,
          { height: height, backgroundColor: color, opacity: isRecording ? 1 : 0.7 },
        ]}
      />
    );
  });

  return (
    <View style={styles.waveformContainer}>
      <Text style={styles.timeText}>{isRecording ? '0:00' : '2:33'}</Text>
      {bars}
      <Text style={styles.timeText}>{isRecording ? '0:06' : '4:47'}</Text>
    </View>
  );
};


// --- Main HomeScreen Component ---

const HomeScreen = ({ navigation }) => {
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [sound, setSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const stopTimer = useRef(null);

  const [currentRoute, setCurrentRoute] = useState('Home');

  // Stop Recording function
  const stopRecording = useCallback(async (isAutoStop = false) => {
    const currentRecording = recording;
    
    if (stopTimer.current) {
        clearTimeout(stopTimer.current);
        stopTimer.current = null;
    }

    if (!currentRecording) return;

    try {
        setIsRecording(false);
        await currentRecording.stopAndUnloadAsync();
        const uri = currentRecording.getURI();
        setRecordingUri(uri);
        setRecording(null);

        console.log('Recording stopped and saved to URI:', uri);
        
        if (isAutoStop) {
             Alert.alert('Recording Stopped', 'Recording stopped automatically after 6 seconds.');
        }

    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }, [recording]);

  
  // Clean-up effect for navigation/unmount
  useFocusEffect(
    useCallback(() => {
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setCurrentRoute(routeName);
      
      return () => {
        if (sound) sound.unloadAsync();
        if (recording) stopRecording();
        if (stopTimer.current) clearTimeout(stopTimer.current);
      };
    }, [navigation, sound, recording, stopRecording])
  );


  // Permission and Playback Unload Effect
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant microphone access to record audio.',
          [{ text: 'OK' }]
        );
      }
    })();

    return sound ? () => {
      sound.unloadAsync();
    } : undefined;
  }, [sound]);

  // Start Recording to implement the auto-stop timer
  const startRecording = async () => {
    if (isRecording) return;
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      setRecordingUri(null);

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
      console.log('Recording started');
      
      stopTimer.current = setTimeout(() => {
        stopRecording(true); 
      }, 6000);

    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Recording Error', 'Could not start recording. Check permissions.');
    }
  };

  const handleGetResults = () => {
    console.log('Navigating to results with URI:', recordingUri);
    navigation.navigate('PredictionResult');
    setRecordingUri(null);
  };
  
  const handleDeleteRecording = () => {
    if (isPlaying) stopPlayback();
    setRecordingUri(null);
    Alert.alert('Recording Deleted', 'Your audio recording has been removed.');
  };

  const handleRecordButtonPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Playback functions
  const playRecording = async () => {
    if (recordingUri && !isPlaying) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: recordingUri },
          { shouldPlay: true },
          (status) => {
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        );
        setSound(sound);
        setIsPlaying(true);
        await sound.playAsync();
        console.log('Playback started');
      } catch (error) {
        console.error('Failed to play sound', error);
        Alert.alert('Playback Error', 'Could not play the recorded audio.');
      }
    }
  };

  const stopPlayback = async () => {
    if (sound && isPlaying) {
      await sound.stopAsync();
      setIsPlaying(false);
      console.log('Playback stopped');
    }
  };

  const handlePlaybackPress = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      playRecording();
    }
  };

  // UI variables
  const micIcon = isRecording ? 'stop' : 'microphone';
  const buttonText = isRecording ? 'Tap to Stop (Auto-stop in 6s)' : 'Tap to Record';
  const playbackIcon = isPlaying ? 'pause-circle-outline' : 'play-circle-outline';
  const playbackText = isPlaying ? 'Stop Playback' : 'Listen to Recording';
  const showGetResultsButton = recordingUri && !isRecording && !isPlaying;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.content}>

          {/* Main Recording Button Area */}
          <TouchableOpacity
            style={styles.recordButtonContainer}
            onPress={handleRecordButtonPress}
            activeOpacity={0.8}
          >
            <View style={[styles.micCircle, isRecording && styles.micCircleRecording]}>
              <MaterialCommunityIcons name={micIcon} size={width * 0.15} color={COLORS.white} />
            </View>
          </TouchableOpacity>

          <Text style={styles.recordText}>{buttonText}</Text>
          <Text style={styles.freeCountText}>
            {isRecording ? 'Recording...' : '5 Free for Today'}
          </Text>

          {/* Waveform and Playback */}
          <View style={styles.waveformWrapper}>
            <DynamicWave isRecording={isRecording || isPlaying} />

            {recordingUri && !isRecording && (
              <View style={styles.playbackControls}>
                <TouchableOpacity
                  style={styles.playbackButton}
                  onPress={handlePlaybackPress}
                  disabled={isRecording}
                >
                  <MaterialCommunityIcons
                    name={playbackIcon}
                    size={48}
                    color={isRecording ? COLORS.textGray : COLORS.primaryOrange}
                  />
                </TouchableOpacity>
                <Text style={styles.playbackButtonText}>
                  {playbackText}
                </Text>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteRecording}
                >
                  <Ionicons
                    name="close-circle-sharp"
                    size={30}
                    color="#D90000"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Get Results Button */}
        {showGetResultsButton && (
          <TouchableOpacity
            style={styles.getResultsButton}
            onPress={handleGetResults}
            activeOpacity={0.8}
          >
            <Text style={styles.getResultsText}>Get Results</Text>
          </TouchableOpacity>
        )}

        {/* Functional Navigation Bar */}
        <BottomNavbar navigation={navigation} currentRoute={currentRoute} />
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 90, 
    // FIX 2: Center content vertically to balance space above and below the mic button
    justifyContent: 'center', 
  },
  header: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    // FIX 1: Reduce top margin/padding to prevent the header from being too far down
    // Use a fixed small value on both platforms, relying on SafeAreaView for initial inset
    marginTop: 10, 
    paddingTop: 0, 
    // This padding should be large enough to push the header down from the very top, but not excessive.
    // NOTE: This marginBottom is now the primary space creator above the limitText
    marginBottom: 20, 
    position: 'absolute', // Make the header float at the top
    top: 0, // Pin it to the top
    width: '100%', // Ensure it spans the full width
    backgroundColor: COLORS.background, // Important for floating header
    zIndex: 10, // Ensure it is above other content
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFDC7B',
    marginRight: 15,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  monthText: {
    fontSize: 16,
    color: COLORS.textGray,
  },
  limitText: {
    fontSize: 15,
    color: COLORS.textGray,
    // This margin is crucial now that header is absolute
    marginTop: 100, // Push content down past the absolute header
    marginBottom: 30,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
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
  micCircleRecording: {
    backgroundColor: '#D90000',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 20,
  },
  recordText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 5,
  },
  freeCountText: {
    fontSize: 16,
    color: COLORS.textGray,
  },
  waveformWrapper: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    width: '100%',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
    width: width * 0.85,
    marginBottom: 20,
  },
  waveBar: {
    width: 3,
    marginHorizontal: 0.5,
    borderRadius: 1,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textGray,
    marginHorizontal: 10,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.85,
    position: 'relative',
  },
  playbackButton: {},
  playbackButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    padding: 5,
  },
  getResultsButton: {
    // This button remains fixed relative to the bottom, which is good.
    position: 'absolute',
    bottom: 90,
    left:30,
    width: width * 0.85,
    height: 55,
    borderRadius: 30,
    backgroundColor: COLORS.primaryOrange,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.primaryOrange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  getResultsText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;