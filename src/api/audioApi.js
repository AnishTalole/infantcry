// src/api/audioApi.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

const API_URL = "https://grand-prosperity-production.up.railway.app/api/audio";

/**
 * Upload the recorded audio to the backend for prediction
 * @param {string} audioUri - The local file URI of the recorded audio
 * @param {string} deviceToken - The FCM device token for push notifications
 * @returns {Promise<Object>} - The prediction response from the server
 */
export const uploadRecording = async (audioUri, deviceToken) => {
  try {
    // 1. Get token from storage
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    // 2. Decode token to extract user ID
    const decoded = jwtDecode(token);
    // Assuming backend sets "sub" as the user ID
    const userId = decoded.sub;

    console.log("User ID from token:", userId);

    // 3. Prepare form data
    const formData = new FormData();
    formData.append("file", {
      uri: audioUri,
      type: "audio/wav",  // adjust based on actual recording type
      name: "baby-cry.wav",
    });
    formData.append("deviceToken", deviceToken);

    // 4. Make the API call
    const response = await axios.post(`${API_URL}/${userId}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.error("Upload error:", err.response ? err.response.data : err.message);
    throw err;
  }
};
