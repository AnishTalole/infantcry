// src/api/audioApi.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

const safeJwtDecode = (token) => {
  if (!token) return {};
  try {
    return jwtDecode(token);
  } catch (e) {
    try {
      return jwtDecode.default ? jwtDecode.default(token) : {};
    } catch (e2) {
      try {
        const parts = token.split('.');
        if (parts.length < 2) return {};
        const payload = parts[1];
        const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
        const decoded = (typeof atob === 'function')
          ? atob(b64 + pad)
          : (typeof Buffer !== 'undefined' ? Buffer.from(b64 + pad, 'base64').toString('utf8') : null);
        if (!decoded) return {};
        try { return JSON.parse(decodeURIComponent(escape(decoded))); } catch (e3) { return {} }
      } catch (err) {
        return {};
      }
    }
  }
};
import { USE_MOCK } from "./config";
import * as mockApi from "./mockApi";

const API_URL = "https://infant-cry-production.up.railway.app/api/audio";

/**
 * Upload the recorded audio to the backend for prediction
 * @param {string} audioUri - The local file URI of the recorded audio
 * @param {string} deviceToken - The FCM device token for push notifications
 * @returns {Promise<Object>} - The prediction response from the server
 */
export const uploadRecording = async (audioUri, deviceToken) => {
  try {
    // If using mock, return a fake prediction
    if (USE_MOCK) {
      return mockApi.uploadRecording(audioUri, deviceToken);
    }

    // 1. Get token from storage
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    // 2. Decode token to extract user ID
    const decoded = safeJwtDecode(token);
    // Assuming backend sets "sub" as the user ID
    const userId = decoded.sub || decoded.userId || decoded.id;

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
