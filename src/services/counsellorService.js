import AuthAPI from './authAxiosInstance';
import API from "./axiosInstance";


export const getCounsellorStudents = async ({
  page = 1,
  limit = 10,
  search = '',
}) => {
  const response = await AuthAPI.get(
    '/auth/counsellor/students',
    {
      params: { page, limit, search },
    }
  );

  return response.data;
};


export const getStudentDetailsForCounsellor = async (studentId) => {
  const res = await API.get(`/assessment/assessment-progress/student/${studentId}`);
  return res.data.data;
};

export const getStudentScoresForCounsellor = async (studentId) => {
  const res = await API.get(`/assessment/scores/${studentId}`);
  return res.data.data;
};

export const getStudentPreferenceForCounsellor = async (studentId) => {
  const res = await API.get(`/assessment/preference/${studentId}`);
  return res.data.data;
};

export const getRecommendedCareersForCounsellor = async ({
  studentId,
  scores,
  economicStatus,
  language,
}) => {
  const res = await API.post(
    `/career/recommendations`,
    { scores, economicStatus, language },
    { params: { studentId } }
  );

  return res.data.data;
};
