// src/services/careerService.js
import API from "./axiosInstance";
import { buildCareerRequest } from "../utils/profileHelper";

// Call recommendation endpoint
export const getRecommendedCareers = async (scoresData, economic_status = "weak", language = "en") => {
  const body = buildCareerRequest(scoresData, economic_status, language);
  return API.post("/careers/recommend/v2", body);
};
