// src/api/mockApi.js
import { MOCK_DELAY_MS } from "./config";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const signup = async (userData) => {
  await delay(MOCK_DELAY_MS);
  // token is a JWT-like string with a payload containing sub=mock-user-1
  const mockJwt = "eyJhbGciOiJub25lIn0.eyJzdWIiOiJtb2NrLXVzZXItMSJ9.";
  return {
    user: { id: "mock-user-1", ...userData },
    token: mockJwt,
    message: "Signup successful (mock)",
  };
};

export const login = async (mobile, password) => {
  await delay(MOCK_DELAY_MS);
  const mockJwt = "eyJhbGciOiJub25lIn0.eyJzdWIiOiJtb2NrLXVzZXItMSJ9.";
  return {
    user: { id: "mock-user-1", mobile },
    token: mockJwt,
    message: "Login successful (mock)",
  };
};

export const uploadRecording = async (audioUri, deviceToken) => {
  await delay(MOCK_DELAY_MS);
  return {
    id: "mock-prediction-1",
    prediction: {
      label: "hunger",
      confidence: 0.87,
      remedy: "Offer a feed and check diaper",
    },
    createdAt: new Date().toISOString(),
    message: "Prediction returned (mock)",
  };
};
