// src/screens/main/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 
import BottomNavbar from '../../components/BottomNavbar';
// IMPORTANT: Add useFocusEffect for safer navigation state access
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


// Component for the Waveform-like visualization (static representation for the UI)
const StaticWaveform = () => {
  const barCount = 30;
  const bars = Array.from({ length: barCount }).map((_, index) => {
    const heightFactor = Math.abs(Math.sin((index / barCount) * Math.PI * 2.5));
    const height = Math.min(30, 5 + heightFactor * 25);
    const color = index % 2 === 0 ? COLORS.textDark : COLORS.textGray; 

    return (
      <View
        key={index}
        style={[
          styles.waveBar,
          { height: height, backgroundColor: color },
        ]}
      />
    );
  });

  return (
    <View style={styles.waveformContainer}>
      <Text style={styles.timeText}>2:33</Text>
      {bars}
      <Text style={styles.timeText}>4:47</Text>
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
  
  // FIX: Use state and useFocusEffect to safely get the current route name
  const [currentRoute, setCurrentRoute] = useState('Home'); 
  
  useFocusEffect(
    useCallback(() => {
      // Safely read the current route name when the screen gains focus
      const routeName = navigation.getState().routes[navigation.getState().index].name;
      setCurrentRoute(routeName);
    }, [navigation])
  );
  // --- End FIX ---


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

  const startRecording = async () => {
    if (isRecording) return;
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      setRecordingUri(null);

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Recording Error', 'Could not start recording. Check permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
      console.log('Recording stopped and saved to URI:', uri);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const handleRecordButtonPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

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

  const micIcon = isRecording ? 'stop' : 'microphone';
  const buttonText = isRecording ? 'Tap to Stop' : 'Tap to Record';
  const playbackIcon = isPlaying ? 'pause-circle-outline' : 'play-circle-outline';
  const playbackText = isPlaying ? 'Stop Playback' : 'Listen to Recording';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Scrollable Content (Exclude the header if using CustomHeader) */}
        <View style={styles.content}>
          
          {/* Header/Profile Info */}
          <View style={styles.header}>
            <View style={styles.avatarPlaceholder} /> 
            <View>
              <Text style={styles.nameText}>Anish</Text>
              <Text style={styles.monthText}>1 Month</Text>
            </View>
          </View>

          {/* Strict Warning */}
          <Text style={styles.warningText}>
            ⚠️ The audio should be only **5-6 sec max** ⚠️
          </Text>

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
            {recordingUri ? (
              <View style={styles.playbackArea}>
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
              </View>
            ) : (
              <StaticWaveform />
            )}
          </View>
        </View>

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
  // Ensure the content area doesn't get covered by the nav bar
  content: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 90, // Space for the 80px high nav bar + 10px margin
  },
  header: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
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
  warningText: {
    fontSize: 15,
    color: '#D90000',
    marginBottom: 30,
    fontWeight: '700',
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
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
    width: width * 0.85,
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
  playbackArea: {
    alignItems: 'center',
  },
  playbackButton: {},
  playbackButtonText: {
    marginTop: 5,
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: '600',
  },
});

export default HomeScreen;
