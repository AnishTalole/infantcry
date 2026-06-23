import apiClient from "./client";
import { USE_MOCK } from "./config";
import * as mockApi from "./mockApi";

// Signup
export const signup = async (userData) => {
  if (USE_MOCK) return mockApi.signup(userData);
  const response = await apiClient.post("/auth/signup", userData);
  return response.data;
};


// login
export const login = async (mobile, password) => {
  if (USE_MOCK) return mockApi.login(mobile, password);
  const response = await apiClient.post("/auth/signin", {
    mobile,
    password,
  });
  return response.data;
};
