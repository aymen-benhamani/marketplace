// APRÈS ✅
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://marketplace-30p55jkc9-aymen-benhamanis-projects.vercel.app/api",
});

export default api;