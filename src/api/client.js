import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://grand-prosperity-production.up.railway.app/api",  // replace with your deployed URL if needed
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
