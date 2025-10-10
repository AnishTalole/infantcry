import apiClient from "./client";

// Signup
export const signup = async (userData) => {
  const response = await apiClient.post("/auth/signup", userData);
  return response.data;
};


//login
export const login = async (mobile, password) => {
  const response = await apiClient.post("/auth/signin", {
    mobile,
    password,
  });
  return response.data;
};
